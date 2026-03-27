import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API_BASE from '../config';

function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
      <div className="mb-6 w-full">
        <div className="skeleton h-6 w-40 mb-4"></div>
        <div className="skeleton h-10 w-full md:w-[60%] mb-3"></div>
        <div className="skeleton h-5 w-full md:w-[80%]"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
        <div className="md:col-span-8 bg-surface-container-lowest dark:bg-[#0f172a] rounded-[1.5rem] p-8">
          <div className="skeleton h-4 w-32 mb-6"></div>
          <div className="flex flex-wrap gap-2 mb-8">
            <div className="skeleton h-8 w-16 rounded-full"></div>
            <div className="skeleton h-8 w-20 rounded-full"></div>
            <div className="skeleton h-8 w-14 rounded-full"></div>
          </div>
          <div className="skeleton h-4 w-32 mb-4"></div>
          <div className="skeleton h-10 w-36 rounded-full mb-8"></div>
          <div className="skeleton h-32 w-32 rounded-full mx-auto"></div>
        </div>
        <div className="md:col-span-4 bg-surface-container-low dark:bg-[#0f172a] rounded-[1.5rem] p-8">
          <div className="skeleton h-5 w-32 mb-6"></div>
          <div className="space-y-4">
            <div className="skeleton h-12 w-full"></div>
            <div className="skeleton h-12 w-full"></div>
            <div className="skeleton h-12 w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSkeleton, setShowSkeleton] = useState(true);

  const data = location.state?.results;
  const issueText = location.state?.issueText;

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleApprove = async () => {
    if (!data.id) return navigate('/bugs');
    try {
      const userId = localStorage.getItem("username") || "default";
      const res = await fetch(`${API_BASE}/issues/${userId}/${data.id}/resolve`, { method: "PATCH" });
      if (res.ok) navigate('/bugs');
    } catch (err) {
      console.error("Failed to approve bug:", err);
    }
  };

  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-up mt-20">
        <span className="material-symbols-outlined text-6xl text-outline mb-4 block">warning</span>
        <h2 className="font-headline text-2xl font-bold text-on-surface dark:text-[#f1f5f9] mb-2">No Analysis Data</h2>
        <p className="text-on-surface-variant dark:text-[#94a3b8] mb-6">Please submit a bug report from the dashboard first.</p>
        <button onClick={() => navigate('/new')} className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all">
          Submit Report
        </button>
      </div>
    );
  }

  if (showSkeleton) return <SkeletonLoader />;

  const priorityColors = {
    High: 'bg-error-container text-on-error-container',
    Medium: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    Low: 'bg-secondary-container text-on-secondary-container',
  };
  const priorityDot = {
    High: 'bg-error',
    Medium: 'bg-tertiary-container',
    Low: 'bg-secondary',
  };

  const confidence = data.confidence || 92;
  const circumference = 2 * Math.PI * 58;
  const offset = circumference - (confidence / 100) * circumference;

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pt-24 pb-12 animate-fade-in-up break-words whitespace-normal">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
        <div className="flex-1 w-full max-w-full">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-tertiary-container/10 text-tertiary-container text-[10px] md:text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider flex items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              ML Analysis Complete
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 font-headline bg-gradient-to-r from-sky-600 to-indigo-500 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent leading-normal pb-2 break-words">{data.title || 'Bug Report Analysis'}</h2>
          <p className="text-on-surface-variant dark:text-[#cbd5f5] max-w-2xl text-base md:text-lg font-body leading-relaxed">{data.description || 'The triage engine has processed your report and identified patterns. Suggested priority and labels are listed below.'}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/bugs')} className="px-6 py-2.5 rounded-xl border border-outline-variant font-bold text-on-surface dark:text-[#f1f5f9] hover:bg-surface-container dark:hover:bg-[#1e293b] transition-all cursor-pointer">View Queue</button>
          <button onClick={handleApprove} className="px-8 py-2.5 rounded-xl bg-primary text-white font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check</span> Approve
          </button>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
        {/* Main Metrics */}
        <div className="md:col-span-8 bg-surface-container-lowest dark:bg-[#0f172a] rounded-[1.5rem] p-8 shadow-sm border border-outline-variant/15 animate-fade-in-up-delay">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            <div className="space-y-8">
              {/* Labels */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-[#94a3b8] uppercase tracking-widest block mb-4">Suggested Labels</label>
                <div className="flex flex-wrap gap-2">
                  {(data.labels || ['Bug']).map((label, i) => {
                    const colors = ['bg-slate-100 dark:bg-[#334155] text-slate-700 dark:text-[#cbd5f5]', 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300', 'bg-secondary-container dark:bg-sky-900/20 text-on-secondary-container dark:text-sky-200'];
                    return <span key={i} className={`px-4 py-1.5 ${colors[i % colors.length]} font-semibold text-sm rounded-full`}>{label}</span>;
                  })}
                </div>
              </div>
              {/* Priority */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-[#94a3b8] uppercase tracking-widest block mb-4">Priority</label>
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-2 px-4 py-2 ${priorityColors[data.priority] || priorityColors.High} rounded-full font-bold text-sm`}>
                    <span className={`w-2.5 h-2.5 ${priorityDot[data.priority] || priorityDot.High} rounded-full`}></span>
                    {data.priority || 'High'} Priority
                  </span>
                </div>
              </div>
            </div>
            {/* Confidence */}
            <div className="flex flex-col justify-center">
              <div className="text-center md:text-left">
                <label className="text-[10px] font-bold text-slate-400 dark:text-[#94a3b8] uppercase tracking-widest block mb-4">ML Confidence Score</label>
                <div className="relative inline-flex items-center justify-center mb-4">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle className="text-slate-100 dark:text-[#334155]" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8" />
                    <circle
                      className="text-primary transition-all duration-1000"
                      cx="64" cy="64" fill="transparent" r="58"
                      stroke="currentColor" strokeDasharray={circumference} strokeDashoffset={offset} strokeWidth="8" strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-3xl font-black text-on-surface dark:text-[#f1f5f9]">{confidence}<span className="text-sm font-bold text-primary">%</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Issues */}
        <div className="md:col-span-4 bg-surface-container-low dark:bg-[#0f172a] rounded-[1.5rem] p-8 border border-outline-variant/15 flex flex-col animate-fade-in-up-delay">
          <h3 className="font-bold text-on-surface dark:text-[#f1f5f9] mb-6 flex items-center justify-between font-headline">
            Similar Issues
            <span className="text-[10px] bg-slate-200 dark:bg-[#334155] px-2 py-0.5 rounded text-slate-600 dark:text-[#94a3b8]">{(data.similar_issues || []).length} MATCHES</span>
          </h3>
          <div className="space-y-4">
            {(data.similar_issues || []).map((issue, i) => {
              const simScore = parseInt(issue.similarity.replace('%', ''), 10);
              const isHigh = simScore > 85;
              return (
                <div key={i} className={`p-4 rounded-xl border transition-colors ${isHigh ? 'border-primary/30 bg-primary/5' : 'border-outline-variant/15 hover:border-outline-variant/30'}`}>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h4 className="text-sm font-bold text-on-surface dark:text-[#f1f5f9]">{issue.title || issue.text}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ${isHigh ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>{issue.similarity} Match</span>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-[#94a3b8]">{issue.status} • {issue.date}</p>
                    <button className="text-[11px] font-bold text-primary hover:text-primary-container transition-colors uppercase tracking-wider bg-transparent border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary/10">Use This Fix</button>
                  </div>
                </div>
              );
            })}
            {(data.similar_issues || []).length === 0 && (
              <p className="text-sm text-slate-500 italic p-4">No duplicate matches found in user history.</p>
            )}
          </div>
        </div>
      </div>

      {/* Debug Steps */}
      {data.debug_steps && data.debug_steps.length > 0 && (
        <div className="space-y-6 mb-12 animate-fade-in-up-delay">
          <h3 className="text-2xl font-bold tracking-tight font-headline flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[28px]">terminal</span> Actionable Debugging Flow
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.debug_steps.map((step, i) => (
              <div key={i} className="bg-surface-container-lowest dark:bg-[#0f172a] rounded-xl p-6 border border-outline-variant/15 hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm group">
                <span className="text-[10px] font-black text-primary/40 group-hover:text-primary uppercase tracking-widest block mb-3 transition-colors">Step {i + 1}</span>
                <p className="text-sm font-bold text-on-surface dark:text-[#f1f5f9] leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Suggested Fixes */}
      {(data.root_cause || data.fix_steps) && (
        <div className="space-y-6 animate-fade-in-up-delay-2">
          <h3 className="text-2xl font-bold tracking-tight font-headline">AI Triaged Resolution</h3>
          <div className="bg-surface-container-lowest dark:bg-[#0f172a] rounded-[1.5rem] p-8 border border-outline-variant/15 hover:border-primary/40 transition-all shadow-sm flex flex-col">
            <div className="flex flex-col gap-2 mb-8 border-b border-outline-variant/15 pb-6">
              <span className="text-[10px] font-bold text-error uppercase tracking-widest">Root Cause Identified</span>
              <h4 className="text-lg font-bold text-on-surface dark:text-[#f1f5f9] leading-relaxed">{data.root_cause || "Analyzing telemetry for root cause insights..."}</h4>
            </div>
            
            <div className="mb-8 flex-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-4">Recommended Execution Steps</span>
              <div className="bg-surface-container-low dark:bg-[#0f172a] rounded-xl p-5 mb-6 border border-outline-variant/10">
                <ul className="space-y-4">
                  {(data.fix_steps || []).map((step, idx) => (
                    <li key={idx} className="flex gap-4 text-sm text-on-surface dark:text-[#f1f5f9] items-start">
                      <span className="font-bold text-primary bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0">{idx + 1}</span>
                      <span className="leading-relaxed mt-0.5">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <span className="text-[10px] font-bold text-success uppercase tracking-widest block mb-2">Long-Term Prevention</span>
              <p className="text-sm text-on-surface-variant dark:text-[#cbd5f5] leading-relaxed italic border-l-2 border-success/50 pl-4 py-1">
                {data.prevention || "Implement standard regression tests."}
              </p>
            </div>

            <div className="mt-4 flex gap-4 pt-4 border-t border-outline-variant/10">
              <button className="flex-1 py-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high dark:bg-[#1e293b] dark:hover:bg-[#334155] font-bold text-sm transition-colors cursor-pointer" onClick={(e) => { e.currentTarget.innerText = 'Copied to Clipboard!'; setTimeout(() => e.currentTarget.innerText='Copy Instructions', 2500); }}>Copy Instructions</button>
              <button onClick={handleApprove} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm hover:scale-[1.01] shadow-lg shadow-primary/20 transition-all flex justify-center items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span> Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
