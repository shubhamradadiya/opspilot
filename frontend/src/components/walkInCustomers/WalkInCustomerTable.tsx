// ============================================================================
// WALK-IN CUSTOMER TABLE COMPONENT
// Responsive: stacked cards on mobile (<sm), standard table on sm+
// Supports bulk selection via checkboxes
// ============================================================================
import React, { useMemo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { IWalkInCustomer } from '@/store/walkInCustomers/walkInCustomers.types';
import WalkInCustomerStatusBadge from './WalkInCustomerStatusBadge';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface WalkInCustomerTableProps {
  customers: IWalkInCustomer[];
  loading?: boolean;
  selectedIds: string[];
  onSelect: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onEdit: (customer: IWalkInCustomer) => void;
  onDelete: (customer: IWalkInCustomer) => void;
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
    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 rounded bg-[#F5F0D0] dark:bg-[#252525] animate-pulse" />
      </td>
    ))}
  </tr>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const WalkInCustomerTable: React.FC<WalkInCustomerTableProps> = ({
  customers,
  loading,
  selectedIds,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete,
}) => {
  // ── COMPUTED VALUES ─────────────────────────────────────────────────────────
  const isEmpty = useMemo(() => !loading && customers.length === 0, [loading, customers]);
  const allSelected = useMemo(
    () => customers.length > 0 && selectedIds.length === customers.length,
    [customers, selectedIds]
  );
  const someSelected = useMemo(
    () => selectedIds.length > 0 && selectedIds.length < customers.length,
    [customers, selectedIds]
  );

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── MOBILE: Stacked cards (hidden on sm+) ─────────────────────────── */}
      <div className="sm:hidden space-y-3">
        {customers.length > 0 && !loading && (
          <div className="flex items-center gap-2 px-1 mb-2">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(input) => {
                if (input) input.indeterminate = someSelected;
              }}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="w-4 h-4 rounded border-[#2A2A2A] text-[#D4AF37] focus:ring-[#D4AF37] bg-white dark:bg-[#1E1E1E] dark:border-[#2E2E2E]"
            />
            <span className="text-sm text-[#5A5A5A] dark:text-[#AAAAAA]">Select All</span>
          </div>
        )}

        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : isEmpty ? (
          <div className="py-12 text-center text-[#9A9A9A] dark:text-[#666666] text-sm">
            No walk-in customer records found.
          </div>
        ) : (
          customers.map((customer) => (
            <div
              key={customer.wcId}
              className={`bg-white dark:bg-[#1A1A1A] rounded-xl border p-4 space-y-3 transition-colors ${
                selectedIds.includes(customer.wcId)
                  ? 'border-[#D4AF37] dark:border-[#D4AF37]'
                  : 'border-[#2A2A2A] dark:border-[#2E2E2E]'
              }`}
            >
              {/* Top row: Checkbox + Name + actions */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(customer.wcId)}
                  onChange={(e) => onSelect(customer.wcId, e.target.checked)}
                  className="w-4 h-4 mt-1 rounded border-[#2A2A2A] text-[#D4AF37] focus:ring-[#D4AF37] bg-white dark:bg-[#1E1E1E] dark:border-[#2E2E2E]"
                />
                <div className="flex-1">
                  <p className="font-medium text-[#2A2A2A] dark:text-[#F5F5F5] text-sm truncate">
                    {customer.customerName || '—'}
                  </p>
                  <p className="text-xs text-[#9A9A9A] dark:text-[#666666] mt-0.5">
                    {formatDate(customer.walkInCustomerDate)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEdit(customer)}
                    className="p-1.5 rounded-md text-[#9A9A9A] hover:text-[#D4AF37] hover:bg-[#F5F0D0] dark:hover:bg-[#252525] transition-colors"
                    aria-label="Edit record"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(customer)}
                    className="p-1.5 rounded-md text-[#9A9A9A] hover:text-[#C0392B] hover:bg-[#FFF5F5] dark:hover:bg-[rgba(192,57,43,0.1)] transition-colors"
                    aria-label="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 text-xs ml-6">
                <div>
                  <p className="text-[#9A9A9A] dark:text-[#666666]">Status</p>
                  <div className="mt-0.5">
                    <WalkInCustomerStatusBadge status={customer.status} />
                  </div>
                </div>
                <div>
                  <p className="text-[#9A9A9A] dark:text-[#666666]">Total</p>
                  <p className="mt-0.5 font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
                    {formatCurrency(customer.totalAmount)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[#9A9A9A] dark:text-[#666666]">Items</p>
                  <p className="mt-0.5 text-[#5A5A5A] dark:text-[#AAAAAA] truncate">
                    {customer.carTiresCount ? `Car: ${customer.carTiresCount} ` : ''}
                    {customer.truckTiresCount ? `Truck: ${customer.truckTiresCount} ` : ''}
                    {customer.rimsCount ? `Rims: ${customer.rimsCount} ` : ''}
                    {(!customer.carTiresCount && !customer.truckTiresCount && !customer.rimsCount) ? '—' : ''}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── DESKTOP: Standard table (hidden on mobile) ─────────────────────── */}
      <div className="hidden sm:block overflow-x-auto rounded-xl">
        <div className="min-w-[800px] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] overflow-hidden">
          <table className="w-full text-sm">
            {/* Header */}
            <thead>
              <tr className="bg-[#F5F0D0] dark:bg-[#252525]">
                <th className="px-4 py-3 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-[#2A2A2A] text-[#D4AF37] focus:ring-[#D4AF37] bg-white dark:bg-[#1E1E1E] dark:border-[#2E2E2E]"
                  />
                </th>
                {['Date', 'Customer Name', 'Items Summary', 'Status', 'Total', 'Actions'].map((col) => (
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
                    colSpan={7}
                    className="px-4 py-12 text-center text-[#9A9A9A] dark:text-[#666666]"
                  >
                    No walk-in customer records found.
                  </td>
                </tr>
              ) : (
                customers.map((customer, idx) => (
                  <tr
                    key={customer.wcId}
                    className={`border-b border-[#F0EDD0] dark:border-[#222222] hover:bg-[#FDFBD4] dark:hover:bg-[#252525] transition-colors duration-100 ${
                      idx % 2 === 1 ? 'bg-[#FEFDF0] dark:bg-[#1A1A1A]' : ''
                    } ${selectedIds.includes(customer.wcId) ? 'bg-[#FFFDF0] dark:bg-[#2A2A2A]' : ''}`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(customer.wcId)}
                        onChange={(e) => onSelect(customer.wcId, e.target.checked)}
                        className="w-4 h-4 rounded border-[#2A2A2A] text-[#D4AF37] focus:ring-[#D4AF37] bg-white dark:bg-[#1E1E1E] dark:border-[#2E2E2E]"
                      />
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-[#5A5A5A] dark:text-[#AAAAAA] whitespace-nowrap">
                      {formatDate(customer.walkInCustomerDate)}
                    </td>

                    {/* Customer Name */}
                    <td className="px-4 py-3 font-medium text-[#2A2A2A] dark:text-[#F5F5F5] max-w-[180px] truncate">
                      {customer.customerName || '—'}
                    </td>

                    {/* Items Summary */}
                    <td className="px-4 py-3 text-[#5A5A5A] dark:text-[#AAAAAA] max-w-[200px] truncate text-xs">
                       {customer.carTiresCount ? <span className="mr-2 border rounded px-1 dark:border-gray-600">Car: {customer.carTiresCount}</span> : null}
                       {customer.truckTiresCount ? <span className="mr-2 border rounded px-1 dark:border-gray-600">Truck: {customer.truckTiresCount}</span> : null}
                       {customer.rimsCount ? <span className="mr-2 border rounded px-1 dark:border-gray-600">Rims: {customer.rimsCount}</span> : null}
                       {(!customer.carTiresCount && !customer.truckTiresCount && !customer.rimsCount) ? '—' : null}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <WalkInCustomerStatusBadge status={customer.status} />
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3 font-medium text-[#2A2A2A] dark:text-[#F5F5F5] whitespace-nowrap">
                      {formatCurrency(customer.totalAmount)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(customer)}
                          className="p-1.5 rounded-md text-[#9A9A9A] hover:text-[#D4AF37] hover:bg-[#F5F0D0] dark:hover:bg-[#252525] transition-colors duration-100"
                          aria-label="Edit record"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(customer)}
                          className="p-1.5 rounded-md text-[#9A9A9A] hover:text-[#C0392B] hover:bg-[#FFF5F5] dark:hover:bg-[rgba(192,57,43,0.1)] transition-colors duration-100"
                          aria-label="Delete record"
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

export default WalkInCustomerTable;
