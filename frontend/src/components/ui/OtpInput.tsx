// ============================================================================
// IMPORTS
// ============================================================================
import React, { useRef, useCallback, useMemo } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const DEFAULT_LENGTH = 6;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const isDigit = (char: string): boolean => /^\d$/.test(char);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = DEFAULT_LENGTH,
  error,
  disabled = false,
  autoFocus = false,
}) => {
  // ── REFS ───────────────────────────────────────────────────────────────────
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── COMPUTED VALUES ────────────────────────────────────────────────────────
  const digits = useMemo(() => {
    const arr = value.split('').slice(0, length);
    while (arr.length < length) arr.push('');
    return arr;
  }, [value, length]);

  const hasError = useMemo(() => !!error, [error]);

  /**
   * OTP cell styling per BRAND_DESIGN_GUIDELINES.md §7 — Inputs.
   * Focus ring: gold (#D4AF37); Error: danger (#C0392B).
   */
  const cellClasses = useMemo(
    () =>
      twMerge(
        clsx(
          'h-11 w-10 text-center text-base font-semibold rounded-md border',
          'bg-white text-[#2A2A2A]',
          'transition-colors duration-100',
          'focus:outline-none focus:ring-2 focus:border-transparent',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'dark:bg-[#1E1E1E] dark:text-[#F5F5F5]',
          {
            'border-[#E8E0B8] focus:ring-[#D4AF37] dark:border-[#2E2E2E] dark:focus:ring-[#D4AF37]':
              !hasError,
            'border-[#C0392B] focus:ring-[#C0392B] dark:border-[#C0392B] dark:focus:ring-[#E05A4A]':
              hasError,
          },
        ),
      ),
    [hasError],
  );

  // ── HANDLERS ───────────────────────────────────────────────────────────────
  const handleChange = useCallback(
    (index: number, char: string) => {
      if (!isDigit(char) && char !== '') return;
      const newDigits = [...digits];
      newDigits[index] = char;
      onChange(newDigits.join(''));
      // Auto-advance to next field
      if (char && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits, length, onChange],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      onChange(pasted.padEnd(length, '').slice(0, length));
      // Focus last filled or next empty
      const focusIndex = Math.min(pasted.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    },
    [length, onChange],
  );

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2" role="group" aria-label="One-time password input">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={disabled}
            autoFocus={autoFocus && index === 0}
            className={cellClasses}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            aria-label={`OTP digit ${index + 1} of ${length}`}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
          />
        ))}
      </div>
      {error && (
        <p role="alert" className="text-xs text-[#C0392B] dark:text-[#E05A4A] mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default OtpInput;
