// ============================================================================
// IMPORTS
// ============================================================================
import React, { useMemo } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Spinner } from './Spinner';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white dark:bg-blue-600 dark:hover:bg-blue-500 dark:active:bg-blue-400',
  secondary:
    'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700 dark:active:bg-slate-600',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 dark:active:bg-slate-700',
  danger:
    'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white dark:bg-red-700 dark:hover:bg-red-600 dark:active:bg-red-500',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 py-1.5 text-sm rounded-md',
  md: 'h-9 px-4 py-2 text-sm rounded-lg',
  lg: 'h-11 px-6 py-3 text-base rounded-lg',
};

const SPINNER_SIZE: Record<ButtonSize, 'sm' | 'sm' | 'md'> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  className,
  ...rest
}) => {
  // ── COMPUTED VALUES ────────────────────────────────────────────────────────
  const isDisabled = useMemo(() => disabled || loading, [disabled, loading]);

  const buttonClasses = useMemo(
    () =>
      twMerge(
        clsx(
          'inline-flex items-center justify-center gap-2 font-medium',
          'transition-colors duration-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className,
        ),
      ),
    [variant, size, className],
  );

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={buttonClasses}
      aria-busy={loading}
    >
      {loading ? (
        <Spinner size={SPINNER_SIZE[size]} />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
};

export default Button;
