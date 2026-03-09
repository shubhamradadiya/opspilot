import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { IRingCustomer } from '@/store/ringCustomers/ringCustomers.types';
import RingCustomerStatusBadge from './RingCustomerStatusBadge';
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface RingCustomerTableProps {
  records: IRingCustomer[];
  loading: boolean;
  onEdit: (record: IRingCustomer) => void;
  onDelete: (rcId: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const RingCustomerTable: React.FC<RingCustomerTableProps> = ({
  records,
  loading,
  onEdit,
  onDelete,
}) => {
  // ── STATE ────────────────────────────────────────────────────────────────
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── HANDLERS ─────────────────────────────────────────────────────────────
  const handleDeleteClick = (rcId: string) => {
    // Standard confirm dialogue for simplicity, could be replaced by a custom Modal later
    if (window.confirm('Are you sure you want to delete this ring order?')) {
      setDeletingId(rcId);
      onDelete(rcId);
    }
  };

  // ── RENDER — Loading state ───────────────────────────────────────────────
  if (loading && records.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#2A2A2A] dark:border-[#2E2E2E] overflow-hidden">
        <div className="animate-pulse flex flex-col">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-b border-[#2A2A2A] dark:border-[#2E2E2E] bg-[#F5F5F5] dark:bg-[#252525] opacity-50 m-2 rounded" />
          ))}
        </div>
      </div>
    );
  }

  // ── RENDER — Empty state ─────────────────────────────────────────────────
  if (records.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#2A2A2A] dark:border-[#2E2E2E] p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[#F5F0D0] dark:bg-[#2A2A2A] rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl text-[#D4AF37]">💍</span>
        </div>
        <h3 className="text-lg font-medium text-[#2A2A2A] dark:text-[#F5F5F5] mb-2">No ring orders found</h3>
        <p className="text-[#9A9A9A] dark:text-[#AAAAAA] max-w-md">
          There are currently no ring customer orders matching your criteria. Add a new order or adjust your filters.
        </p>
      </div>
    );
  }

  // ── RENDER ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── MOBILE VIEW (Card Layout) ── */}
      <div className="block sm:hidden space-y-4">
        {records.map((record) => (
          <div
            key={record.rcId}
            className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#2A2A2A] dark:border-[#2E2E2E] p-4 flex flex-col gap-3 transition-colors hover:border-[#D4AF37] dark:hover:border-[#D4AF37]"
          >
            {/* Header: ID, Date & Status */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">{record.rcId}</p>
                <p className="text-xs text-[#5A5A5A] dark:text-[#AAAAAA]">
                  {format(new Date(record.ringCustomerDate), 'dd MMM yyyy')}
                </p>
              </div>
              <RingCustomerStatusBadge status={record.status} />
            </div>

            {/* Customer Details */}
            <div>
              <p className="text-sm font-medium text-[#2A2A2A] dark:text-[#F5F5F5] truncate">
                {record.customerName}
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-2 bg-[#F5F5F5] dark:bg-[#252525] p-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#333333]">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-[#9A9A9A] font-semibold">Tires</span>
                <span className="text-sm text-[#2A2A2A] dark:text-[#F5F5F5]">{record.orderedRingCount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-[#9A9A9A] font-semibold">Price/Ea</span>
                <span className="text-sm text-[#2A2A2A] dark:text-[#F5F5F5]">{formatCurrency(record.price)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-[#9A9A9A] font-semibold">Del. Fee</span>
                <span className="text-sm text-[#2A2A2A] dark:text-[#F5F5F5]">{formatCurrency(record.deliveryFee)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-[#9A9A9A] font-semibold">Total</span>
                <span className="text-sm text-[#D4AF37] font-semibold">{formatCurrency(record.totalAmount)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E5E5] dark:border-[#333333]">
              <button
                onClick={() => onEdit(record)}
                className="p-2 text-[#5A5A5A] hover:text-[#D4AF37] dark:text-[#AAAAAA] dark:hover:text-[#D4AF37] hover:bg-[#F5F0D0] dark:hover:bg-[#333333] rounded-md transition-colors"
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDeleteClick(record.rcId)}
                disabled={deletingId === record.rcId}
                className="p-2 text-[#C0392B] hover:bg-[#FADBD8] dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── DESKTOP VIEW (Table Layout) ── */}
      <div className="hidden sm:block w-full bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#2A2A2A] dark:border-[#2E2E2E] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F5F5] dark:bg-[#252525] border-b border-[#2A2A2A] dark:border-[#2E2E2E]">
                <th className="py-3 px-4 text-xs font-semibold text-[#5A5A5A] dark:text-[#9A9A9A] uppercase tracking-wider whitespace-nowrap">ID</th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5A5A5A] dark:text-[#9A9A9A] uppercase tracking-wider whitespace-nowrap">Date</th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5A5A5A] dark:text-[#9A9A9A] uppercase tracking-wider whitespace-nowrap">Customer</th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5A5A5A] dark:text-[#9A9A9A] uppercase tracking-wider text-right whitespace-nowrap">Count</th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5A5A5A] dark:text-[#9A9A9A] uppercase tracking-wider text-right whitespace-nowrap">Price</th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5A5A5A] dark:text-[#9A9A9A] uppercase tracking-wider text-right whitespace-nowrap">Del. Fee</th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5A5A5A] dark:text-[#9A9A9A] uppercase tracking-wider text-right whitespace-nowrap">Total</th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5A5A5A] dark:text-[#9A9A9A] uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5A5A5A] dark:text-[#9A9A9A] uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#2E2E2E]">
              {records.map((record) => (
                <tr
                  key={record.rcId}
                  className="hover:bg-[#F9F9F9] dark:hover:bg-[#2A2A2A] transition-colors group"
                >
                  <td className="py-3 px-4 text-sm text-[#2A2A2A] dark:text-[#F5F5F5] whitespace-nowrap font-medium">
                    {record.rcId}
                  </td>
                  <td className="py-3 px-4 text-sm text-[#5A5A5A] dark:text-[#AAAAAA] whitespace-nowrap">
                    {format(new Date(record.ringCustomerDate), 'dd MMM yyyy')}
                  </td>
                  <td className="py-3 px-4 text-sm text-[#2A2A2A] dark:text-[#F5F5F5] font-medium max-w-[200px] truncate">
                    {record.customerName}
                  </td>
                  <td className="py-3 px-4 text-sm text-[#5A5A5A] dark:text-[#AAAAAA] text-right whitespace-nowrap">
                    {record.orderedRingCount}
                  </td>
                  <td className="py-3 px-4 text-sm text-[#5A5A5A] dark:text-[#AAAAAA] text-right whitespace-nowrap">
                    {formatCurrency(record.price)}
                  </td>
                  <td className="py-3 px-4 text-sm text-[#5A5A5A] dark:text-[#AAAAAA] text-right whitespace-nowrap">
                    {formatCurrency(record.deliveryFee)}
                  </td>
                  <td className="py-3 px-4 text-sm text-[#D4AF37] font-semibold text-right whitespace-nowrap">
                    {formatCurrency(record.totalAmount)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <RingCustomerStatusBadge status={record.status} />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(record)}
                        className="p-1.5 text-[#5A5A5A] hover:text-[#D4AF37] dark:text-[#AAAAAA] dark:hover:text-[#D4AF37] hover:bg-[#F5F0D0] dark:hover:bg-[#333333] rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(record.rcId)}
                        disabled={deletingId === record.rcId}
                        className="p-1.5 text-[#C0392B] hover:bg-[#FADBD8] dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default RingCustomerTable;
