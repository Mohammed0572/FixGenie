import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../config';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const endpoint = isSignUp ? `${API_BASE}/signup` : `${API_BASE}/login`;
    const payload = isSignUp ? { username, email, password } : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication Failed");
      }

      // Store simple auth state
      localStorage.setItem("isLoggedIn", "true");
      if (data.username) localStorage.setItem("username", data.username);
      if (data.email) localStorage.setItem("email", data.email);
      
      navigate('/new');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-low dark:bg-[#030712] min-h-screen flex flex-col font-body transition-colors duration-300">
      <main className="flex-grow flex flex-col gap-6 items-center justify-center p-4 sm:p-6 md:p-12 w-full break-words whitespace-normal">
        <div className="w-full max-w-[480px] animate-fade-in-up px-2">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden shadow-xl shadow-primary/20 mb-5">
              <img src="/logo.png" alt="FixGenie" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-on-surface dark:text-[#f1f5f9] mb-2">FixGenie</h1>
            <p className="font-body text-on-surface-variant dark:text-[#cbd5f5] text-sm">AI-powered bug triage with editorial precision.</p>
          </div>
          
          {/* Card */}
          <div className="bg-surface-container-lowest dark:bg-[#0f172a] rounded-xl shadow-[0_10px_40px_-10px_rgba(59,130,246,0.08)] overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-outline-variant/15">
              <button 
                className={`flex-1 py-4 text-sm font-bold font-label transition-colors ${!isSignUp ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant dark:text-[#94a3b8] hover:bg-surface-container-low dark:hover:bg-[#1e293b]'}`}
                onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
              >
                Sign In
              </button>
              <button 
                className={`flex-1 py-4 text-sm font-bold font-label transition-colors ${isSignUp ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant dark:text-[#94a3b8] hover:bg-surface-container-low dark:hover:bg-[#1e293b]'}`}
                onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
              >
                Sign Up
              </button>
            </div>
            
            <div className="p-8 md:p-10">
              {errorMsg && (
                <div className="mb-6 p-3 bg-error/10 border border-error/20 rounded-lg flex items-center gap-3 text-error">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  <p className="text-xs font-bold uppercase tracking-wider">{errorMsg}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Username Input for Sign Up only */}
                {isSignUp && (
                  <div className="animate-fade-in">
                    <label className="block text-xs font-bold font-label uppercase tracking-[0.05em] text-on-surface-variant dark:text-[#94a3b8] mb-2">Username</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">person</span>
                      <input
                        className="w-full pl-12 pr-4 py-3 bg-surface-container dark:bg-[#0f172a] border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface dark:text-[#f1f5f9] placeholder:text-outline transition-all"
                        placeholder="developer_01"
                        type="text"
                        value={username}
                        required={isSignUp}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold font-label uppercase tracking-[0.05em] text-on-surface-variant dark:text-[#94a3b8] mb-2">Email Address</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
                    <input
                      className="w-full pl-12 pr-4 py-3 bg-surface-container dark:bg-[#0f172a] border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface dark:text-[#f1f5f9] placeholder:text-outline transition-all"
                      placeholder="name@company.com"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold font-label uppercase tracking-[0.05em] text-on-surface-variant dark:text-[#94a3b8]">Password</label>
                    {!isSignUp && <a className="text-[11px] font-bold text-primary hover:underline uppercase tracking-wider" href="#">Forgot Password?</a>}
                  </div>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock</span>
                    <input
                      className="w-full pl-12 pr-12 py-3 bg-surface-container dark:bg-[#0f172a] border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface dark:text-[#f1f5f9] placeholder:text-outline transition-all"
                      placeholder="••••••••"
                      type={showPw ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors" type="button" onClick={() => setShowPw(!showPw)}>
                      <span className="material-symbols-outlined text-[20px]">{showPw ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button 
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform duration-200 active:scale-95 cursor-pointer disabled:opacity-70 disabled:pointer-events-none" 
                  type="submit"
                >
                  {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Secure Log In')}
                </button>
              </form>
              
              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/20"></div></div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                  <span className="bg-surface-container-lowest dark:bg-[#0f172a] px-4 text-outline">or continue with</span>
                </div>
              </div>
              
              {/* Social */}
              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-surface-container-low dark:bg-[#0f172a] hover:bg-surface-container-high dark:hover:bg-[#1e293b] transition-colors text-on-surface-variant font-label text-sm border border-outline-variant/10 cursor-pointer">
                  <span className="material-symbols-outlined text-on-surface dark:text-[#f1f5f9]">g_mobiledata</span>
                  <span>Google</span>
                </button>
                <button type="button" className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-surface-container-low dark:bg-[#0f172a] hover:bg-surface-container-high dark:hover:bg-[#1e293b] transition-colors text-on-surface-variant font-label text-sm border border-outline-variant/10 cursor-pointer">
                  <span className="material-symbols-outlined text-on-surface dark:text-[#f1f5f9]">terminal</span>
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          </div>
          {/* Footer */}
          <p className="text-center mt-8 text-[11px] font-medium font-label text-on-surface-variant dark:text-[#64748b] uppercase tracking-widest leading-loose">
            Powered by Machine Learning<br />© 2025 FixGenie Systems Inc.
          </p>
        </div>
      </main>
      
      {/* Decorative Side */}
      <div className="hidden lg:block fixed left-12 bottom-12 max-w-xs opacity-40 mix-blend-multiply dark:mix-blend-screen pointer-events-none">
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full"></div>
          <div className="relative p-6 glass-panel rounded-xl border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">Live Analysis: Active Bugs (142)</span>
            </div>
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden"><div className="h-full bg-primary w-[70%]"></div></div>
              <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden"><div className="h-full bg-tertiary-container w-[45%]"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
