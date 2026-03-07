// ============================================================================
// EXPENSE TABLE COMPONENT
// Responsive: stacked cards on mobile (<sm), standard table on sm+
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
// SKELETON — Mobile card
// ============================================================================
const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] p-4 space-y-2 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-4 bg-[#F5F0D0] dark:bg-[#252525] rounded" />
    ))}
  </div>
);

// Skeleton row for desktop
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
    <>
      {/* ── MOBILE: Stacked cards (hidden on sm+) ─────────────────────────── */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : isEmpty ? (
          <div className="py-12 text-center text-[#9A9A9A] dark:text-[#666666] text-sm">
            No expense records found.
          </div>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.eId}
              className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] p-4 space-y-3"
            >
              {/* Top row: vendor + actions */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-[#2A2A2A] dark:text-[#F5F5F5] text-sm">
                    {expense.vendorName || '—'}
                  </p>
                  <p className="text-xs text-[#9A9A9A] dark:text-[#666666] mt-0.5">
                    {formatDate(expense.expenseDate)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-1.5 rounded-md text-[#9A9A9A] hover:text-[#D4AF37] hover:bg-[#F5F0D0] dark:hover:bg-[#252525] transition-colors"
                    aria-label="Edit expense"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(expense)}
                    className="p-1.5 rounded-md text-[#9A9A9A] hover:text-[#C0392B] hover:bg-[#FFF5F5] dark:hover:bg-[rgba(192,57,43,0.1)] transition-colors"
                    aria-label="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[#9A9A9A] dark:text-[#666666]">Type</p>
                  <div className="mt-0.5">
                    <ExpenseTypeBadge type={expense.expenseType} />
                  </div>
                </div>
                <div>
                  <p className="text-[#9A9A9A] dark:text-[#666666]">Total</p>
                  <p className="mt-0.5 font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
                    {formatCurrency(expense.totalExpense)}
                  </p>
                </div>
                {expense.description && (
                  <div className="col-span-2">
                    <p className="text-[#9A9A9A] dark:text-[#666666]">Description</p>
                    <p className="mt-0.5 text-[#5A5A5A] dark:text-[#AAAAAA] truncate">
                      {expense.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── DESKTOP: Standard table (hidden on mobile) ─────────────────────── */}
      <div className="hidden sm:block overflow-x-auto rounded-xl">
        <div className="min-w-[600px] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] overflow-hidden">
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
      </div>
    </>
  );
};

export default ExpenseTable;
