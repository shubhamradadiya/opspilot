// ============================================================================
// IMPORTS
// ============================================================================
import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchDashboardThunk } from '@/store/dashboard/dashboard.thunk';
import {
  selectDashboardData,
  selectDashboardLoading,
  selectDashboardError,
} from '@/store/dashboard/dashboard.slice';
import { Button } from '@/components/ui';
import StatsCard from '@/components/dashboard/StatsCard';
import AttendanceChart from '@/components/dashboard/AttendanceChart';
import ExpenseChart from '@/components/dashboard/ExpenseChart';
import InventorySummary from '@/components/dashboard/InventorySummary';
import TodayAttendance from '@/components/dashboard/TodayAttendance';
import RecentActivityLog from '@/components/dashboard/RecentActivityLog';
import QuickActions from '@/components/dashboard/QuickActions';

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const AdminDashboard: React.FC = () => {
  // ── HOOKS ──────────────────────────────────────────────────────────────────
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectDashboardData);
  const loading = useAppSelector(selectDashboardLoading);
  const error = useAppSelector(selectDashboardError);

  // ── EFFECTS ────────────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchDashboardThunk());
  }, [dispatch]);

  // ── HANDLERS ───────────────────────────────────────────────────────────────
  const handleRetry = () => {
    dispatch(fetchDashboardThunk());
  };

  // ── ERROR STATE ────────────────────────────────────────────────────────────
  if (error && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#FDE8E8] dark:bg-[rgba(192,57,43,0.15)]">
          <AlertCircle size={32} className="text-[#C0392B] dark:text-[#E05A4A]" />
        </div>
        <h2 className="text-lg font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
          Failed to Load Dashboard
        </h2>
        <p className="text-sm text-[#9A9A9A] dark:text-[#666666] text-center max-w-sm">
          {error}
        </p>
        <Button variant="primary" size="md" onClick={handleRetry}>
          <RefreshCw size={16} className="mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5]">
            Dashboard
          </h1>
          <p className="text-sm text-[#9A9A9A] dark:text-[#666666] mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRetry}
          className="p-2 rounded-lg border border-[#2A2A2A] dark:border-[#2E2E2E] text-[#5A5A5A] dark:text-[#AAAAAA] hover:bg-[#F5F0D0] dark:hover:bg-[#252525] transition-colors cursor-pointer"
          aria-label="Refresh dashboard"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* ── Row 1: Stats cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Employees"
          value={data?.employeeSummary.totalUsers ?? 0}
          subtitle={`${data?.employeeSummary.activeUsers ?? 0} active`}
          icon="users"
          loading={loading && !data}
          trend={
            data
              ? {
                  value: `${data.employeeSummary.inactiveUsers} inactive`,
                  direction: data.employeeSummary.inactiveUsers > 0 ? 'down' : 'neutral',
                }
              : undefined
          }
        />
        <StatsCard
          title="Today Clocked In"
          value={data?.todayClockedIn ?? 0}
          subtitle={`${data?.todayAbsent ?? 0} absent`}
          icon="clock"
          loading={loading && !data}
          trend={
            data
              ? {
                  value: `${data.todayAttendance.length} total`,
                  direction: data.todayClockedIn > 0 ? 'up' : 'neutral',
                }
              : undefined
          }
        />
        <StatsCard
          title="Inventory Stock"
          value={
            data
              ? (
                  data.inventoryTotals.carTires +
                  data.inventoryTotals.truckTires +
                  data.inventoryTotals.mixedTires +
                  data.inventoryTotals.bales
                ).toLocaleString()
              : 0
          }
          subtitle="All tire types + bales"
          icon="package"
          loading={loading && !data}
        />
        <StatsCard
          title="Monthly Expenses"
          value={`$${(data?.totalMonthlyExpense ?? 0).toLocaleString()}`}
          subtitle={`${data?.recentExpenses.length ?? 0} recent entries`}
          icon="dollar"
          loading={loading && !data}
        />
      </div>

      {/* ── Row 2: Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AttendanceChart loading={loading && !data} />
        <ExpenseChart loading={loading && !data} />
      </div>

      {/* ── Row 3: Tables + Widgets ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TodayAttendance data={data?.todayAttendance} loading={loading && !data} />
        <div className="space-y-4">
          <InventorySummary data={data?.inventoryTotals} loading={loading && !data} />
          <RecentActivityLog data={data?.recentActivity} loading={loading && !data} />
        </div>
      </div>

      {/* ── Row 4: Quick actions ── */}
      <QuickActions />
    </div>
  );
};

export default AdminDashboard;
