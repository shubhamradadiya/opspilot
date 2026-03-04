// ============================================================================
// IMPORTS
// ============================================================================
import React, { useMemo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { IExpense } from '@/store/expenses/expenses.types';
import ExpenseTypeBadge from './ExpenseTypeBadge';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ExpenseTableProps {
  expenses: IExpense[];
  loading?: boolean;
  onEdit: (expense: IExpense) => void;
  onDelete: (expense: IExpense) => void;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDate = (timestamp: number): string => {
  if (!timestamp) return '—';
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatCurrency = (amount: number): string =>
  `$${Number(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const SkeletonRow: React.FC = () => (
  <tr>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 rounded bg-[#F5F0D0] dark:bg-[#252525] animate-pulse" />
      </td>
    ))}
  </tr>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, loading, onEdit, onDelete }) => {
  // ── COMPUTED VALUES ─────────────────────────────────────────────────────────
  const isEmpty = useMemo(() => !loading && expenses.length === 0, [loading, expenses]);

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] overflow-hidden">
      <table className="w-full text-sm">
        {/* Header */}
        <thead>
          <tr className="bg-[#F5F0D0] dark:bg-[#252525]">
            {['Date', 'Vendor', 'Type', 'Description', 'Total', 'Actions'].map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#9A9A9A] dark:text-[#666666]"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : isEmpty ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-12 text-center text-[#9A9A9A] dark:text-[#666666]"
              >
                No expense records found.
              </td>
            </tr>
          ) : (
            expenses.map((expense, idx) => (
              <tr
                key={expense.eId}
                className={`border-b border-[#F0EDD0] dark:border-[#222222] hover:bg-[#FDFBD4] dark:hover:bg-[#252525] transition-colors duration-100 ${
                  idx % 2 === 1 ? 'bg-[#FEFDF0] dark:bg-[#1A1A1A]' : ''
                }`}
              >
                {/* Date */}
                <td className="px-4 py-3 text-[#5A5A5A] dark:text-[#AAAAAA] whitespace-nowrap">
                  {formatDate(expense.expenseDate)}
                </td>

                {/* Vendor */}
                <td className="px-4 py-3 font-medium text-[#2A2A2A] dark:text-[#F5F5F5] max-w-[180px] truncate">
                  {expense.vendorName || '—'}
                </td>

                {/* Type */}
                <td className="px-4 py-3">
                  <ExpenseTypeBadge type={expense.expenseType} />
                </td>

                {/* Description */}
                <td className="px-4 py-3 text-[#5A5A5A] dark:text-[#AAAAAA] max-w-[200px] truncate">
                  {expense.description || <span className="text-[#9A9A9A]">—</span>}
                </td>

                {/* Total */}
                <td className="px-4 py-3 font-medium text-[#2A2A2A] dark:text-[#F5F5F5] whitespace-nowrap">
                  {formatCurrency(expense.totalExpense)}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-1.5 rounded-md text-[#9A9A9A] hover:text-[#D4AF37] hover:bg-[#F5F0D0] dark:hover:bg-[#252525] transition-colors duration-100"
                      aria-label="Edit expense"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(expense)}
                      className="p-1.5 rounded-md text-[#9A9A9A] hover:text-[#C0392B] hover:bg-[#FFF5F5] dark:hover:bg-[rgba(192,57,43,0.1)] transition-colors duration-100"
                      aria-label="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
