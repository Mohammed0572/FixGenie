import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ThemeToggle from '../components/ThemeToggle';

function SkeletonLoader() {
  return (
    <div className="lg:ml-64 min-h-screen bg-surface dark:bg-[#191c1e] p-8 lg:p-20 max-w-[1440px] mx-auto">
      <div className="mb-12">
        <div className="skeleton h-6 w-40 mb-4"></div>
        <div className="skeleton h-10 w-[60%] mb-3"></div>
        <div className="skeleton h-5 w-[80%]"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
        <div className="md:col-span-8 bg-surface-container-lowest dark:bg-[#111315] rounded-[1.5rem] p-8">
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
        <div className="md:col-span-4 bg-surface-container-low dark:bg-[#1e2124] rounded-[1.5rem] p-8">
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

  if (!data) {
    return (
      <div className="min-h-screen bg-surface dark:bg-[#191c1e] flex items-center justify-center font-body">
        <ThemeToggle />
        <div className="text-center animate-fade-in-up">
          <span className="material-symbols-outlined text-6xl text-outline mb-4 block">warning</span>
          <h2 className="font-headline text-2xl font-bold text-on-surface dark:text-[#e0e3e5] mb-2">No Analysis Data</h2>
          <p className="text-on-surface-variant dark:text-[#bec8d2] mb-6">Please submit a bug report from the dashboard first.</p>
          <button onClick={() => navigate('/dashboard')} className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all cursor-pointer">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (showSkeleton) {
    return (
      <div className="bg-surface dark:bg-[#191c1e] text-on-surface dark:text-[#e0e3e5] font-body transition-colors duration-300">
        <ThemeToggle />
        {/* Sidebar placeholder */}
        <aside className="h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-slate-50 dark:bg-[#1a1d1f] border-r border-slate-200/50 dark:border-[#2d3133]/50 p-4 z-40">
          <div className="mb-8 px-4">
            <div className="skeleton h-6 w-32 mb-2"></div>
            <div className="skeleton h-3 w-24"></div>
          </div>
          <div className="space-y-3 flex-1">
            {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-9 w-full rounded-xl"></div>)}
          </div>
        </aside>
        <SkeletonLoader />
      </div>
    );
  }

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
    <div className="bg-surface dark:bg-[#191c1e] text-on-surface dark:text-[#e0e3e5] font-body transition-colors duration-300">
      <ThemeToggle />

      {/* Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-slate-50 dark:bg-[#1a1d1f] border-r border-slate-200/50 dark:border-[#2d3133]/50 p-4 z-40">
        <div className="mb-8 px-4">
          <h1 className="text-lg font-bold text-slate-900 dark:text-[#e0e3e5]">FixGenie</h1>
          <p className="text-xs text-slate-500 dark:text-[#8e949a] font-medium uppercase tracking-wider">V2.4 Powered by ML</p>
        </div>
        <nav className="flex-1">
          {[
            { icon: 'dashboard', label: 'Overview' },
            { icon: 'bug_report', label: 'Active Bugs', active: true },
            { icon: 'psychology', label: 'AI Analysis' },
            { icon: 'group', label: 'Team' },
            { icon: 'settings', label: 'Settings' },
          ].map((item) => (
            <a
              key={item.label}
              className={`px-4 py-2 mb-1 flex items-center gap-3 rounded-xl transition-transform duration-200 hover:translate-x-1 ${
                item.active ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300' : 'text-slate-500 dark:text-[#8e949a] hover:bg-slate-200 dark:hover:bg-[#2d3133]'
              }`}
              href="#"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="mt-auto border-t border-slate-200/50 dark:border-[#2d3133]/50 pt-4">
          <button onClick={() => navigate('/dashboard')} className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 mb-4 shadow-sm active:scale-95 transition-transform cursor-pointer">
            <span className="material-symbols-outlined">add</span>New Report
          </button>
          <a className="text-slate-500 dark:text-[#8e949a] px-4 py-2 flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-[#2d3133] rounded-xl" href="#"><span className="material-symbols-outlined">help</span><span className="font-medium">Help Center</span></a>
          <a className="text-slate-500 dark:text-[#8e949a] px-4 py-2 flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-[#2d3133] rounded-xl cursor-pointer" href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            <span className="material-symbols-outlined">logout</span><span className="font-medium">Logout</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Top Nav */}
        <header className="bg-slate-50/80 dark:bg-[#1a1d1f]/80 backdrop-blur-xl sticky top-0 z-30 shadow-sm dark:shadow-none">
          <div className="flex justify-between items-center w-full px-6 py-3 max-w-[1440px] mx-auto">
            <div className="flex items-center gap-8">
              <span className="text-xl font-black tracking-tighter text-sky-700 dark:text-sky-400">FixGenie</span>
              <nav className="hidden md:flex gap-6">
                <a className="text-slate-500 dark:text-[#8e949a] font-medium hover:text-sky-600 transition-colors cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</a>
                <a className="text-sky-700 dark:text-sky-400 font-bold border-b-2 border-sky-600 dark:border-sky-400 pb-1" href="#">Bug Queue</a>
                <a className="text-slate-500 dark:text-[#8e949a] font-medium hover:text-sky-600 transition-colors" href="#">Insights</a>
                <a className="text-slate-500 dark:text-[#8e949a] font-medium hover:text-sky-600 transition-colors" href="#">Archive</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-500 hover:bg-slate-200/50 dark:hover:bg-[#2d3133]/50 rounded-lg transition-all active:scale-95">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#2d3133] overflow-hidden flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-500 text-[18px]">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 lg:p-20 max-w-[1440px] mx-auto">
          {/* Header */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-up">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-tertiary-container/10 text-tertiary-container text-xs font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                  ML Analysis Complete
                </span>
                <span className="text-slate-400 dark:text-[#8e949a] font-medium text-sm">Issue #BUG-7742</span>
              </div>
              <h2 className="text-4xl font-extrabold text-on-surface dark:text-[#e0e3e5] tracking-tight mb-2 font-headline">{data.title || issueText?.slice(0, 60) || 'Analysis Results'}</h2>
              <p className="text-on-surface-variant dark:text-[#bec8d2] max-w-2xl leading-relaxed">{data.description || 'The triage engine has processed your report and identified patterns. Suggested priority and labels are listed below.'}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/dashboard')} className="px-6 py-2.5 rounded-xl border border-outline-variant font-bold text-on-surface dark:text-[#e0e3e5] hover:bg-surface-container dark:hover:bg-[#252829] transition-all active:scale-95 cursor-pointer">Back to Dashboard</button>
              <button className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold shadow-md hover:bg-primary/90 transition-all active:scale-95 cursor-pointer">Approve &amp; Assign</button>
            </div>
          </div>

          {/* Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
            {/* Main Metrics */}
            <div className="md:col-span-8 bg-surface-container-lowest dark:bg-[#111315] rounded-[1.5rem] p-8 shadow-sm animate-fade-in-up-delay">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div className="space-y-8">
                  {/* Labels */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-[#8e949a] uppercase tracking-widest block mb-4">Suggested Labels</label>
                    <div className="flex flex-wrap gap-2">
                      {(data.labels || ['Bug', 'Frontend', 'UI']).map((label, i) => {
                        const colors = ['bg-slate-100 dark:bg-[#2d3133] text-slate-700 dark:text-[#bec8d2]', 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300', 'bg-secondary-container dark:bg-sky-900/20 text-on-secondary-container dark:text-sky-200'];
                        return (
                          <span key={i} className={`px-4 py-1.5 ${colors[i % colors.length]} font-semibold text-sm rounded-full`}>{label}</span>
                        );
                      })}
                    </div>
                  </div>
                  {/* Priority */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-[#8e949a] uppercase tracking-widest block mb-4">Priority Indicator</label>
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-2 px-4 py-2 ${priorityColors[data.priority] || priorityColors.High} rounded-full font-bold text-sm`}>
                        <span className={`w-2.5 h-2.5 ${priorityDot[data.priority] || priorityDot.High} rounded-full`}></span>
                        {data.priority || 'High'} Priority
                      </span>
                      <span className="text-xs text-on-surface-variant dark:text-[#8e949a] font-medium">Auto-escalated due to impact</span>
                    </div>
                  </div>
                </div>
                {/* Confidence */}
                <div className="flex flex-col justify-center">
                  <div className="text-center md:text-left">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-[#8e949a] uppercase tracking-widest block mb-4">Confidence Score</label>
                    <div className="relative inline-flex items-center justify-center mb-4">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle className="text-slate-100 dark:text-[#2d3133]" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8" />
                        <circle
                          className="text-primary transition-all duration-1000"
                          cx="64" cy="64" fill="transparent" r="58"
                          stroke="currentColor"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          strokeWidth="8"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-3xl font-black text-on-surface dark:text-[#e0e3e5]">{confidence}<span className="text-sm font-bold text-primary">%</span></span>
                    </div>
                    <p className="text-sm text-on-surface-variant dark:text-[#bec8d2] italic">High model confidence based on 450+ similar historical reports.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Issues */}
            <div className="md:col-span-4 bg-surface-container-low dark:bg-[#1e2124] rounded-[1.5rem] p-8 flex flex-col animate-fade-in-up-delay">
              <h3 className="font-bold text-on-surface dark:text-[#e0e3e5] mb-6 flex items-center justify-between font-headline">
                Similar Issues
                <span className="text-[10px] bg-slate-200 dark:bg-[#2d3133] px-2 py-0.5 rounded text-slate-600 dark:text-[#8e949a]">{(data.similar_issues || []).length} FOUND</span>
              </h3>
              <div className="space-y-4">
                {(data.similar_issues || []).map((issue, i) => (
                  <div key={i}>
                    <div className="group cursor-pointer">
                      <h4 className="text-sm font-bold text-on-surface dark:text-[#e0e3e5] group-hover:text-primary transition-colors">{issue.title}</h4>
                      <p className="text-xs text-on-surface-variant dark:text-[#8e949a]">{issue.status} • {issue.date}</p>
                    </div>
                    {i < (data.similar_issues || []).length - 1 && <div className="h-px bg-slate-200/50 dark:bg-[#2d3133] mt-4"></div>}
                  </div>
                ))}
              </div>
              <button className="mt-auto pt-6 text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                View analysis map <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* AI Suggested Fixes */}
          {data.solutions && data.solutions.length > 0 && (
            <div className="space-y-6 animate-fade-in-up-delay-2">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-bold tracking-tight font-headline">AI Suggested Fixes</h3>
                <div className="h-px flex-1 bg-slate-200/50 dark:bg-[#2d3133]"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.solutions.map((sol, i) => (
                  <div key={i} className="group relative bg-surface-container-lowest dark:bg-[#111315] rounded-[1.5rem] p-8 border-2 border-transparent hover:border-primary/20 transition-all cursor-pointer shadow-sm hover:shadow-xl">
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`w-12 h-12 ${i === 0 ? 'bg-sky-50 dark:bg-sky-900/30 text-primary' : 'bg-slate-50 dark:bg-[#252829] text-slate-400'} rounded-2xl flex items-center justify-center`}>
                        <span className="material-symbols-outlined">{sol.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-on-surface dark:text-[#e0e3e5]">{sol.title}</h4>
                        <span className={`text-xs font-bold ${i === 0 ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-[#8e949a]'} uppercase tracking-widest`}>{sol.tag}</span>
                      </div>
                    </div>
                    <p className="text-on-surface-variant dark:text-[#bec8d2] text-sm leading-relaxed mb-6">{sol.description}</p>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 dark:text-[#8e949a]">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">timer</span>{sol.time}</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">{sol.risk?.includes('Low') ? 'verified' : 'warning'}</span>{sol.risk}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating AI Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-primary text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group overflow-hidden cursor-pointer">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
          <span className="max-w-0 group-hover:max-w-xs transition-all duration-300 ease-out overflow-hidden whitespace-nowrap font-bold text-sm ml-0 group-hover:ml-3">Ask FixGenie</span>
        </button>
      </div>
    </div>
  );
}
