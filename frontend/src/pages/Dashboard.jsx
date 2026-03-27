import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [username, setUsername] = useState('Developer');

  useEffect(() => {
    // Fetch user info for personalized greeting
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      // Capitalize first letter
      setUsername(storedUser.charAt(0).toUpperCase() + storedUser.slice(1));
    }

    async function fetchUserStats() {
      try {
        const userId = storedUser || "default";
        const res = await fetch(`http://localhost:8000/issues/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setIssues(data.reverse()); // latest first
        }
      } catch (err) {
        console.error("Failed to load generic stats:", err);
      }
    }
    fetchUserStats();
  }, []);

  const activeCount = issues.filter(i => i.status === 'Active').length;

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pt-24 pb-12 animate-fade-in-up break-words whitespace-normal">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center sm:items-end text-center sm:text-left gap-6">
        <div className="flex-1 w-full max-w-full">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 font-headline bg-gradient-to-r from-sky-600 to-indigo-500 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent leading-normal pb-2 break-words">Welcome Back, {username}</h1>
          <p className="text-on-surface-variant dark:text-[#cbd5f5] max-w-2xl text-base md:text-lg font-body leading-relaxed">Here is the high-level overview of your personal active projects and ML triage performance.</p>
        </div>
        <Link to="/new" className="hidden sm:flex bg-gradient-to-r from-primary to-primary-container text-white px-6 py-3 rounded-xl font-bold items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all">
          <span className="material-symbols-outlined">add</span> New Report
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Triage Stats Card */}
        <div className="bg-surface-container-lowest dark:bg-[#0f172a] rounded-xl p-6 border border-outline-variant/15 shadow-sm">
          <div className="flex items-center gap-2 text-primary mb-4">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            <span className="font-bold uppercase text-[10px] tracking-widest">Global Accuracy</span>
          </div>
          <p className="text-5xl font-black tracking-tighter text-on-surface dark:text-[#f1f5f9] mb-2">92.4%</p>
          <p className="text-sm font-medium text-success flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">trending_up</span> Consistent</p>
        </div>

        {/* Active Bugs Card */}
        <div className="bg-surface-container-lowest dark:bg-[#0f172a] rounded-xl p-6 border border-outline-variant/15 shadow-sm">
          <div className="flex items-center gap-2 text-error mb-4">
            <span className="material-symbols-outlined text-[20px]">bug_report</span>
            <span className="font-bold uppercase text-[10px] tracking-widest">Your Active Bugs</span>
          </div>
          <p className="text-5xl font-black tracking-tighter text-on-surface dark:text-[#f1f5f9] mb-2">{activeCount}</p>
          <p className="text-sm font-medium text-on-surface-variant dark:text-[#94a3b8]">waiting for resolution</p>
        </div>

        {/* Total Processed Card */}
        <div className="bg-surface-container-lowest dark:bg-[#0f172a] rounded-xl p-6 border border-outline-variant/15 shadow-sm">
          <div className="flex items-center gap-2 text-secondary mb-4">
            <span className="material-symbols-outlined text-[20px]">timer</span>
            <span className="font-bold uppercase text-[10px] tracking-widest">Total Reports</span>
          </div>
          <p className="text-5xl font-black tracking-tighter text-on-surface dark:text-[#f1f5f9] mb-2">{issues.length}</p>
          <p className="text-sm font-medium text-on-surface-variant dark:text-[#94a3b8]">processed by AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* History Card */}
        <div className="bg-surface-container-low dark:bg-[#0f172a] rounded-xl p-6 border border-outline-variant/15 flex flex-col">
          <div className="flex items-center gap-2 text-secondary mb-6">
            <span className="material-symbols-outlined text-[20px]">history</span>
            <span className="font-bold uppercase text-[10px] tracking-widest">Your Recent Activity</span>
          </div>
          <div className="space-y-6">
            {issues.slice(0, 3).map((issue, idx) => (
              <div key={idx} className="flex gap-4">
                <div className={`w-2.5 h-2.5 mt-1.5 rounded-full shrink-0 ${idx === 0 ? 'bg-primary' : (idx === 1 ? 'bg-success' : 'bg-slate-300 dark:bg-[#475569]')}`}></div>
                <div>
                  <p className="text-sm font-bold text-on-surface dark:text-[#f1f5f9] truncate max-w-[200px] md:max-w-xs">{issue.title}</p>
                  <p className="text-xs text-on-surface-variant dark:text-[#94a3b8]">Auto-triaged • {issue.date}</p>
                </div>
              </div>
            ))}
            {issues.length === 0 && (
              <p className="text-sm italic text-slate-500">You haven't reported any bugs yet.</p>
            )}
          </div>
          <Link to="/bugs" className="mt-8 pt-4 border-t border-outline-variant/10 text-xs font-bold text-primary uppercase tracking-widest block text-center hover:bg-primary/5 p-2 rounded transition-colors">View All Activity</Link>
        </div>

        {/* Quick Action Card */}
        <div className="bg-gradient-to-br from-tertiary-container/30 to-surface-container-low rounded-xl p-8 border border-outline-variant/15 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
            <span className="material-symbols-outlined text-3xl">add_task</span>
          </div>
          <h3 className="text-xl font-bold mb-3 text-on-surface">Spotted a new bug?</h3>
          <p className="text-sm text-on-surface-variant mb-6 max-w-[250px]">Paste your errors directly into our AI engine to get immediate triage priority and solutions.</p>
          <Link to="/new" className="bg-on-surface text-surface py-3 px-8 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">Start Analysis</Link>
        </div>
      </div>
    </div>
  );
}
