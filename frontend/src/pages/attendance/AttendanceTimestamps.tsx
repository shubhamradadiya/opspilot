// ============================================================================
// ATTENDANCE TIMESTAMPS PAGE
// OpsPilot · FE-05 · Admin Only
// Weekly attendance grid — navigate week by week, switch DAY/WEEK slots.
// ============================================================================
import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, RefreshCw, Search } from 'lucide-react';
import TimestampGrid from '@/components/attendance/TimestampGrid';
import { fetchTimestampsThunk } from '@/store/attendance/attendance.thunk';
import { setFilters } from '@/store/attendance/attendance.slice';
import { Button } from '@/components/ui';
import type { AppDispatch, RootState } from '@/store/store';

// ============================================================================
// HELPERS
// ============================================================================
const getMondayOf = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatWeekLabel = (start: Date, end: Date): string => {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`;
};

// ============================================================================
// COMPONENT
// ============================================================================
const AttendanceTimestamps: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { timestamps, filters, timestampsLoading } = useSelector(
    (s: RootState) => s.attendance,
  );

  // Local week anchor — Monday of selected week
  const [weekStart, setWeekStart] = useState<Date>(() => getMondayOf(new Date()));
  const [search, setSearch] = useState('');

  // Derive Sunday from weekStart
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  // ── Fetch on week or slotType change ─────────────────────────────────────────
  const startTs = weekStart.getTime();
  const endTs = weekEnd.getTime();
  const slotType = filters.calenderSlotType;

  const load = useCallback(() => {
    dispatch(
      fetchTimestampsThunk({
        startTimestamp: startTs,
        endTimestamp: endTs,
        calenderSlotType: slotType,
        search: search || undefined,
        limit: 50,
      }),
    );
  }, [dispatch, startTs, endTs, slotType, search]);

  useEffect(() => { load(); }, [load]);

  // ── Navigation ────────────────────────────────────────────────────────────────
  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };
  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };
  const goToday = () => setWeekStart(getMondayOf(new Date()));

  // Debounced search
  useEffect(() => {
    const t = setTimeout(load, 350);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div className="page-wrapper space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5]">Attendance Timestamps</h1>
          <p className="text-sm text-[#9A9A9A] dark:text-[#666666] mt-0.5">Weekly hours grid for all employees</p>
        </div>
        <Button variant="ghost" size="sm" onClick={load} disabled={timestampsLoading}>
          <RefreshCw size={14} className={timestampsLoading ? 'animate-spin' : ''} />
        </Button>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">

          {/* Week navigator — always a single row, truncates on narrow */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={prevWeek}
              className="p-2 rounded-lg border border-[#2A2A2A] dark:border-[#2E2E2E] text-[#5A5A5A] dark:text-[#AAAAAA] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors flex-shrink-0"
              aria-label="Previous week"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="flex-1 min-w-0 text-sm font-semibold text-[#2A2A2A] dark:text-[#F5F5F5] text-center truncate px-1">
              {formatWeekLabel(weekStart, weekEnd)}
            </span>

            <button
              type="button"
              onClick={nextWeek}
              className="p-2 rounded-lg border border-[#2A2A2A] dark:border-[#2E2E2E] text-[#5A5A5A] dark:text-[#AAAAAA] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors flex-shrink-0"
              aria-label="Next week"
            >
              <ChevronRight size={16} />
            </button>

            <button
              type="button"
              onClick={goToday}
              className="flex-shrink-0 text-xs text-[#D4AF37] hover:text-[#B8960E] font-medium transition-colors whitespace-nowrap"
            >
              Today
            </button>
          </div>

          {/* DAY / WEEK toggle
              Mobile: full width (w-full, each button flex-1)
              sm+: auto-width pushed to the right with ml-auto */}
          <div className="flex w-full sm:w-auto sm:ml-auto rounded-lg border border-[#2A2A2A] dark:border-[#2E2E2E] overflow-hidden flex-shrink-0">
            {(['DAY', 'WEEK'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => dispatch(setFilters({ calenderSlotType: type }))}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-medium transition-colors ${
                  filters.calenderSlotType === type
                    ? 'bg-[#D4AF37] text-white'
                    : 'text-[#5A5A5A] dark:text-[#AAAAAA] hover:bg-[#E8E0B8]/40 dark:hover:bg-[#2E2E2E]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-52 flex-shrink-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]" />
            <input
              type="text"
              placeholder="Search employees…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-8 pr-3 rounded-md text-sm border border-[#2A2A2A] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

        </div>
      </div>

      {/* Grid */}
      <TimestampGrid entries={timestamps} loading={timestampsLoading} />
    </div>
  );
};

export default AttendanceTimestamps;
