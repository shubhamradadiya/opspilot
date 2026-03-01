// ============================================================================
// IMPORTS
// ============================================================================
import React, { useMemo } from 'react';
import { clsx } from 'clsx';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-2',
  lg: 'h-6 w-6 border-[3px]',
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className,
  label = 'Loading...',
}) => {
  // ── COMPUTED VALUES ────────────────────────────────────────────────────────
  const spinnerClasses = useMemo(
    () =>
      clsx(
        'inline-block rounded-full border-current border-t-transparent animate-spin',
        SIZE_CLASSES[size],
        className,
      ),
    [size, className],
  );

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <span
      role="status"
      aria-label={label}
      className={spinnerClasses}
    />
  );
};

export default Spinner;
