// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui';
import { APP_ROUTES } from '@/utils/routes';

// ============================================================================
// COMPONENT — GuestRoute
// ============================================================================

/**
 * Layout-based route guard: allows only unauthenticated users.
 * Authenticated users are redirected to /dashboard (admin) or /attendance (user).
 */
const GuestRoute: React.FC = () => {
  // ── HOOKS ──────────────────────────────────────────────────────────────────
  const { isAuthenticated, isAdmin, sessionRestored } = useAuth();

  // ── RENDER ─────────────────────────────────────────────────────────────────
  if (!sessionRestored) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBD4] dark:bg-[#121212]">
        <Spinner size="lg" className="text-[#D4AF37]" />
      </div>
    );
  }

  if (isAuthenticated) {
    const redirectTo =
    isAdmin ? APP_ROUTES.DASHBOARD : APP_ROUTES.ATTENDANCE.DASHBOARD;
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
