// ============================================================================
// IMPORTS
// ============================================================================

// React Core
import React, { useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Icons
import { Mail, Lock } from 'lucide-react';

// External Libraries
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

// Components - UI
import { Button, Input } from '@/components/ui';
import AuthLayout from '@/components/auth/AuthLayout';

// Stores
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { selectAuthLoading, selectAuthError, selectIsAuthenticated, clearError } from '@/store/auth/auth.slice';
import { loginThunk } from '@/store/auth/auth.thunk';

// Utils
import { APP_ROUTES } from '@/utils/routes';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean(),
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const Login: React.FC = () => {
  // ── HOOKS - Stores ─────────────────────────────────────────────────────────
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // ── HOOKS - Router ─────────────────────────────────────────────────────────
  const navigate = useNavigate();

  // ── HOOKS - Form ───────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  // ── EFFECTS ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      navigate(APP_ROUTES.DASHBOARD.ADMIN, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // ── HANDLERS ───────────────────────────────────────────────────────────────
  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      const result = await dispatch(loginThunk({ email: data.email, password: data.password }));
      if (loginThunk.fulfilled.match(result)) {
        toast.success('Welcome back!');
        navigate(APP_ROUTES.DASHBOARD.ADMIN, { replace: true });
      } else {
        toast.error(String(result.payload) || 'Login failed');
      }
    },
    [dispatch, navigate],
  );

  // ── COMPUTED VALUES ────────────────────────────────────────────────────────
  const emailError = useMemo(() => errors.email?.message, [errors.email]);
  const passwordError = useMemo(() => errors.password?.message, [errors.password]);
  const apiError = useMemo(() => authError, [authError]);

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <AuthLayout>
      <div className="w-full max-w-[400px] bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-lg shadow-slate-200/60 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-700/80 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
            Sign in
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            ApexTrack
          </p>
        </div>

        {/* API Error */}
        {apiError && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
          >
            <p className="text-sm text-red-700 dark:text-red-400">{apiError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <Input
            {...register('email')}
            type="email"
            label="Email address"
            placeholder="admin@example.com"
            autoComplete="email"
            autoFocus
            error={emailError}
            leftIcon={<Mail className="w-4 h-4" aria-hidden="true" />}
          />

          <Input
            {...register('password')}
            type="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={passwordError}
            leftIcon={<Lock className="w-4 h-4" aria-hidden="true" />}
          />

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('rememberMe')}
                type="checkbox"
                className="h-4 w-4 rounded accent-blue-600"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Remember me
              </span>
            </label>
            <Link
              to={APP_ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-sm text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isLoading}
            className="w-full mt-2"
          >
            Sign in
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
