import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AuthSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const AuthSubmitButton: React.FC<AuthSubmitButtonProps> = ({
  loading = false,
  disabled,
  children,
  className,
  type = 'submit',
  ...rest
}) => {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={twMerge(
        clsx(
          'inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-panel px-4 text-sm font-medium text-on-panel',
          'transition-colors hover:bg-panel/90',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        ),
      )}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
};

export default AuthSubmitButton;
