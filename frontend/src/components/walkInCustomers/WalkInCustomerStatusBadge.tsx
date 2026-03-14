// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import { WalkInCustomerStatus } from '@/store/walkInCustomers/walkInCustomers.types';

interface BadgeProps {
  status: WalkInCustomerStatus | string | null;
}

const WalkInCustomerStatusBadge: React.FC<BadgeProps> = ({ status }) => {
  let colorClass = 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
  let label = status || 'Unknown';

  switch (status) {
    case WalkInCustomerStatus.PAID:
      colorClass = 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      label = 'Paid';
      break;
    case WalkInCustomerStatus.PENDING:
      colorClass = 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      label = 'Pending';
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium capitalize ${colorClass}`}
    >
      {label}
    </span>
  );
};

export default WalkInCustomerStatusBadge;
