// ============================================================================
// IMPORTS
// ============================================================================

// React Core
import React, { useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Icons
import { Lock } from 'lucide-react';

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
import {
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
  clearError,
} from '@/store/auth/auth.slice';
import { changePasswordThunk } from '@/store/auth/auth.thunk';

// Utils
import { APP_ROUTES } from '@/utils/routes';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: 'New password cannot be the same as current password',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const ChangePassword: React.FC = () => {
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
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
  });

  // ── EFFECTS ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(APP_ROUTES.AUTH.LOGIN, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // ── HANDLERS ───────────────────────────────────────────────────────────────
  const onSubmit = useCallback(
    async (data: ChangePasswordFormData) => {
      const result = await dispatch(
        changePasswordThunk({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      );
      if (changePasswordThunk.fulfilled.match(result)) {
        toast.success('Password changed successfully');
        reset();
      } else {
        toast.error(String(result.payload) || 'Failed to change password');
      }
    },
    [dispatch, reset],
  );

  // ── COMPUTED VALUES ────────────────────────────────────────────────────────
  const apiError = useMemo(() => authError, [authError]);

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <AuthLayout>
      <div className="w-full max-w-[400px] bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-lg shadow-slate-200/60 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-700/80 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
            Change password
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Update your account password
          </p>
        </div>

        {/* API Error */}
        {apiError && (
          <div role="alert" className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-400">{apiError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <Input
            {...register('oldPassword')}
            type="password"
            label="Current password"
            placeholder="••••••••"
            autoComplete="current-password"
            autoFocus
            error={errors.oldPassword?.message}
            leftIcon={<Lock className="w-4 h-4" aria-hidden="true" />}
          />

          <Input
            {...register('newPassword')}
            type="password"
            label="New password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.newPassword?.message}
            helperText="At least 8 characters"
            leftIcon={<Lock className="w-4 h-4" aria-hidden="true" />}
          />

          <Input
            {...register('confirmPassword')}
            type="password"
            label="Confirm new password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            leftIcon={<Lock className="w-4 h-4" aria-hidden="true" />}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isLoading}
            className="w-full mt-2"
          >
            Update password
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ChangePassword;
