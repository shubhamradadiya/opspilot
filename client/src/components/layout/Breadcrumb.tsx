// ============================================================================
// IMPORTS
// ============================================================================
import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface BreadcrumbSegment {
  label: string;
  path: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  employees: 'Employees',
  create: 'Create',
  edit: 'Edit',
  attendance: 'Attendance',
  payouts: 'Payouts',
  inventory: 'Inventory',
  expenses: 'Expenses',
  'walk-in-customers': 'Walk-In Customers',
  'ring-customers': 'Ring Customers',
  containers: 'Containers',
  settings: 'Settings',
  'change-password': 'Change Password',
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const Breadcrumb: React.FC = () => {
  // ── HOOKS ──────────────────────────────────────────────────────────────────
  const location = useLocation();

  // ── COMPUTED VALUES ────────────────────────────────────────────────────────
  const segments = useMemo<BreadcrumbSegment[]>(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.map((part, index) => ({
      label: SEGMENT_LABELS[part] ?? part.charAt(0).toUpperCase() + part.slice(1),
      path: '/' + parts.slice(0, index + 1).join('/'),
    }));
  }, [location.pathname]);

  // ── RENDER ─────────────────────────────────────────────────────────────────
  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol className="breadcrumb-list">
        {/* Home */}
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link breadcrumb-link--home">
            <Home size={14} />
          </Link>
        </li>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          return (
            <li key={segment.path} className="breadcrumb-item">
              <ChevronRight size={12} className="breadcrumb-separator" />
              {isLast ? (
                <span className="breadcrumb-current">{segment.label}</span>
              ) : (
                <Link to={segment.path} className="breadcrumb-link">
                  {segment.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
