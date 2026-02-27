// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui';
import { APP_ROUTES } from '@/utils/routes';

// ============================================================================
// COMPONENT — AuthRoute
// ============================================================================

/**
 * Layout-based route guard: requires authentication.
 * - Session not restored → full-page spinner (prevents login flash)
 * - Not authenticated   → redirect to /login?returnUrl=...
 * - Authenticated       → render child routes via <Outlet />
 */
const AuthRoute: React.FC = () => {
  // ── HOOKS ──────────────────────────────────────────────────────────────────
  const { isAuthenticated, sessionRestored } = useAuth();
  const location = useLocation();

  // ── RENDER ─────────────────────────────────────────────────────────────────
  if (!sessionRestored) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBD4] dark:bg-[#121212]">
        <Spinner size="lg" className="text-[#D4AF37]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const returnUrl = location.pathname + location.search;
    return (
      <Navigate
        to={`${APP_ROUTES.AUTH.LOGIN}?returnUrl=${encodeURIComponent(returnUrl)}`}
        replace
      />
    );
  }

  return <Outlet />;
};

export default AuthRoute;
