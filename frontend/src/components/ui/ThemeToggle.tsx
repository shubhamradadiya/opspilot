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
        text-[#5A5A5A] dark:text-[#AAAAAA]
        hover:bg-[#F5F0D0] dark:hover:bg-[#252525]
        active:bg-[#E8E0B8] dark:active:bg-[#2E2E2E]
        transition-colors duration-100
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2
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
