import React, { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type AuthFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  icon: LucideIcon;
};

const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  function AuthField({ label, error, icon: Icon, type, className, id: propId, ...props }, ref) {
    const generatedId = useId();
    const id = propId ?? generatedId;
    const [visible, setVisible] = useState(false);
    const isPassword = type === 'password';

    return (
      <label className="grid gap-2 text-sm font-medium text-charcoal" htmlFor={id}>
        {label}
        <span className="relative block">
          <Icon
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            {...props}
            id={id}
            ref={ref}
            type={isPassword && visible ? 'text' : type}
            aria-invalid={Boolean(error)}
            className={twMerge(
              clsx(
                'flex h-11 w-full rounded-lg border border-line bg-elevated px-3 py-1 pl-10 pr-11 text-base text-charcoal shadow-none md:text-sm',
                'placeholder:text-muted/70',
                'transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold focus-visible:border-gold',
                'autofill:shadow-[inset_0_0_0_1000px_var(--landing-elevated)]',
                '[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_var(--landing-elevated)]',
                '[&:-webkit-autofill]:[-webkit-text-fill-color:var(--landing-fg)]',
                '[&:-webkit-autofill]:[caret-color:var(--landing-fg)]',
                error && 'border-[#C0392B] focus-visible:border-[#C0392B] focus-visible:ring-[#C0392B]',
                className,
              ),
            )}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-md text-muted transition-colors hover:text-charcoal"
              aria-label={visible ? 'Hide password' : 'Show password'}
            >
              {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          )}
        </span>
        {error && (
          <span className="text-xs font-normal text-[#C0392B] dark:text-[#E05A4A]" role="alert">
            {error}
          </span>
        )}
      </label>
    );
  },
);

export default AuthField;
