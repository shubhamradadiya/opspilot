// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { APP_ROUTES } from '@/utils/routes';

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const NotFound: React.FC = () => {
  // ── HOOKS ──────────────────────────────────────────────────────────────────
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // ── FUNCTIONS ──────────────────────────────────────────────────────────────
  const handleGoHome = () => {
    navigate(isAdmin ? APP_ROUTES.DASHBOARD : APP_ROUTES.ATTENDANCE.DASHBOARD);
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="not-found-icon">
          <FileQuestion size={64} strokeWidth={1.5} />
        </div>

        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-description">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Button variant="primary" size="lg" onClick={handleGoHome}>
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
