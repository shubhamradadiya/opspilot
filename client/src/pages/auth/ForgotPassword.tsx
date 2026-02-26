// ============================================================================
// IMPORTS
// ============================================================================

// React Core
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Icons
import { Mail, Lock, ArrowLeft, ChevronRight } from 'lucide-react';

// External Libraries
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

// Components - UI
import { Button, Input, OtpInput } from '@/components/ui';
import AuthLayout from '@/components/auth/AuthLayout';

// Stores
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
  selectAuthLoading,
  selectAuthError,
  selectFpStep,
  selectFpEmail,
  clearError,
  resetFpFlow,
} from '@/store/auth/auth.slice';
import { sendOtpThunk, verifyOtpThunk, resetPasswordThunk } from '@/store/auth/auth.thunk';

// Utils
import { APP_ROUTES } from '@/utils/routes';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface Step1Form { email: string; }
interface Step3Form { newPassword: string; confirmPassword: string; }

// ============================================================================
// CONSTANTS
// ============================================================================
const step1Schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const step3Schema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const STEP_TITLES: Record<1 | 2 | 3, { title: string; subtitle: string }> = {
  1: { title: 'Forgot password', subtitle: 'Enter your admin email to receive a verification code' },
  2: { title: 'Enter verification code', subtitle: 'Enter the 6-digit code sent to your email' },
  3: { title: 'Set new password', subtitle: 'Choose a strong password for your account' },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const ForgotPassword: React.FC = () => {
  // ── HOOKS - Stores ─────────────────────────────────────────────────────────
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const fpStep = useAppSelector(selectFpStep);
  const fpEmail = useAppSelector(selectFpEmail);

  // ── HOOKS - Router ─────────────────────────────────────────────────────────
  const navigate = useNavigate();

  // ── STATE ──────────────────────────────────────────────────────────────────
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');

  // ── HOOKS - Forms ──────────────────────────────────────────────────────────
  const step1Form = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
    defaultValues: { email: '' },
  });

  const step3Form = useForm<Step3Form>({
    resolver: zodResolver(step3Schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  // ── EFFECTS ────────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      dispatch(resetFpFlow());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearError());
    setOtpError('');
  }, [fpStep, dispatch]);

  // ── HANDLERS ───────────────────────────────────────────────────────────────
  const handleStep1Submit = useCallback(
    async (data: Step1Form) => {
      const result = await dispatch(sendOtpThunk({ email: data.email }));
      if (sendOtpThunk.fulfilled.match(result)) {
        toast.success('Verification code sent to your email');
      } else {
        toast.error(String(result.payload) || 'Failed to send OTP');
      }
    },
    [dispatch],
  );

  const handleStep2Submit = useCallback(async () => {
    if (otpValue.length < 6) {
      setOtpError('Please enter the complete 6-digit code');
      return;
    }
    if (!fpEmail) return;
    const result = await dispatch(verifyOtpThunk({ email: fpEmail, otp: otpValue }));
    if (verifyOtpThunk.fulfilled.match(result)) {
      toast.success('Code verified successfully');
    } else {
      setOtpError(String(result.payload) || 'Invalid verification code');
    }
  }, [dispatch, fpEmail, otpValue]);

  const handleStep3Submit = useCallback(
    async (data: Step3Form) => {
      if (!fpEmail) return;
      const result = await dispatch(
        resetPasswordThunk({ email: fpEmail, otp: otpValue, newPassword: data.newPassword }),
      );
      if (resetPasswordThunk.fulfilled.match(result)) {
        toast.success('Password reset successfully! Please sign in.');
        navigate(APP_ROUTES.AUTH.LOGIN, { replace: true });
      } else {
        toast.error(String(result.payload) || 'Password reset failed');
      }
    },
    [dispatch, fpEmail, otpValue, navigate],
  );

  const handleOtpChange = useCallback((val: string) => {
    setOtpValue(val);
    if (otpError) setOtpError('');
  }, [otpError]);

  // ── COMPUTED VALUES ────────────────────────────────────────────────────────
  const stepInfo = useMemo(() => STEP_TITLES[fpStep as 1 | 2 | 3], [fpStep]);
  const apiError = useMemo(() => authError, [authError]);

  // ── RENDER - Step indicators ───────────────────────────────────────────────
  const stepIndicators = useMemo(
    () => (
      <div className="flex items-center gap-1 mb-6">
        {([1, 2, 3] as const).map((step) => (
          <React.Fragment key={step}>
            <div
              className={`h-1.5 flex-1 rounded-full transition-colors duration-150 ${
                step <= fpStep
                  ? 'bg-blue-600 dark:bg-blue-400'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
            {step < 3 && (
              <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600 shrink-0" aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
      </div>
    ),
    [fpStep],
  );

  // ── RENDER - Main ──────────────────────────────────────────────────────────
  return (
    <AuthLayout>
      <div className="w-full max-w-[400px] bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-lg shadow-slate-200/60 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-700/80 p-8">
        {/* Back to login */}
        <Link
          to={APP_ROUTES.AUTH.LOGIN}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to sign in
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
            {stepInfo.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {stepInfo.subtitle}
          </p>
        </div>

        {/* Step indicators */}
        {stepIndicators}

        {/* API Error */}
        {apiError && fpStep !== 2 && (
          <div role="alert" className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-400">{apiError}</p>
          </div>
        )}

        {/* ── STEP 1: Enter email ──────────────────────────────────────────── */}
        {fpStep === 1 && (
          <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} noValidate className="flex flex-col gap-4">
            <Input
              {...step1Form.register('email')}
              type="email"
              label="Email address"
              placeholder="admin@example.com"
              autoComplete="email"
              autoFocus
              error={step1Form.formState.errors.email?.message}
              leftIcon={<Mail className="w-4 h-4" aria-hidden="true" />}
            />
            <Button type="submit" variant="primary" size="md" loading={isLoading} className="w-full mt-2">
              Send verification code
            </Button>
          </form>
        )}

        {/* ── STEP 2: Enter OTP ────────────────────────────────────────────── */}
        {fpStep === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Code sent to{' '}
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {fpEmail}
                </span>
              </p>
              <OtpInput
                value={otpValue}
                onChange={handleOtpChange}
                length={6}
                autoFocus
                error={otpError}
              />
            </div>
            <Button
              type="button"
              variant="primary"
              size="md"
              loading={isLoading}
              className="w-full mt-2"
              onClick={handleStep2Submit}
            >
              Verify code
            </Button>
          </div>
        )}

        {/* ── STEP 3: New password ─────────────────────────────────────────── */}
        {fpStep === 3 && (
          <form onSubmit={step3Form.handleSubmit(handleStep3Submit)} noValidate className="flex flex-col gap-4">
            <Input
              {...step3Form.register('newPassword')}
              type="password"
              label="New password"
              placeholder="••••••••"
              autoComplete="new-password"
              autoFocus
              error={step3Form.formState.errors.newPassword?.message}
              leftIcon={<Lock className="w-4 h-4" aria-hidden="true" />}
            />
            <Input
              {...step3Form.register('confirmPassword')}
              type="password"
              label="Confirm new password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={step3Form.formState.errors.confirmPassword?.message}
              leftIcon={<Lock className="w-4 h-4" aria-hidden="true" />}
            />
            <Button type="submit" variant="primary" size="md" loading={isLoading} className="w-full mt-2">
              Reset password
            </Button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
