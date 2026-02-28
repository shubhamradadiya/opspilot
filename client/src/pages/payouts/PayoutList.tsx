// ============================================================================
// PAYOUT LIST PAGE
// OpsPilot · FE-06
// Admin: all payouts table with search, date range, add loan, create payout.
// User: own payouts from self-payouts endpoint.
// ============================================================================
import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RefreshCw, Plus, DollarSign } from 'lucide-react';
import PayoutTable from '@/components/payouts/PayoutTable';
import AddLoanModal from '@/components/payouts/AddLoanModal';
import PayoutReceiptButton from '@/components/payouts/PayoutReceiptButton';
import {
  fetchAllPayoutsThunk,
  fetchSelfPayoutsThunk,
  addLoanThunk,
} from '@/store/payouts/payouts.thunk';
import { setFilters } from '@/store/payouts/payouts.slice';
import { getCurrentWeekRange, formatCurrency } from '@/utils/formatters';
import { APP_ROUTES } from '@/utils/routes';
import { Button } from '@/components/ui';
import type { AppDispatch, RootState } from '@/store/store';
import type { IPayout } from '@/store/payouts/payouts.types';

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const PayoutList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((s: RootState) => s.auth);
  const isAdmin = user?.role === 'admin';
  const { allPayouts, selfPayouts, filters, loading, submitting } = useSelector(
    (s: RootState) => s.payouts,
  );
  const employees = useSelector((s: RootState) => s.employees.list);
  const [loanModalOpen, setLoanModalOpen] = useState(false);

  // ── Load payouts ──────────────────────────────────────────────────────────────
  const load = useCallback(() => {
    if (isAdmin) {
      dispatch(
        fetchAllPayoutsThunk({
          calenderSlotType: filters.calenderSlotType,
          startTimestamp: filters.startTimestamp ?? Date.now() - 7 * 86_400_000,
          endTimestamp: filters.endTimestamp ?? Date.now(),
          search: filters.search || undefined,
          limit: 50,
        }),
      );
    } else {
      dispatch(
        fetchSelfPayoutsThunk({
          startTimestamp: filters.startTimestamp,
          endTimestamp: filters.endTimestamp,
          limit: 50,
        }),
      );
    }
  }, [dispatch, isAdmin, filters]);

  useEffect(() => { load(); }, [load]);

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleAddLoan = (params: { uid: string; loanAmount: number }) => {
    dispatch(addLoanThunk(params, () => {
      setLoanModalOpen(false);
      load();
    }));
  };

  const resetDateRange = () => {
    const { start, end } = getCurrentWeekRange();
    dispatch(setFilters({ startTimestamp: start, endTimestamp: end }));
  };

  // ── Flatten admin payouts for table ───────────────────────────────────────────
  const adminFlatPayouts: IPayout[] = allPayouts.flatMap((u) =>
    u.payouts.map((p) => ({
      ...p,
      user: { uid: u.uid, fullName: u.fullName, perHourRate: 0 },
    })),
  );

  // ── RENDER ────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5]">
            {isAdmin ? 'Payouts' : 'My Payouts'}
          </h1>
          <p className="text-sm text-[#9A9A9A] dark:text-[#666666] mt-0.5">
            {isAdmin ? 'Manage employee payouts and loans' : 'Your payment history'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </Button>
          {isAdmin && (
            <>
              <Button variant="ghost" size="sm" onClick={() => setLoanModalOpen(true)}>
                <DollarSign size={14} className="mr-1" /> Add Loan
              </Button>
              <Link to={APP_ROUTES.PAYOUTS.CREATE}>
                <Button variant="primary" size="sm">
                  <Plus size={14} className="mr-1.5" /> Create Payout
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Summary cards — admin: totals per employee */}
      {isAdmin && allPayouts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {allPayouts.slice(0, 4).map((u) => (
            <div key={u.uid} className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#E8E0B8] dark:border-[#2E2E2E] p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-[#D4AF37]">{u.fullName?.charAt(0)}</span>
                </div>
                <PayoutReceiptButton
                  uid={u.uid}
                  startTimestamp={filters.startTimestamp ?? 0}
                  endTimestamp={filters.endTimestamp ?? Date.now()}
                />
              </div>
              <p className="text-xs text-[#9A9A9A] dark:text-[#666666] truncate">{u.fullName}</p>
              <p className="text-base font-bold text-[#D4AF37] mt-0.5">
                {formatCurrency(u.totalAmount)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#E8E0B8] dark:border-[#2E2E2E] p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {isAdmin && (
            <>
              {/* Slot type */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">View By</label>
                <div className="flex rounded-lg border border-[#E8E0B8] dark:border-[#2E2E2E] overflow-hidden h-9">
                  {(['DAY', 'WEEK'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => dispatch(setFilters({ calenderSlotType: t }))}
                      className={`flex-1 text-xs font-medium transition-colors ${
                        filters.calenderSlotType === t
                          ? 'bg-[#D4AF37] text-white'
                          : 'text-[#5A5A5A] dark:text-[#AAAAAA] hover:bg-[#E8E0B8]/40 dark:hover:bg-[#2E2E2E]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* From */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">From</label>
            <input
              type="date"
              value={filters.startTimestamp
                ? new Date(filters.startTimestamp).toISOString().split('T')[0]
                : ''}
              onChange={(e) =>
                dispatch(setFilters({ startTimestamp: e.target.value ? new Date(e.target.value).setHours(0, 0, 0, 0) : null }))
              }
              className="w-full h-9 px-3 rounded-md text-sm border border-[#E8E0B8] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          {/* To */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">To</label>
            <input
              type="date"
              value={filters.endTimestamp
                ? new Date(filters.endTimestamp).toISOString().split('T')[0]
                : ''}
              onChange={(e) =>
                dispatch(setFilters({ endTimestamp: e.target.value ? new Date(e.target.value).setHours(23, 59, 59, 999) : null }))
              }
              className="w-full h-9 px-3 rounded-md text-sm border border-[#E8E0B8] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={resetDateRange}
          className="mt-3 text-xs text-[#D4AF37] hover:text-[#B8960E] font-medium transition-colors"
        >
          Reset to current week
        </button>
      </div>

      {/* Table */}
      {isAdmin ? (
        <PayoutTable
          payouts={adminFlatPayouts}
          loading={loading}
          showReceipt
          startTimestamp={filters.startTimestamp ?? 0}
          endTimestamp={filters.endTimestamp ?? Date.now()}
          priceUnit={user?.priceUnit}
        />
      ) : (
        // Self payout table for employees
        <div className="overflow-x-auto rounded-xl border border-[#E8E0B8] dark:border-[#2E2E2E]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF7E8] dark:bg-[#1A1A1A] border-b border-[#E8E0B8] dark:border-[#2E2E2E]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">Loan</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">Net Pay</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0B8]/40 dark:divide-[#2E2E2E]/60">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-b border-[#E8E0B8]/40 dark:border-[#2E2E2E]/60">
                      {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-[#E8E0B8] dark:bg-[#2E2E2E] rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : selfPayouts.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-[#FAF7E8]/30 dark:hover:bg-[#1E1E1E]/30 transition-colors">
                      <td className="px-4 py-3 text-xs text-[#9A9A9A] dark:text-[#666666]">#{idx + 1}</td>
                      <td className="px-4 py-3 text-right text-xs font-mono text-[#2A2A2A] dark:text-[#F5F5F5]">
                        {formatCurrency(p.amount, user?.priceUnit)}
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-mono text-[#C0392B]">
                        {p.loanAmount > 0 ? `- ${formatCurrency(p.loanAmount, user?.priceUnit)}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-bold font-mono text-[#D4AF37]">
                        {formatCurrency(Math.max(0, p.amount - p.loanAmount), user?.priceUnit)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          p.isPaid ? 'text-[#2ECC71] bg-[#2ECC71]/10 border-[#2ECC71]/30' : 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30'
                        }`}>
                          {p.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#5A5A5A] dark:text-[#AAAAAA]">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {user?.uid && filters.startTimestamp && filters.endTimestamp && (
                          <PayoutReceiptButton
                            uid={user.uid}
                            startTimestamp={filters.startTimestamp}
                            endTimestamp={filters.endTimestamp}
                          />
                        )}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
          {!loading && selfPayouts.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm text-[#9A9A9A] dark:text-[#666666]">No payouts found for this period</p>
            </div>
          )}
        </div>
      )}

      {/* Add loan modal */}
      {isAdmin && (
        <AddLoanModal
          open={loanModalOpen}
          onClose={() => setLoanModalOpen(false)}
          onSubmit={handleAddLoan}
          submitting={submitting}
          employees={employees.map((e) => ({
            uid: e.uid,
            fullName: e.fullName,
            loanAmount: e.loanAmount,
          }))}
        />
      )}
    </div>
  );
};

export default PayoutList;
