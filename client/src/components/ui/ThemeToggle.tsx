// ============================================================================
// IMPORTS
// ============================================================================
import React, { useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const ThemeToggle: React.FC = () => {
  // ── HOOKS ──────────────────────────────────────────────────────────────────
  const { theme, toggleTheme } = useTheme();

  // ── HANDLERS ───────────────────────────────────────────────────────────────
  const handleToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="
        inline-flex items-center justify-center
        h-9 w-9 rounded-lg
        text-slate-600 dark:text-slate-400
        hover:bg-slate-100 dark:hover:bg-slate-800
        active:bg-slate-200 dark:active:bg-slate-700
        transition-colors duration-100
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-blue-600 focus-visible:ring-offset-2
        dark:focus-visible:ring-blue-400
      "
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggle;
