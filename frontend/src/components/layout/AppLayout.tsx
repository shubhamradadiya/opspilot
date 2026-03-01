// ============================================================================
// IMPORTS
// ============================================================================
import React, { useState, useCallback, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

// ============================================================================
// CONSTANTS
// ============================================================================
const SIDEBAR_COLLAPSED_KEY = 'sidebarCollapsed';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * AppLayout — wraps all authenticated pages with Sidebar + Topbar.
 * Manages sidebar collapse state, persisted in localStorage.
 */
const AppLayout: React.FC = () => {
  // ── STATE ──────────────────────────────────────────────────────────────────
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
  });

  // ── FUNCTIONS ──────────────────────────────────────────────────────────────
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  }, []);

  // ── EFFECTS — Mobile responsive: auto-collapse on narrow width ────────────
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setSidebarCollapsed(true);
      }
    };
    handler(mediaQuery);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="app-layout">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      <div className={`app-main ${sidebarCollapsed ? 'app-main--expanded' : ''}`}>
        <Topbar sidebarCollapsed={sidebarCollapsed} onToggleSidebar={toggleSidebar} />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
