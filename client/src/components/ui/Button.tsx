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
// CONSTANTS — Brand Design Guidelines (Gold Theme)
// ============================================================================

/**
 * Variant classes per BRAND_DESIGN_GUIDELINES.md §7 Component Rules.
 * Primary uses gold (#D4AF37) with dark text for contrast.
 * No shadows on buttons — forbidden per brand spec.
 */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[#D4AF37] hover:bg-[#CE8946] active:bg-[#A8892B] text-[#2A2A2A] dark:text-[#121212]',
  secondary:
    'bg-white border border-[#D4AF37] text-[#D4AF37] hover:bg-[#FDFBD4] dark:bg-[#1E1E1E] dark:border-[#D4AF37] dark:text-[#D4AF37] dark:hover:bg-[#2A2A2A]',
  ghost:
    'bg-transparent text-[#5A5A5A] hover:bg-[#F5F0D0] active:bg-[#E8E0B8] dark:text-[#AAAAAA] dark:hover:bg-[#252525] dark:active:bg-[#2E2E2E]',
  danger:
    'bg-[#C0392B] hover:bg-[#A0302A] active:bg-[#8A2820] text-white',
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
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2',
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
