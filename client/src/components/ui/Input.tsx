// ============================================================================
// IMPORTS
// ============================================================================
import React, { useMemo, useId } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerClassName,
  className,
  id: propId,
  disabled,
  ...rest
}) => {
  // ── HOOKS ──────────────────────────────────────────────────────────────────
  const generatedId = useId();
  const id = propId ?? generatedId;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  // ── COMPUTED VALUES ────────────────────────────────────────────────────────
  const hasError = useMemo(() => !!error, [error]);

  const inputClasses = useMemo(
    () =>
      twMerge(
        clsx(
          'h-9 w-full px-3 py-2 text-sm rounded-md border',
          'bg-white text-slate-900 placeholder:text-slate-400',
          'transition-colors duration-100',
          'focus:outline-none focus:ring-2 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50',
          'dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-500',
          {
            'border-slate-300 focus:ring-blue-600 dark:border-slate-600 dark:focus:ring-blue-400':
              !hasError,
            'border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-400':
              hasError,
            'pl-9': !!leftIcon,
            'pr-9': !!rightIcon,
          },
          className,
        ),
      ),
    [hasError, leftIcon, rightIcon, className],
  );

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className={twMerge(clsx('flex flex-col gap-1', containerClassName))}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            {leftIcon}
          </span>
        )}
        <input
          {...rest}
          id={id}
          disabled={disabled}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? errorId : helperText ? helperId : undefined
          }
        />
        {rightIcon && (
          <span className="absolute right-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={helperId} className="text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
