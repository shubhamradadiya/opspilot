// ============================================================================
// IMPORTS
// ============================================================================
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAppSelector } from '@/hooks/useRedux';
import { selectIsAuthenticated } from '@/store/auth/auth.slice';
import { APP_ROUTES } from '@/utils/routes';
import { Spinner } from '@/components/ui';

// ============================================================================
// LAZY IMPORTS — Pages
// ============================================================================
const Login = lazy(() => import('@/pages/auth/Login'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ChangePassword = lazy(() => import('@/pages/auth/ChangePassword'));

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

/** Require that user be authenticated to access route */
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.AUTH.LOGIN} replace />;
  }
  return <>{children}</>;
};

/** Redirect authenticated users away from auth pages */
const RedirectIfAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.DASHBOARD.ADMIN} replace />;
  }
  return <>{children}</>;
};

const PageFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
    <Spinner size="lg" className="text-blue-600 dark:text-blue-400" />
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const App: React.FC = () => {
  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Root → redirect to dashboard or login */}
          <Route path="/" element={<Navigate to={APP_ROUTES.DASHBOARD.ADMIN} replace />} />

          {/* Auth routes — redirect away if already authenticated */}
          <Route
            path={APP_ROUTES.AUTH.LOGIN}
            element={
              <RedirectIfAuth>
                <Login />
              </RedirectIfAuth>
            }
          />
          <Route
            path={APP_ROUTES.AUTH.FORGOT_PASSWORD}
            element={
              <RedirectIfAuth>
                <ForgotPassword />
              </RedirectIfAuth>
            }
          />

          {/* Protected routes */}
          <Route
            path={APP_ROUTES.AUTH.CHANGE_PASSWORD}
            element={
              <RequireAuth>
                <ChangePassword />
              </RequireAuth>
            }
          />

          {/* Dashboard placeholder — will be replaced in FE-02 */}
          <Route
            path={APP_ROUTES.DASHBOARD.ADMIN}
            element={
              <RequireAuth>
                <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                      Dashboard
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                      Coming soon — Phase FE-02
                    </p>
                  </div>
                </div>
              </RequireAuth>
            }
          />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to={APP_ROUTES.AUTH.LOGIN} replace />} />
        </Routes>
      </Suspense>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 4000,
        }}
      />
    </BrowserRouter>
  );
};

export default App;
