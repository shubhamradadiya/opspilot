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

  /**
   * Input styling per BRAND_DESIGN_GUIDELINES.md §7 Component Rules — Inputs.
   * Focus ring: gold (#D4AF37); Error: danger (#C0392B).
   * No shadows on inputs — forbidden per brand spec.
   */
  const inputClasses = useMemo(
    () =>
      twMerge(
        clsx(
          'h-9 w-full px-3 py-2 text-sm rounded-md border',
          'bg-white text-[#2A2A2A] placeholder:text-[#9A9A9A]',
          'transition-colors duration-100',
          'focus:outline-none focus:ring-2 focus:border-transparent',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-[#F5F0D0]',
          'dark:bg-[#1E1E1E] dark:text-[#F5F5F5] dark:placeholder:text-[#666666]',
          {
            'border-[#E8E0B8] focus:ring-[#D4AF37] dark:border-[#2E2E2E] dark:focus:ring-[#D4AF37]':
              !hasError,
            'border-[#C0392B] focus:ring-[#C0392B] dark:border-[#C0392B] dark:focus:ring-[#E05A4A]':
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
          className="text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA]"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 flex items-center pointer-events-none text-[#9A9A9A] dark:text-[#666666]">
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
          <span className="absolute right-3 flex items-center pointer-events-none text-[#9A9A9A] dark:text-[#666666]">
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-[#C0392B] dark:text-[#E05A4A]"
        >
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={helperId} className="text-xs text-[#9A9A9A] dark:text-[#666666]">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
