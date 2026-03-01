// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { APP_ROUTES } from '@/utils/routes';

// ============================================================================
// COMPONENT — AdminRoute
// ============================================================================

/**
 * Layout-based route guard: requires admin role.
 * Non-admin users are redirected to /attendance.
 */
const AdminRoute: React.FC = () => {
  // ── HOOKS ──────────────────────────────────────────────────────────────────
  const { isAdmin } = useAuth();

  // ── RENDER ─────────────────────────────────────────────────────────────────
  if (!isAdmin) {
    return <Navigate to={APP_ROUTES.ATTENDANCE.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
