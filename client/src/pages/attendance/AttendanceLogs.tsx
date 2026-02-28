// ============================================================================
// ATTENDANCE LOGS PAGE
// OpsPilot · FE-05
// Date-wise log table. User sees own logs; admin can switch employee view.
// Admin can add manual logs and delete individual entries.
// ============================================================================
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshCw, Plus } from 'lucide-react';
import AttendanceLogTable from '@/components/attendance/AttendanceLogTable';
import ManualLogModal from '@/components/attendance/ManualLogModal';
import { fetchLogsThunk, addManualLogThunk, deleteLogThunk } from '@/store/attendance/attendance.thunk';
import { fetchEmployeesThunk } from '@/store/employees/employees.thunk';
import { setFilters } from '@/store/attendance/attendance.slice';
import { DatePicker } from '@/components/ui/DatePicker';
import { getCurrentWeekRange } from '@/utils/formatters';
import { Button } from '@/components/ui';
import type { AppDispatch, RootState } from '@/store/store';

// ============================================================================
// COMPONENT
// ============================================================================
const AttendanceLogs: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAdmin } = useSelector((s: RootState) => ({
    isAdmin: s.auth.user?.role === 'admin',
  }));
  const { logs, filters, logsLoading, submitting } = useSelector(
    (s: RootState) => s.attendance,
  );
  const employees = useSelector((s: RootState) => s.employees.list);
  const [manualModalOpen, setManualModalOpen] = useState(false);

  // ── Load logs ───────────────────────────────────────────────────────────────
  const load = useCallback(() => {
    dispatch(
      fetchLogsThunk({
        startTimestamp: filters.startTimestamp,
        endTimestamp: filters.endTimestamp,
        uid: filters.selectedUid,
        limit: 50,
      }),
    );
  }, [dispatch, filters.startTimestamp, filters.endTimestamp, filters.selectedUid]);

  useEffect(() => {
    load();
    if (isAdmin) {
      dispatch(fetchEmployeesThunk());
    }
  }, [load, isAdmin, dispatch]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleAddManualLog = (params: {
    uid: string;
    checkedInAt: number;
    checkedOutAt: number;
  }) => {
    dispatch(addManualLogThunk(params, () => {
      setManualModalOpen(false);
      load();
    }));
  };

  const handleDelete = (ulId: string) => {
    dispatch(deleteLogThunk([ulId]));
  };

  const resetDateRange = () => {
    const { start, end } = getCurrentWeekRange();
    dispatch(setFilters({ startTimestamp: start, endTimestamp: end }));
  };

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5]">Attendance Logs</h1>
          <p className="text-sm text-[#9A9A9A] dark:text-[#666666] mt-0.5">
            {isAdmin ? 'All employee clock records' : 'Your personal attendance history'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={load} disabled={logsLoading}>
            <RefreshCw size={14} className={logsLoading ? 'animate-spin' : ''} />
          </Button>
          {isAdmin && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setManualModalOpen(true)}
            >
              <Plus size={14} className="mr-1.5" /> Add Manual Log
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#E8E0B8] dark:border-[#2E2E2E] p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Employee selector (admin only) */}
          {isAdmin && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">Employee</label>
              <select
                value={filters.selectedUid ?? ''}
                onChange={(e) => dispatch(setFilters({ selectedUid: e.target.value || null }))}
                className="w-full h-9 px-3 rounded-md text-sm border border-[#E8E0B8] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="">All employees</option>
                {employees.map((e) => (
                  <option key={e.uid} value={e.uid}>{e.fullName}</option>
                ))}
              </select>
            </div>
          )}

          {/* Date range */}
          <div className="space-y-1.5 pt-0.5">
            <DatePicker
              label="From"
              value={filters.startTimestamp ? new Date(filters.startTimestamp) : null}
              onChange={(date) =>
                dispatch(setFilters({
                  startTimestamp: date ? new Date(date).setHours(0, 0, 0, 0) : null,
                }))
              }
              placeholderText="Select start date"
              dateFormat="MMM d, yyyy"
              maxDate={filters.endTimestamp ? new Date(filters.endTimestamp) : undefined}
            />
          </div>

          <div className="space-y-1.5 pt-0.5">
            <DatePicker
              label="To"
              value={filters.endTimestamp ? new Date(filters.endTimestamp) : null}
              onChange={(date) =>
                dispatch(setFilters({
                  endTimestamp: date ? new Date(date).setHours(23, 59, 59, 999) : null,
                }))
              }
              placeholderText="Select end date"
              dateFormat="MMM d, yyyy"
              minDate={filters.startTimestamp ? new Date(filters.startTimestamp) : undefined}
            />
          </div>
        </div>

        {/* Reset */}
        <button
          type="button"
          onClick={resetDateRange}
          className="mt-3 text-xs text-[#D4AF37] hover:text-[#B8960E] font-medium transition-colors"
        >
          Reset to current week
        </button>
      </div>

      {/* Table */}
      <AttendanceLogTable
        logs={logs}
        loading={logsLoading}
        isAdmin={isAdmin}
        onDelete={handleDelete}
        submitting={submitting}
      />

      {/* Manual log modal (admin) */}
      {isAdmin && (
        <ManualLogModal
          open={manualModalOpen}
          onClose={() => setManualModalOpen(false)}
          onSubmit={handleAddManualLog}
          submitting={submitting}
          employees={employees.map((e) => ({ uid: e.uid, fullName: e.fullName }))}
        />
      )}
    </div>
  );
};

export default AttendanceLogs;
