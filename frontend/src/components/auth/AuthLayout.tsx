// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import { ThemeToggle } from '@/components/ui';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface AuthLayoutProps {
  children: React.ReactNode;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="auth-layout">
      {/* ── Animated background orbs ── */}
      <div className="auth-orb auth-orb-1" aria-hidden="true" />
      <div className="auth-orb auth-orb-2" aria-hidden="true" />
      <div className="auth-orb auth-orb-3" aria-hidden="true" />

      {/* ── Subtle dot grid overlay ── */}
      <div className="auth-grid" aria-hidden="true" />

      {/* ── Theme toggle (top-right) ── */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* ── Page content ── */}
      <div className="relative z-10 w-full flex items-center justify-center min-h-screen px-4 py-12">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

