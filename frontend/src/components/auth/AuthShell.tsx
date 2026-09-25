import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Boxes, ShieldCheck } from 'lucide-react';
import Logo from '@/components/common/Logo';
import { APP_ROUTES } from '@/utils/routes';

interface AuthShellProps {
  children: React.ReactNode;
}

const AuthShell: React.FC<AuthShellProps> = ({ children }) => {
  return (
    <main className="min-h-screen bg-ivory font-landing text-charcoal transition-colors duration-300">
      <div className="hero-wash min-h-screen px-4 py-5 sm:px-6 sm:py-8">
        <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl flex-col">
          <Link to={APP_ROUTES.HOME} className="inline-flex w-fit items-center" aria-label="OpsPilot home">
            <Logo variant="primary" height={40} />
          </Link>
          <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_430px] lg:gap-20">
            <section className="hidden max-w-xl lg:block">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                Secure operations access
              </p>
              <h2 className="mt-4 max-w-lg font-display text-4xl font-semibold leading-tight">
                Your operational day starts here.
              </h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-muted">
                One trusted workspace for attendance, payouts, inventory, expenses,
                customers, and container movement.
              </p>
              <div className="mt-9 grid grid-cols-3 gap-3">
                <Signal icon={Activity} label="Live status" />
                <Signal icon={Boxes} label="All modules" />
                <Signal icon={ShieldCheck} label="Role-based" />
              </div>
            </section>
            <section className="rise-in mx-auto w-full max-w-[430px]">{children}</section>
          </div>
          <p className="text-center text-xs text-muted lg:text-left">
            © 2026 OpsPilot · Controlled team access
          </p>
        </div>
      </div>
    </main>
  );
};

function Signal({
  icon: Icon,
  label,
}: {
  icon: typeof Activity;
  label: string;
}) {
  return (
    <div className="glass-surface rounded-lg p-4">
      <Icon className="size-4 text-gold" />
      <p className="mt-4 text-xs font-medium text-muted">{label}</p>
    </div>
  );
}

export default AuthShell;
