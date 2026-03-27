import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewReport() {
  const navigate = useNavigate();
  const [issueText, setIssueText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageAnalyzing, setImageAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
      setError('Please upload a PNG, JPEG, or WebP image.');
      return;
    }

    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    // Auto-analyze the image for text extraction
    setImageAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('text', '');
      formData.append('user_id', localStorage.getItem("username") || "default");

      const res = await fetch('http://localhost:8000/predict-image', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.image_detected_text) {
          setIssueText(prev => prev ? `${prev}\n\n${data.image_detected_text}` : data.image_detected_text);
        }
      }
    } catch {
      // Silently fail — user can still type manually
    } finally {
      setImageAnalyzing(false);
    }

    // Reset file input so same file can be re-selected
    e.target.value = '';
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const handleAnalyze = async () => {
    if (!issueText.trim() && !imageFile) {
      setError('Please enter a bug description or upload a screenshot.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const userId = localStorage.getItem("username") || "default";
      let res;

      if (imageFile) {
        // Multipart form with image
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('text', issueText);
        formData.append('user_id', userId);

        res = await fetch('http://localhost:8000/predict-image', {
          method: 'POST',
          body: formData,
        });
      } else {
        // Standard JSON text-only
        res = await fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: issueText, user_id: userId }),
        });
      }

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      navigate('/analyze', { state: { results: data, issueText } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pt-24 pb-12 animate-fade-in-up items-center text-center break-words whitespace-normal">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 font-headline bg-gradient-to-r from-sky-600 to-indigo-500 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent pb-2 leading-normal">Intelligence Triage</h1>
        <p className="text-on-surface-variant dark:text-[#cbd5f5] max-w-xl mx-auto text-lg font-body leading-relaxed">
          Input your technical findings below or upload a screenshot. Our ML model will seamlessly categorize, prioritize, and assign your bug in real-time.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto mt-2 mb-12 animate-fade-in-up-delay">

        {/* Image Preview */}
        {imagePreview && (
          <div className="w-full mb-4 animate-fade-in-up">
            <div className="relative inline-block group">
              <img
                src={imagePreview}
                alt="Uploaded screenshot"
                className="max-h-[120px] rounded-xl border border-[#1e293b] shadow-lg object-contain"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-error text-white flex items-center justify-center text-xs font-bold shadow-md hover:scale-110 active:scale-90 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                title="Remove image"
              >
                ✕
              </button>
              {imageAnalyzing && (
                <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center gap-2">
                  <div className="spinner w-4 h-4 border-2"></div>
                  <span className="text-xs font-bold text-white">Scanning...</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* ChatGPT Style Input Container */}
        <div className="w-full bg-surface-container-lowest dark:bg-[#0f172a] rounded-[1.5rem] border border-outline-variant/30 shadow-md shadow-slate-200/50 dark:shadow-none focus-within:ring-2 focus-within:ring-sky-500/40 focus-within:border-sky-500/50 focus-within:shadow-[0_0_25px_rgba(14,165,233,0.15)] focus-within:-translate-y-0.5 transition-all duration-300 flex items-end px-3 py-3 gap-3">
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={handleImageSelect}
          />

          {/* Upload button (replaces old +) */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-slate-400 dark:text-[#94a3b8] hover:text-primary dark:hover:text-primary hover:bg-primary/10 transition-all cursor-pointer mb-1 hover:scale-110 active:scale-95 relative group"
            title="Upload screenshot for AI analysis"
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: imageFile ? "'FILL' 1" : "'FILL' 0" }}>
              {imageFile ? 'image' : 'add_photo_alternate'}
            </span>
            {/* Tooltip */}
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#0f172a] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg">
              Upload screenshot
            </span>
          </button>
          
          <textarea
            className="flex-1 max-h-[200px] min-h-[44px] py-2.5 bg-transparent border-none focus:ring-0 outline-none text-on-surface dark:text-[#f8fafc] placeholder:text-slate-400 dark:placeholder:text-[#94a3b8] resize-none font-body text-base leading-relaxed overflow-hidden"
            placeholder={imageAnalyzing ? "Analyzing image..." : "Describe your bug or issue..."}
            value={issueText}
            disabled={imageAnalyzing}
            onChange={(e) => {
               setIssueText(e.target.value);
               e.target.style.height = 'auto';
               e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAnalyze();
              }
            }}
            rows={1}
          />

          <button
            onClick={handleAnalyze}
            disabled={loading || imageAnalyzing || (!issueText.trim() && !imageFile)}
            className="flex-shrink-0 w-10 h-10 sm:w-auto sm:px-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white flex items-center justify-center gap-2 shadow-md hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-1"
            title="Analyze Bug"
          >
            {loading ? (
              <div className="spinner w-[18px] h-[18px] border-2"></div>
            ) : (
              <>
                <span className="hidden sm:inline font-bold text-sm tracking-wide">Analyze</span>
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_upward</span>
              </>
            )}
          </button>
        </div>

        {/* Image analyzing indicator below the bar */}
        {imageAnalyzing && (
          <div className="mt-4 flex items-center gap-3 text-primary animate-fade-in-up">
            <div className="spinner w-4 h-4 border-2 border-primary/30 border-t-primary"></div>
            <span className="text-sm font-bold">AI is extracting text from your screenshot...</span>
          </div>
        )}
        
        {error && (
          <div className="mt-6 text-error text-sm font-medium flex items-center gap-2 animate-fade-in-up">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
