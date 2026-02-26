// ============================================================================
// IMPORTS
// ============================================================================
import { useState, useEffect, useCallback } from 'react';

// ============================================================================
// TYPES
// ============================================================================
type Theme = 'light' | 'dark';

// ============================================================================
// CONSTANTS
// ============================================================================
const THEME_KEY = 'theme';

// ============================================================================
// HOOK
// ============================================================================
export const useTheme = () => {
  // ── STATE ─────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;
    // Detect system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // ── EFFECTS ────────────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // ── ACTIONS ────────────────────────────────────────────────────────────────
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
};
