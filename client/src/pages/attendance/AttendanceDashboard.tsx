// ============================================================================
// ATTENDANCE DASHBOARD PAGE
// OpsPilot · FE-05
// Clock button + attendance summary cards for the current user.
// ============================================================================
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Clock, BarChart2, DollarSign, ExternalLink } from 'lucide-react';
import ClockButton from '@/components/attendance/ClockButton';
import { checkStatusThunk, clockThunk, fetchLogsThunk } from '@/store/attendance/attendance.thunk';
import { formatCurrency, msToHoursMinutes } from '@/utils/formatters';
import { APP_ROUTES } from '@/utils/routes';
import type { AppDispatch } from '@/store/store';
import type { RootState } from '@/store/store';

// ============================================================================
// SUMMARY CARD
// ============================================================================
const SummaryCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}> = ({ icon, label, value, sub }) => (
  <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#E8E0B8] dark:border-[#2E2E2E] p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-[#9A9A9A] dark:text-[#666666] font-medium uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5]">{value}</p>
        {sub && <p className="text-xs text-[#9A9A9A] dark:text-[#666666] mt-1">{sub}</p>}
      </div>
      <span className="text-[#D4AF37]">{icon}</span>
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const AttendanceDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((s: RootState) => s.auth);
  const { status, summary, statusLoading, clockLoading } = useSelector(
    (s: RootState) => s.attendance,
  );

  // ── Fetch clock status on mount ─────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    dispatch(
      checkStatusThunk({
        isoCode: user.isoCode ?? 'IN',
        countryCode: user.countryCode ?? '+91',
        phoneNumber: user.phone ?? '',
      }),
    );
    dispatch(fetchLogsThunk({ limit: 10 }));
  }, [dispatch, user]);

  // ── Clock action ────────────────────────────────────────────────────────────
  const handleClock = useCallback(async () => {
    if (!user) return;
    await dispatch(
      clockThunk({
        uid: user.uid,
        ulId: status?.ulId,
        isCheckedIn: status?.isCheckedIn ?? false,
      }),
    );
    // Re-check status after toggle
    dispatch(
      checkStatusThunk({
        isoCode: user.isoCode ?? 'IN',
        countryCode: user.countryCode ?? '+91',
        phoneNumber: user.phone ?? '',
      }),
    );
    dispatch(fetchLogsThunk({ limit: 10 }));
  }, [dispatch, user, status]);

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5]">Attendance</h1>
          <p className="text-sm text-[#9A9A9A] dark:text-[#666666] mt-0.5">
            Track your work hours
          </p>
        </div>
        <Link
          to={APP_ROUTES.ATTENDANCE.LOGS}
          className="flex items-center gap-1.5 text-sm text-[#D4AF37] hover:text-[#B8960E] font-medium transition-colors"
        >
          View Logs <ExternalLink size={14} />
        </Link>
      </div>

      {/* Clock section */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E8E0B8] dark:border-[#2E2E2E] p-8 flex flex-col items-center gap-8">
        {statusLoading ? (
          <div className="w-48 h-48 rounded-full bg-[#E8E0B8]/40 dark:bg-[#2E2E2E] animate-pulse" />
        ) : (
          <ClockButton
            isCheckedIn={status?.isCheckedIn ?? false}
            checkedInAt={status?.checkedInAt ?? null}
            loading={clockLoading}
            onClock={handleClock}
          />
        )}

        <p className="text-xs text-[#9A9A9A] dark:text-[#666666] text-center max-w-xs">
          {status?.isCheckedIn
            ? 'You are currently clocked in. Click to end your session.'
            : 'Click the button above to start your work session.'}
        </p>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            icon={<Clock size={22} />}
            label="Today"
            value={msToHoursMinutes(summary.todayHours * 3_600_000)}
            sub="Hours worked"
          />
          <SummaryCard
            icon={<BarChart2 size={22} />}
            label="This Week"
            value={msToHoursMinutes(summary.thisWeekHours * 3_600_000)}
            sub="Hours worked"
          />
          <SummaryCard
            icon={<DollarSign size={22} />}
            label="This Week Payout"
            value={formatCurrency(summary.thisWeekPayout)}
            sub="Estimated"
          />
          <SummaryCard
            icon={<DollarSign size={22} />}
            label="Last Week Payout"
            value={formatCurrency(summary.lastWeekPayout)}
            sub="Finalized"
          />
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;
