import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed top-6 right-6 z-50">
      <button
        onClick={toggleTheme}
        className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 text-on-surface-variant hover:bg-surface-container-high transition-all shadow-sm cursor-pointer"
        aria-label="Toggle theme"
      >
        <span className="material-symbols-outlined text-[20px]">
          {theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
        <span className="text-xs font-bold font-label uppercase tracking-wider">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </span>
      </button>
    </div>
  );
}
