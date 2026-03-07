// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { APP_ROUTES } from '@/utils/routes';

// ============================================================================
// COMPONENT — FeatureFlagRoute
// ============================================================================

/**
 * Route guard: checks a user feature flag.
 *
 * - Admin users ALWAYS pass through (they manage all modules).
 * - For regular users, the flag must be explicitly `true` on their profile.
 * - When blocked, redirects to /attendance.
 *
 * Usage:
 *   <Route element={<FeatureFlagRoute flag="isExpenseEnabled" />}>
 *     <Route path="/expenses" element={<ExpenseList />} />
 *   </Route>
 */
const FeatureFlagRoute: React.FC<{ flag: string }> = ({ flag }) => {
  // ── HOOKS ──────────────────────────────────────────────────────────────────
  const { user, isAdmin } = useAuth();

  // ── RENDER ─────────────────────────────────────────────────────────────────

  // Admin bypasses all feature flags — they can access all modules
  if (isAdmin) {
    return <Outlet />;
  }

  // For regular users — check the flag on their profile
  const isEnabled = user && (user as unknown as Record<string, unknown>)[flag] === true;

  if (!isEnabled) {
    return <Navigate to={APP_ROUTES.ATTENDANCE.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default FeatureFlagRoute;
