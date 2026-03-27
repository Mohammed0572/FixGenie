import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function Dashboard() {
  const navigate = useNavigate();
  const [issueText, setIssueText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!issueText.trim()) {
      setError('Please enter a bug description before analyzing.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: issueText }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      navigate('/results', { state: { results: data, issueText } });
    } catch (err) {
      console.warn('API unavailable, using mock data:', err.message);
      // Fallback mock response for demo
      const mockData = {
        labels: ['Bug', 'Frontend', 'UI', 'Authentication'],
        priority: 'High',
        confidence: 92,
        title: issueText.slice(0, 60) || 'Unexpected Null Pointer in Auth Flow',
        description: 'The triage engine has processed the crash log and identified a regression in the session management middleware.',
        similar_issues: [
          { title: 'Session timeout redirect loop in v2.3', status: 'Closed', date: 'Dec 12, 2023' },
          { title: 'Header missing token on refresh', status: 'Active', date: 'Jan 04, 2024' },
          { title: 'OAuth callback state mismatch', status: 'Resolved', date: 'Nov 29, 2023' },
        ],
        solutions: [
          {
            title: 'Solution 1: Middleware Validation',
            tag: 'Recommended • Logic Fix',
            description: 'Implement a null-check guard in the `auth-middleware.ts` before accessing user properties.',
            time: '15m fix',
            risk: 'Low Risk',
            icon: 'code',
          },
          {
            title: 'Solution 2: Schema Migration',
            tag: 'Architectural • Data Fix',
            description: 'Update the PostgreSQL schema to ensure the `last_session_id` column defaults to a UUID string instead of NULL.',
            time: '2h migration',
            risk: 'Moderate Risk',
            icon: 'database',
          },
        ],
      };
      navigate('/results', { state: { results: mockData, issueText } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface dark:bg-[#191c1e] text-on-surface dark:text-[#e0e3e5] flex min-h-screen font-body transition-colors duration-300">
      {/* Sidebar */}
      <aside className="bg-slate-50 dark:bg-[#1a1d1f] h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col p-4 border-r border-slate-200/50 dark:border-[#2d3133]/50">
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#e0e3e5] leading-tight">FixGenie</h2>
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary opacity-80">V2.4 Powered by ML</p>
          </div>
        </div>
        <button className="mb-6 w-full bg-primary hover:bg-primary/90 text-on-primary py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer">
          <span className="material-symbols-outlined">add</span>
          <span>New Report</span>
        </button>
        <nav className="flex-1 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 dark:text-[#8e949a] px-4 mb-2 uppercase tracking-widest">Navigation</div>
          {[
            { icon: 'dashboard', label: 'Overview', active: false },
            { icon: 'bug_report', label: 'Active Bugs', active: true },
            { icon: 'psychology', label: 'AI Analysis', active: false },
            { icon: 'group', label: 'Team', active: false },
            { icon: 'settings', label: 'Settings', active: false },
          ].map((item) => (
            <a
              key={item.label}
              className={`px-4 py-2 mb-1 flex items-center gap-3 rounded-xl transition-transform duration-200 hover:translate-x-1 ${
                item.active
                  ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300'
                  : 'text-slate-500 dark:text-[#8e949a] hover:bg-slate-200 dark:hover:bg-[#2d3133]'
              }`}
              href="#"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-[#2d3133]/50 space-y-1">
          <a className="text-slate-500 dark:text-[#8e949a] px-4 py-2 mb-1 flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-[#2d3133] rounded-xl transition-all" href="#">
            <span className="material-symbols-outlined">help</span><span className="font-medium">Help Center</span>
          </a>
          <a className="text-slate-500 dark:text-[#8e949a] px-4 py-2 mb-1 flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-[#2d3133] rounded-xl transition-all" href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            <span className="material-symbols-outlined">logout</span><span className="font-medium">Logout</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col relative min-h-screen">
        {/* Top Nav */}
        <header className="bg-slate-50/80 dark:bg-[#1a1d1f]/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm dark:shadow-none">
          <div className="flex justify-between items-center w-full px-6 py-3 max-w-[1440px] mx-auto">
            <div className="flex items-center gap-8">
              <span className="text-xl font-black tracking-tighter text-sky-700 dark:text-sky-400">FixGenie</span>
              <nav className="hidden md:flex gap-6">
                <a className="text-slate-500 dark:text-[#8e949a] font-medium hover:text-sky-600 transition-colors" href="#">Dashboard</a>
                <a className="text-sky-700 dark:text-sky-400 font-bold border-b-2 border-sky-600 dark:border-sky-400 pb-1" href="#">Bug Queue</a>
                <a className="text-slate-500 dark:text-[#8e949a] font-medium hover:text-sky-600 transition-colors" href="#">Insights</a>
                <a className="text-slate-500 dark:text-[#8e949a] font-medium hover:text-sky-600 transition-colors" href="#">Archive</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button className="p-2 text-slate-500 hover:bg-slate-200/50 dark:hover:bg-[#2d3133]/50 rounded-lg transition-all relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white dark:border-[#1a1d1f]"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#2d3133] overflow-hidden border border-slate-300 dark:border-[#3a3d40] flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-500 text-[18px]">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-8 md:p-12 lg:p-20 flex-1 max-w-5xl mx-auto w-full">
          <div className="mb-12 animate-fade-in-up">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface dark:text-[#e0e3e5] mb-2 font-headline">Intelligence Triage</h1>
            <p className="text-on-surface-variant dark:text-[#bec8d2] max-w-2xl text-lg font-body">Input your technical findings below. Our ML model will categorize, prioritize, and assign your bug in real-time.</p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Main Input Card */}
            <div className="md:col-span-3 bg-surface-container-lowest dark:bg-[#111315] rounded-xl p-6 shadow-[0_10px_40px_-10px_rgba(0,101,145,0.08)] flex flex-col gap-4 border border-outline-variant/15 animate-fade-in-up-delay">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-surface-container dark:bg-[#252829] text-on-surface-variant text-xs font-bold uppercase tracking-wider">Draft #4209</span>
                  <span className="px-3 py-1 rounded-full bg-secondary-container dark:bg-sky-900/30 text-on-secondary-container dark:text-sky-300 text-xs font-bold uppercase tracking-wider">AI Assistant Ready</span>
                </div>
              </div>
              <textarea
                className="w-full min-h-[300px] border-none focus:ring-0 text-xl font-body text-on-surface dark:text-[#e0e3e5] placeholder:text-slate-300 dark:placeholder:text-[#4a4d50] resize-none bg-transparent"
                placeholder="Enter your bug / issue description... Paste logs, stack traces, or observed behaviors here."
                value={issueText}
                onChange={(e) => setIssueText(e.target.value)}
              />
              {error && (
                <div className="text-error text-sm font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {error}
                </div>
              )}
              <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-surface-container dark:bg-[#252829] flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined">add</span>
                    </div>
                    <span className="text-sm font-semibold">Attachments</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-surface-container dark:bg-[#252829] flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined">tag</span>
                    </div>
                    <span className="text-sm font-semibold">Label</span>
                  </button>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-3 rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze</span>
                      <span className="material-symbols-outlined text-[20px]">bolt</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Insight Card */}
            <div className="bg-tertiary-container/10 border-l-4 border-tertiary-container rounded-xl p-6 relative overflow-hidden group animate-fade-in-up-delay-2">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-tertiary mb-3">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <span className="font-bold uppercase text-[10px] tracking-widest">Real-time Insight</span>
                </div>
                <h3 className="font-bold text-on-surface dark:text-[#e0e3e5] mb-2">Likely Duplicate</h3>
                <p className="text-sm text-on-surface-variant dark:text-[#bec8d2] leading-relaxed">Similar behavior detected in <span className="text-primary font-bold">#BUG-182</span>. High confidence match for Memory Leak patterns.</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[100px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              </div>
            </div>

            {/* Metadata Card */}
            <div className="bg-surface-container-low dark:bg-[#1e2124] rounded-xl p-6 border border-outline-variant/15 animate-fade-in-up-delay-2">
              <div className="flex items-center gap-2 text-secondary mb-3">
                <span className="material-symbols-outlined text-[20px]">analytics</span>
                <span className="font-bold uppercase text-[10px] tracking-widest">Contextual Data</span>
              </div>
              <ul className="space-y-3">
                <li className="flex justify-between items-center text-sm"><span className="text-on-surface-variant dark:text-[#bec8d2]">Environment</span><span className="font-bold text-on-surface dark:text-[#e0e3e5]">Staging-V4</span></li>
                <li className="flex justify-between items-center text-sm"><span className="text-on-surface-variant dark:text-[#bec8d2]">Browser</span><span className="font-bold text-on-surface dark:text-[#e0e3e5]">Chrome 118</span></li>
                <li className="flex justify-between items-center text-sm"><span className="text-on-surface-variant dark:text-[#bec8d2]">Latency</span><span className="font-bold text-on-surface dark:text-[#e0e3e5] text-error">420ms</span></li>
              </ul>
            </div>

            {/* History Card */}
            <div className="bg-surface-container-low dark:bg-[#1e2124] rounded-xl p-6 border border-outline-variant/15 flex flex-col animate-fade-in-up-delay-2">
              <div className="flex items-center gap-2 text-secondary mb-3">
                <span className="material-symbols-outlined text-[20px]">history</span>
                <span className="font-bold uppercase text-[10px] tracking-widest">Recent Activity</span>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0"></div>
                  <div>
                    <p className="text-xs font-bold text-on-surface dark:text-[#e0e3e5]">Resolved #BUG-201</p>
                    <p className="text-[10px] text-on-surface-variant dark:text-[#8e949a]">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-slate-300 dark:bg-[#4a4d50] shrink-0"></div>
                  <div>
                    <p className="text-xs font-bold text-on-surface dark:text-[#e0e3e5]">Comment on #FEAT-12</p>
                    <p className="text-[10px] text-on-surface-variant dark:text-[#8e949a]">Yesterday</p>
                  </div>
                </div>
              </div>
              <button className="mt-auto pt-4 text-[10px] font-bold text-primary uppercase tracking-widest text-center hover:underline cursor-pointer">View All History</button>
            </div>
          </div>

          {/* Footer */}
          <footer className="flex items-center justify-center gap-8 py-8 opacity-40 grayscale hover:grayscale-0 transition-all cursor-default">
            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">terminal</span><span className="text-[10px] font-bold tracking-widest uppercase">Kernel Verified</span></div>
            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">lock</span><span className="text-[10px] font-bold tracking-widest uppercase">End-to-End Encrypted</span></div>
            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">cloud_done</span><span className="text-[10px] font-bold tracking-widest uppercase">Sync Active</span></div>
          </footer>
        </div>
      </main>
    </div>
  );
}
