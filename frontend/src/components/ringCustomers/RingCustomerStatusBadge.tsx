// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import { RingCustomerStatus } from '@/store/ringCustomers/ringCustomers.types';

interface BadgeProps {
  status: RingCustomerStatus | string | null;
}

const RingCustomerStatusBadge: React.FC<BadgeProps> = ({ status }) => {
  let colorClass = 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
  let label = status || 'Unknown';

  switch (status) {
    case RingCustomerStatus.DELIVERED:
      colorClass = 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      label = 'Delivered';
      break;
    case RingCustomerStatus.PENDING:
      colorClass = 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      label = 'Pending';
      break;
    case RingCustomerStatus.CANCELLED:
      colorClass = 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      label = 'Cancelled';
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

export default RingCustomerStatusBadge;
