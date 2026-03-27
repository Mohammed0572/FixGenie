import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BugQueue() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIssues() {
      try {
        const userId = localStorage.getItem("username") || "default";
        const res = await fetch(`http://localhost:8000/issues/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setIssues(data.reverse()); // Show newest first
        }
      } catch (err) {
        console.error("Failed to load issues:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchIssues();
  }, []);

  const handleResolve = async (issueId) => {
    try {
      const userId = localStorage.getItem("username") || "default";
      const res = await fetch(`http://localhost:8000/issues/${userId}/${issueId}/resolve`, {
        method: "PATCH"
      });
      if (res.ok) {
        // Optimistically update the local state to show it resolved instantly
        setIssues(issues.map(i => i.id === issueId ? { ...i, status: "Resolved" } : i));
      }
    } catch (err) {
      console.error("Failed to resolve bug:", err);
    }
  };

  const handleView = async (issueId) => {
    try {
      const userId = localStorage.getItem("username") || "default";
      const res = await fetch(`http://localhost:8000/issues/${userId}/${issueId}`);
      if (res.ok) {
        const fullAnalysis = await res.json();
        navigate('/analyze', { state: { results: fullAnalysis } });
      }
    } catch (err) {
      console.error("Failed to lookup analysis payload:", err);
    }
  };

  if (loading) return <div className="p-8"><div className="spinner"></div></div>;

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pt-24 pb-12 animate-fade-in-up break-words whitespace-normal">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center sm:items-end text-center sm:text-left gap-6 w-full">
        <div className="flex-1 w-full max-w-full">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 font-headline bg-gradient-to-r from-sky-600 to-indigo-500 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent leading-normal pb-2 break-words">Active Bug Queue</h1>
          <p className="text-on-surface-variant dark:text-[#cbd5f5] max-w-2xl text-base md:text-lg font-body leading-relaxed">View all open assignments actively awaiting resolution across your workspace.</p>
        </div>
      </div>
      <div className="bg-surface-container-lowest dark:bg-[#0f172a] rounded-xl border border-outline-variant/15 w-full overflow-x-auto shadow-sm">
        <table className="w-full min-w-[700px] text-left">
          <thead className="bg-surface-container-low dark:bg-[#0f172a] border-b border-outline-variant/15 text-xs uppercase text-on-surface-variant font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4">Issue Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date Logged</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/15">
            {issues.map((issue, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-[#1e293b]/50 transition-colors">
                <td className="px-6 py-4 font-bold text-sm text-on-surface dark:text-[#f1f5f9]">{issue.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${issue.status === 'Resolved' || issue.status === 'Closed' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
                    {issue.status || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant dark:text-[#94a3b8]">{issue.date}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleView(issue.id)} className="px-3 py-1.5 rounded-lg border border-outline-variant text-[11px] font-bold text-on-surface dark:text-[#f1f5f9] hover:bg-surface-container dark:hover:bg-[#334155] transition-colors">
                    View
                  </button>
                  {issue.status !== 'Resolved' && issue.status !== 'Closed' && (
                    <button onClick={() => handleResolve(issue.id)} className="px-3 py-1.5 rounded-lg border border-primary text-primary text-[11px] font-bold hover:bg-primary hover:text-white transition-colors">
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {issues.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">No active bugs found in the system.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
