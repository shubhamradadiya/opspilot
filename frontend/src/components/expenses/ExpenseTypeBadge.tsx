// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import { ExpenseType } from '@/store/expenses/expenses.types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ExpenseTypeBadgeProps {
  type: string | null | undefined;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TYPE_CONFIG: Record<string, { label: string; className: string }> = {
  [ExpenseType.MANUAL]: {
    label: 'Manual',
    className:
      'bg-[#FEF3CD] text-[#B8860B] dark:bg-[rgba(184,134,11,0.2)] dark:text-[#D4A017]',
  },
  [ExpenseType.PAYOUT]: {
    label: 'Payout',
    className:
      'bg-[#EDD6F5] text-[#6A3A8A] dark:bg-[rgba(106,58,138,0.2)] dark:text-[#9A6ABA]',
  },
};

const FALLBACK_CONFIG = {
  label: 'Unknown',
  className: 'bg-[#F5F0D0] text-[#5A5A5A] dark:bg-[rgba(90,90,90,0.2)] dark:text-[#AAAAAA]',
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ExpenseTypeBadge: React.FC<ExpenseTypeBadgeProps> = ({ type }) => {
  const config = (type && TYPE_CONFIG[type]) || FALLBACK_CONFIG;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default ExpenseTypeBadge;
