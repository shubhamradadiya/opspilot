// ============================================================================
// IMPORTS
// ============================================================================

// React Core
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Icons
import { Mail, Lock, KeyRound } from 'lucide-react';

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

const STEP_COPY: Record<1 | 2 | 3, { title: string; description: string }> = {
  1: { title: 'Reset your password', description: 'Enter your work email and we will send a six-digit verification code.' },
  2: { title: 'Enter your code', description: 'Check your inbox for the six-digit code we just sent.' },
  3: { title: 'Choose a new password', description: 'Pick a strong password you have not used before.' },
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
    setOtpValue(val.replace(/\D/g, '').slice(0, 6));
    if (otpError) setOtpError('');
  }, [otpError]);

  // ── COMPUTED VALUES ────────────────────────────────────────────────────────
  const stepInfo = useMemo(() => STEP_COPY[fpStep as 1 | 2 | 3], [fpStep]);
  const apiError = useMemo(() => authError, [authError]);

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <AuthShell>
      <div className="glass-surface rounded-xl p-7 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">
          Step {fpStep} of 3
        </p>
        <h1 className="mt-3 font-display text-2xl font-semibold text-charcoal">{stepInfo.title}</h1>
        <p className="mt-2 text-sm leading-6 text-charcoal/60">{stepInfo.description}</p>

        {apiError && fpStep !== 2 && (
          <p className="mt-5 rounded-md bg-[#C0392B]/10 px-3 py-2 text-sm text-[#C0392B]" role="alert">
            {apiError}
          </p>
        )}

        {fpStep === 1 && (
          <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} noValidate className="mt-7 grid gap-5">
            <AuthField
              {...step1Form.register('email')}
              label="Work email"
              icon={Mail}
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              autoFocus
              error={step1Form.formState.errors.email?.message}
            />
            <AuthSubmitButton loading={isLoading}>Send code</AuthSubmitButton>
          </form>
        )}

        {fpStep === 2 && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleStep2Submit();
            }}
            className="mt-7 grid gap-5"
          >
            <AuthField
              label="Verification code"
              icon={KeyRound}
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={otpValue}
              onChange={(event) => handleOtpChange(event.target.value)}
              error={otpError || undefined}
              autoFocus
            />
            <AuthSubmitButton loading={isLoading}>Verify code</AuthSubmitButton>
          </form>
        )}

        {fpStep === 3 && (
          <form onSubmit={step3Form.handleSubmit(handleStep3Submit)} noValidate className="mt-7 grid gap-5">
            <AuthField
              {...step3Form.register('newPassword')}
              label="New password"
              icon={Lock}
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              autoFocus
              error={step3Form.formState.errors.newPassword?.message}
            />
            <AuthField
              {...step3Form.register('confirmPassword')}
              label="Confirm password"
              icon={Lock}
              type="password"
              autoComplete="new-password"
              placeholder="Repeat the password"
              error={step3Form.formState.errors.confirmPassword?.message}
            />
            <AuthSubmitButton loading={isLoading}>Save new password</AuthSubmitButton>
          </form>
        )}

        <p className="mt-6 text-sm text-charcoal/60">
          Remembered it?{' '}
          <Link
            to={APP_ROUTES.AUTH.LOGIN}
            className="font-medium text-charcoal underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default ForgotPassword;
