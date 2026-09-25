// ============================================================================
// IMPORTS
// ============================================================================

// React Core
import React, { useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Icons
import { Mail, Lock, Check } from 'lucide-react';

// External Libraries
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

// Components
import AuthShell from '@/components/auth/AuthShell';
import AuthField from '@/components/auth/AuthField';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';

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
      navigate(APP_ROUTES.DASHBOARD, { replace: true });
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
        navigate(APP_ROUTES.DASHBOARD, { replace: true });
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
    <AuthShell>
      <div className="glass-surface rounded-xl p-7 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">Sign in</p>
        <h1 className="mt-3 font-display text-2xl font-semibold text-charcoal">Welcome back to OpsPilot</h1>
        <p className="mt-2 text-sm leading-6 text-charcoal/60">
          Use your work email to open your operations workspace.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 grid gap-5">
          <AuthField
            {...register('email')}
            label="Work email"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            autoFocus
            error={emailError}
          />
          <AuthField
            {...register('password')}
            label="Password"
            icon={Lock}
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            error={passwordError}
          />

          <div className="flex items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
              <input {...register('rememberMe')} type="checkbox" className="peer sr-only" />
              <span className="grid size-4 shrink-0 place-items-center rounded-sm border border-line bg-elevated text-panel peer-checked:border-gold peer-checked:bg-gold peer-checked:text-[#1a1a1a] [&_svg]:opacity-0 peer-checked:[&_svg]:opacity-100">
                <Check className="size-3" aria-hidden="true" />
              </span>
              Keep me signed in
            </label>
            <Link
              to={APP_ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-sm font-medium text-charcoal underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {apiError && (
            <p className="rounded-md bg-[#C0392B]/10 px-3 py-2 text-sm text-[#C0392B]" role="alert">
              {apiError}
            </p>
          )}

          <AuthSubmitButton loading={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </AuthSubmitButton>
        </form>

        <p className="mt-6 text-sm text-charcoal/60">
          Need an account?{' '}
          <a href="mailto:admin@opspilot.app" className="font-medium text-charcoal underline-offset-4 hover:underline">
            Request access
          </a>
        </p>
      </div>
    </AuthShell>
  );
};

export default Login;
