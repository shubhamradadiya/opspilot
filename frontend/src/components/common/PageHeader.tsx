// ============================================================================
// IMPORTS
// ============================================================================

// React Core
import React from 'react';

// Components - UI
import Breadcrumb from '../layout/Breadcrumb';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  showBreadcrumbs?: boolean;
  action?: React.ReactNode;
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * PageHeader - Standardized header for all main pages
 * Contains breadcrumbs, page title, description, and primary actions
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  showBreadcrumbs = true,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 ${className}`}>
      <div className="space-y-1">
        {/* Breadcrumbs */}
        {showBreadcrumbs && (
          <div className="mb-2">
            <Breadcrumb />
          </div>
        )}

        
        {/* Title & Description */}
        <div className="flex items-center gap-2">
          {icon && <span className="shrink-0">{icon}</span>}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {title}
          </h1>
        </div>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {/* Action Slot */}
      {action && (
        <div className="flex items-center gap-3">
          {action}
        </div>
      )}
    </div>
  );
};


export default PageHeader;
