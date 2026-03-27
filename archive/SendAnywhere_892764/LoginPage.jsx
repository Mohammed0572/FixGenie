import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="bg-surface-container-low dark:bg-[#191c1e] min-h-screen flex flex-col font-body transition-colors duration-300">
      <ThemeToggle />
      <main className="flex-grow flex items-center justify-center p-6 md:p-24">
        <div className="w-full max-w-[480px] animate-fade-in-up">
          {/* Brand */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 dark:bg-primary/20 mb-4">
              <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-on-surface dark:text-[#e0e3e5] mb-2">FixGenie</h1>
            <p className="font-body text-on-surface-variant dark:text-[#bec8d2] text-sm">AI-powered bug triage with editorial precision.</p>
          </div>
          {/* Card */}
          <div className="bg-surface-container-lowest dark:bg-[#111315] rounded-xl shadow-[0_10px_40px_-10px_rgba(0,101,145,0.08)] overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-outline-variant/15">
              <button className="flex-1 py-4 text-sm font-bold font-label text-primary border-b-2 border-primary">Sign In</button>
              <button className="flex-1 py-4 text-sm font-medium font-label text-on-surface-variant dark:text-[#8e949a] hover:bg-surface-container-low dark:hover:bg-[#1e2124] transition-colors">Sign Up</button>
            </div>
            <div className="p-8 md:p-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold font-label uppercase tracking-[0.05em] text-on-surface-variant dark:text-[#8e949a] mb-2">Email Address</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
                    <input
                      className="w-full pl-12 pr-4 py-3 bg-surface-container dark:bg-[#252829] border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface dark:text-[#e0e3e5] placeholder:text-outline transition-all"
                      placeholder="name@company.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold font-label uppercase tracking-[0.05em] text-on-surface-variant dark:text-[#8e949a]">Password</label>
                    <a className="text-[11px] font-bold text-primary hover:underline uppercase tracking-wider" href="#">Forgot Password?</a>
                  </div>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock</span>
                    <input
                      className="w-full pl-12 pr-12 py-3 bg-surface-container dark:bg-[#252829] border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface dark:text-[#e0e3e5] placeholder:text-outline transition-all"
                      placeholder="••••••••"
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors" type="button" onClick={() => setShowPw(!showPw)}>
                      <span className="material-symbols-outlined text-[20px]">{showPw ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
                {/* Submit */}
                <button className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform duration-200 active:scale-95 cursor-pointer" type="submit">
                  Secure Log In
                </button>
              </form>
              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/20"></div></div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                  <span className="bg-surface-container-lowest dark:bg-[#111315] px-4 text-outline">or continue with</span>
                </div>
              </div>
              {/* Social */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-surface-container-low dark:bg-[#1e2124] hover:bg-surface-container-high dark:hover:bg-[#2d3133] transition-colors text-on-surface-variant font-label text-sm border border-outline-variant/10 cursor-pointer">
                  <span className="material-symbols-outlined text-on-surface dark:text-[#e0e3e5]">g_mobiledata</span>
                  <span>Google</span>
                </button>
                <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-surface-container-low dark:bg-[#1e2124] hover:bg-surface-container-high dark:hover:bg-[#2d3133] transition-colors text-on-surface-variant font-label text-sm border border-outline-variant/10 cursor-pointer">
                  <span className="material-symbols-outlined text-on-surface dark:text-[#e0e3e5]">terminal</span>
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          </div>
          {/* Footer */}
          <p className="text-center mt-8 text-[11px] font-medium font-label text-on-surface-variant dark:text-[#8e949a] uppercase tracking-widest leading-loose">
            v2.4 Powered by Machine Learning<br />© 2024 FixGenie Systems Inc.
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
