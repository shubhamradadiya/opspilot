// ============================================================================
// IMPORTS
// ============================================================================

// React Core
import React from 'react';

// Icons
import { Inbox } from 'lucide-react';

// Components - UI
import { Button } from '../ui';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * EmptyState - A visually consistent component for "No Data" scenarios
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = "It looks like there's nothing here yet. Start by adding a new record.",
  icon = <Inbox className="w-12 h-12 text-gray-400 dark:text-gray-600" />,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-ink-surface border border-cream-border dark:border-ink-border rounded-xl shadow-sm ${className}`}>
      <div className="w-20 h-20 bg-gray-50 dark:bg-black/10 rounded-full flex items-center justify-center mb-6">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-8">
        {description}
      </p>

      {action && (
        <Button
          variant="primary"
          onClick={action.onClick}
          leftIcon={action.icon}
        >
          {action.label}
        </Button>
      )}

    </div>
  );
};

export default EmptyState;
