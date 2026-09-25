// ============================================================================
// IMPORTS
// ============================================================================
import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAppDispatch } from '@/hooks/useRedux';
import { useAuth } from '@/hooks/useAuth';
import { getMeThunk } from '@/store/auth/auth.thunk';
import { APP_ROUTES } from '@/utils/routes';
import { Spinner } from '@/components/ui';

// ============================================================================
// LAZY IMPORTS — Guards
// ============================================================================
const AuthRoute = lazy(() => import('@/components/guards/AuthRoute'));
const AdminRoute = lazy(() => import('@/components/guards/AdminRoute'));
const GuestRoute = lazy(() => import('@/components/guards/GuestRoute'));
const FeatureFlagRoute = lazy(() => import('@/components/guards/FeatureFlagRoute'));

// ============================================================================
// LAZY IMPORTS — Layout
// ============================================================================
const AppLayout = lazy(() => import('@/components/layout/AppLayout'));

// ============================================================================
// LAZY IMPORTS — Auth Pages
// ============================================================================
const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/auth/Login'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ChangePassword = lazy(() => import('@/pages/auth/ChangePassword'));

// ============================================================================
// LAZY IMPORTS — App Pages
// ============================================================================
const AdminDashboard = lazy(() => import('@/pages/dashboard/AdminDashboard'));
const EmployeeList = lazy(() => import('@/pages/employees/EmployeeList'));
const CreateEmployee = lazy(() => import('@/pages/employees/CreateEmployee'));
const EditEmployee = lazy(() => import('@/pages/employees/EditEmployee'));
const AttendanceDashboard = lazy(() => import('@/pages/attendance/AttendanceDashboard'));
const AttendanceLogs = lazy(() => import('@/pages/attendance/AttendanceLogs'));
const AttendanceTimestamps = lazy(() => import('@/pages/attendance/AttendanceTimestamps'));
const PayoutList = lazy(() => import('@/pages/payouts/PayoutList'));
const CreatePayout = lazy(() => import('@/pages/payouts/CreatePayout'));
const InventoryList = lazy(() => import('@/pages/inventory/InventoryList'));
const ActivityLogs = lazy(() => import('@/pages/inventory/ActivityLogs'));
const ExpenseList = lazy(() => import('@/pages/expenses/ExpenseList'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const WalkInCustomerList = lazy(() => import('@/pages/walkInCustomers/WalkInCustomerList'));
const RingCustomerList = lazy(() => import('@/pages/ringCustomers/RingCustomerList'));
const ContainerList = lazy(() => import('@/pages/containers/ContainerList'));
const ContainerDetail = lazy(() => import('@/pages/containers/ContainerDetail'));

// ============================================================================
// CONSTANTS
// ============================================================================

/** Placeholder page factory — renders a centered title for modules not yet built */
const createPlaceholder = (title: string): React.FC => {
  const Placeholder: React.FC = () => (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">{title}</h1>
        <p className="text-[#9A9A9A] dark:text-[#666666] mt-2">Coming soon</p>
      </div>
    </div>
  );
  Placeholder.displayName = `${title}Placeholder`;
  return Placeholder;
};

const DashboardPage = AdminDashboard;
const WalkInPage = WalkInCustomerList;
const RingPage = RingCustomerList;
const ContainersPage = ContainerList;
const SettingsPage = createPlaceholder('Settings');

// ============================================================================
// HELPER COMPONENTS
// ============================================================================
const PageFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FDFBD4] dark:bg-[#121212]">
    <Spinner size="lg" className="text-[#D4AF37]" />
  </div>
);

// ============================================================================
// SESSION BOOTSTRAP COMPONENT
// ============================================================================

/**
 * Dispatches getMeThunk on mount to restore the user session from the stored token.
 * Wraps BrowserRouter so hooks like useNavigate are available in children.
 */
const AppRoutes: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAdmin, sessionRestored, isAuthenticated } = useAuth();

  useEffect(() => {
    dispatch(getMeThunk());
  }, [dispatch]);

  return (
    <Routes>
      {/* Root → landing for guests; signed-in users go to their workspace */}
      <Route
        path="/"
        element={
          !sessionRestored ? (
            <PageFallback />
          ) : isAuthenticated ? (
            <Navigate to={isAdmin ? APP_ROUTES.DASHBOARD : APP_ROUTES.ATTENDANCE.DASHBOARD} replace />
          ) : (
            <Landing />
          )
        }
      />

      {/* ── Guest routes (login, forgot password) ── */}
      <Route element={<GuestRoute />}>
        <Route path={APP_ROUTES.AUTH.LOGIN} element={<Login />} />
        <Route path={APP_ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} />
      </Route>

      {/* ── Authenticated routes (inside AppLayout) ── */}
      <Route element={<AuthRoute />}>
        <Route element={<AppLayout />}>
          {/* Admin-only routes */}
          <Route element={<AdminRoute />}>
            <Route path={APP_ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={APP_ROUTES.EMPLOYEES.LIST} element={<EmployeeList />} />
            <Route path={APP_ROUTES.EMPLOYEES.CREATE} element={<CreateEmployee />} />
            <Route path={APP_ROUTES.EMPLOYEES.EDIT} element={<EditEmployee />} />
          </Route>

          {/* Attendance Dashboard — user only; admin is redirected to /dashboard */}
          <Route
            path={APP_ROUTES.ATTENDANCE.DASHBOARD}
            element={
              isAdmin
                ? <Navigate to={APP_ROUTES.DASHBOARD} replace />
                : <AttendanceDashboard />
            }
          />
          <Route path={APP_ROUTES.ATTENDANCE.LOGS} element={<AttendanceLogs />} />

          {/* Payouts — all users */}
          <Route path={APP_ROUTES.PAYOUTS.LIST} element={<PayoutList />} />

          {/* Attendance timestamps + Create payout — admin only */}
          <Route element={<AdminRoute />}>
            <Route path={APP_ROUTES.ATTENDANCE.TIMESTAMPS} element={<AttendanceTimestamps />} />
            <Route path={APP_ROUTES.PAYOUTS.CREATE} element={<CreatePayout />} />
          </Route>
          <Route path={APP_ROUTES.INVENTORY.LIST} element={<InventoryList />} />
          <Route element={<AdminRoute />}>
            <Route path={APP_ROUTES.INVENTORY.ACTIVITY_LOGS} element={<ActivityLogs />} />
          </Route>
          <Route element={<FeatureFlagRoute flag="isExpenseEnabled" />}>
            <Route path={APP_ROUTES.EXPENSES} element={<ExpenseList />} />
          </Route>
          
          <Route element={<FeatureFlagRoute flag="isWalkInCustomerEnabled" />}>
            <Route path={APP_ROUTES.WALK_IN_CUSTOMERS} element={<WalkInPage />} />
          </Route>

          <Route element={<FeatureFlagRoute flag="isRingCustomerEnabled" />}>
            <Route path={APP_ROUTES.RING_CUSTOMERS} element={<RingPage />} />
          </Route>

          <Route element={<FeatureFlagRoute flag="isContainerEnabled" />}>
             <Route path={APP_ROUTES.CONTAINERS} element={<ContainersPage />} />
             <Route path={APP_ROUTES.CONTAINER_DETAIL} element={<ContainerDetail />} />
          </Route>
          <Route path={APP_ROUTES.SETTINGS} element={<SettingsPage />} />
          <Route path={APP_ROUTES.AUTH.CHANGE_PASSWORD} element={<ChangePassword />} />

          {/* 404 fallback (inside layout) */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <AppRoutes />
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
