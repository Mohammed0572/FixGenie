import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState({ username: 'Developer', email: 'user@company.com' });
  const profileRef = useRef(null);

  useEffect(() => {
    setUser({
      username: localStorage.getItem("username") || 'Developer',
      email: localStorage.getItem("email") || 'No email attached'
    });

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    setIsProfileOpen(false);
    navigate('/');
  };

  const navItems = [
    { icon: 'dashboard', label: 'Overview', path: '/dashboard' },
    { icon: 'bug_report', label: 'Active Bugs', path: '/bugs' },
    { icon: 'psychology', label: 'AI Analysis', path: '/analyze' },
  ];

  return (
    <div className="bg-surface dark:bg-[#030712] text-on-surface dark:text-[#f1f5f9] flex min-h-screen font-body transition-colors duration-300">
      {/* Sidebar */}
      <aside className="bg-slate-50 dark:bg-[#030712] h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col p-4 border-r border-slate-200/50 dark:border-[#1e293b] z-40">
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20 flex-shrink-0">
            <img src="/logo.png" alt="FixGenie" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-[#f8fafc] tracking-tighter">FixGenie</h2>
          </div>
        </div>
        
        <Link to="/new" className="mb-6 w-full bg-primary hover:bg-primary/90 text-on-primary py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer">
          <span className="material-symbols-outlined">add</span>
          <span>New Report</span>
        </Link>
        
        <nav className="flex-1 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 dark:text-[#94a3b8] px-4 mb-2 uppercase tracking-widest">Navigation</div>
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`px-4 py-2 mb-1 flex items-center gap-3 rounded-xl transition-transform duration-200 hover:translate-x-1 ${
                location.pathname === item.path
                  ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300'
                  : 'text-slate-500 dark:text-[#94a3b8] hover:bg-slate-200 dark:hover:bg-[#1e293b]'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-[#1e293b] space-y-1">
          <button onClick={handleLogout} className="w-full text-slate-500 dark:text-[#94a3b8] px-4 py-2 flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-[#1e293b] rounded-xl transition-all cursor-pointer">
            <span className="material-symbols-outlined">logout</span><span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col relative w-full overflow-y-auto">
        {/* Top Nav */}
        <header className="bg-slate-50/80 dark:bg-[#030712]/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm dark:shadow-none border-b border-transparent dark:border-[#1e293b]">
          <div className="flex justify-between items-center w-full px-6 py-3 max-w-[1440px] mx-auto">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="flex items-center gap-2">
                <img src="/logo.png" alt="FixGenie" className="w-7 h-7 rounded-lg object-cover" />
                <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">FixGenie</span>
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link to="/dashboard" className={`font-bold transition-colors ${location.pathname === '/dashboard' ? 'text-sky-700 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400 pb-1' : 'text-slate-500 hover:text-sky-600'}`}>Dashboard</Link>
                <Link to="/bugs" className={`font-bold transition-colors ${location.pathname === '/bugs' ? 'text-sky-700 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400 pb-1' : 'text-slate-500 hover:text-sky-600'}`}>Bug Queue</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#334155] overflow-hidden border border-slate-300 dark:border-[#475569] flex items-center justify-center hover:ring-2 hover:ring-sky-500/50 transition-all cursor-pointer outline-none active:scale-95"
                >
                  <span className="material-symbols-outlined text-slate-500 dark:text-[#cbd5e1] text-[18px]">person</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute top-12 right-0 w-[220px] bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-outline-variant/20 dark:border-slate-700/50 p-2 animate-fade-in-up origin-top-right z-50">
                    <div className="px-3 py-3 border-b border-outline-variant/10 dark:border-slate-700/50 mb-2">
                      <p className="font-bold text-sm text-on-surface dark:text-[#f8fafc] capitalize truncate">{user.username}</p>
                      <p className="text-xs text-on-surface-variant dark:text-[#94a3b8] truncate">{user.email}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-[#cbd5e1] hover:bg-slate-50 dark:hover:bg-[#334155] rounded-xl transition-colors cursor-pointer text-left">
                        <span className="material-symbols-outlined text-[18px]">account_circle</span> My Profile
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-[#cbd5e1] hover:bg-slate-50 dark:hover:bg-[#334155] rounded-xl transition-colors cursor-pointer text-left">
                        <span className="material-symbols-outlined text-[18px]">settings</span> Preferences
                      </button>
                      <div className="h-px bg-outline-variant/10 dark:bg-slate-700/50 my-1"></div>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/10 hover:text-error rounded-xl transition-colors cursor-pointer text-left font-bold"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span> Code Red (Logout)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Body Injection Point */}
        <Outlet />
      </div>
    </div>
  );
}
