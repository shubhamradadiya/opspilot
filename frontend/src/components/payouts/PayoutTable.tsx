// ============================================================================
// PAYOUT TABLE COMPONENT
// Responsive: stacked cards on mobile (<sm), standard table on sm+
// ============================================================================
import React from 'react';
import PayoutStatusBadge from './PayoutStatusBadge';
import PayoutReceiptButton from './PayoutReceiptButton';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { IPayout } from '@/store/payouts/payouts.types';

// ============================================================================
// SKELETON
// ============================================================================
const SkeletonRow: React.FC = () => (
  <tr className="border-b border-[#2A2A2A]/40 dark:border-[#2E2E2E]/60">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-[#E8E0B8] dark:bg-[#2E2E2E] rounded animate-pulse" />
      </td>
    ))}
  </tr>
);

const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] p-4 space-y-2 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-4 bg-[#E8E0B8] dark:bg-[#2E2E2E] rounded" />
    ))}
  </div>
);

// ============================================================================
// TYPES
// ============================================================================
interface PayoutTableProps {
  payouts: IPayout[];
  loading?: boolean;
  showReceipt?: boolean;
  startTimestamp?: number;
  endTimestamp?: number;
  priceUnit?: '$' | '€' | '£';
}

// ============================================================================
// COMPONENT
// ============================================================================
const PayoutTable: React.FC<PayoutTableProps> = ({
  payouts,
  loading = false,
  showReceipt = false,
  startTimestamp,
  endTimestamp,
  priceUnit = '$',
}) => {
  const colSpan = showReceipt ? 7 : 6;

  return (
    <>
      {/* ── MOBILE: Stacked cards (hidden on sm+) ─────────────────────────── */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : payouts.length === 0 ? (
          <div className="py-12 text-center">
            <span className="text-3xl mb-3 block">💵</span>
            <p className="text-sm text-[#5A5A5A] dark:text-[#AAAAAA]">No payouts found</p>
            <p className="text-xs text-[#9A9A9A] dark:text-[#666666] mt-1">
              Try adjusting your date range
            </p>
          </div>
        ) : (
          payouts.map((payout, idx) => (
            <div
              key={payout.uid + idx}
              className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] p-4 space-y-3"
            >
              {/* Header: avatar + name + receipt */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-[#D4AF37]">
                      {payout.user?.fullName?.charAt(0)?.toUpperCase() ?? '?'}
                    </span>
                  </div>
                  <p className="font-medium text-[#2A2A2A] dark:text-[#F5F5F5] text-sm">
                    {payout.user?.fullName ?? '—'}
                  </p>
                </div>
                {showReceipt && payout.user?.uid && startTimestamp && endTimestamp && (
                  <PayoutReceiptButton
                    uid={payout.user.uid}
                    startTimestamp={startTimestamp}
                    endTimestamp={endTimestamp}
                  />
                )}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[#9A9A9A] dark:text-[#666666]">Gross</p>
                  <p className="mt-0.5 font-mono text-[#2A2A2A] dark:text-[#F5F5F5]">
                    {formatCurrency(payout.amount, priceUnit)}
                  </p>
                </div>
                <div>
                  <p className="text-[#9A9A9A] dark:text-[#666666]">Loan</p>
                  <p className="mt-0.5 font-mono text-[#C0392B]">
                    {payout.loanAmount > 0
                      ? `- ${formatCurrency(payout.loanAmount, priceUnit)}`
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[#9A9A9A] dark:text-[#666666]">Net Pay</p>
                  <p className="mt-0.5 font-mono font-bold text-[#D4AF37]">
                    {formatCurrency(Math.max(0, payout.amount - payout.loanAmount), priceUnit)}
                  </p>
                </div>
                <div>
                  <p className="text-[#9A9A9A] dark:text-[#666666]">Status</p>
                  <div className="mt-0.5">
                    <PayoutStatusBadge isPaid={payout.isPaid} compact />
                  </div>
                </div>
                {payout.createdAt && (
                  <div className="col-span-2">
                    <p className="text-[#9A9A9A] dark:text-[#666666]">Date</p>
                    <p className="mt-0.5 text-[#5A5A5A] dark:text-[#AAAAAA]">
                      {formatDate(payout.createdAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── DESKTOP: Standard table (hidden on mobile) ─────────────────────── */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FAF7E8] dark:bg-[#1A1A1A] border-b border-[#2A2A2A] dark:border-[#2E2E2E]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">Employee</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">Gross</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">Loan Deduction</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">Net Pay</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">Date</th>
              {showReceipt && (
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">Receipt</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E0B8]/40 dark:divide-[#2E2E2E]/60">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            ) : payouts.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="py-16 text-center">
                  <span className="text-3xl mb-3 block">💵</span>
                  <p className="text-sm text-[#5A5A5A] dark:text-[#AAAAAA]">No payouts found</p>
                  <p className="text-xs text-[#9A9A9A] dark:text-[#666666] mt-1">Try adjusting your date range</p>
                </td>
              </tr>
            ) : (
              payouts.map((payout, idx) => (
                <tr
                  key={payout.uid + idx}
                  className="hover:bg-[#FAF7E8]/30 dark:hover:bg-[#1E1E1E]/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-[#D4AF37]">
                          {payout.user?.fullName?.charAt(0)?.toUpperCase() ?? '?'}
                        </span>
                      </div>
                      <span className="font-medium text-[#2A2A2A] dark:text-[#F5F5F5] text-xs">
                        {payout.user?.fullName ?? '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-[#2A2A2A] dark:text-[#F5F5F5] font-mono">
                    {formatCurrency(payout.amount, priceUnit)}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-[#C0392B] font-mono">
                    {payout.loanAmount > 0 ? `- ${formatCurrency(payout.loanAmount, priceUnit)}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-xs font-bold text-[#D4AF37] font-mono">
                    {formatCurrency(Math.max(0, payout.amount - payout.loanAmount), priceUnit)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <PayoutStatusBadge isPaid={payout.isPaid} compact />
                  </td>
                  <td className="px-4 py-3 text-xs text-[#5A5A5A] dark:text-[#AAAAAA]">
                    {payout.createdAt ? formatDate(payout.createdAt) : '—'}
                  </td>
                  {showReceipt && (
                    <td className="px-4 py-3 text-center">
                      {payout.user?.uid && startTimestamp && endTimestamp && (
                        <PayoutReceiptButton
                          uid={payout.user.uid}
                          startTimestamp={startTimestamp}
                          endTimestamp={endTimestamp}
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PayoutTable;
