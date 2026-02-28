// ============================================================================
// TIMESTAMP GRID COMPONENT
// OpsPilot · FE-05 · Admin Only
// Weekly/daily attendance hours grid — color-coded by hours per cell.
// ============================================================================
import React from 'react';
import { decimalHoursToStr } from '@/utils/formatters';
import type { ITimestampEntry, ITimestampSlot } from '@/store/attendance/attendance.types';

// ============================================================================
// HELPERS — Color code hours
// ============================================================================
const getHoursColor = (hours: number): string => {
  if (hours === 0) return 'text-[#9A9A9A] dark:text-[#555555]';
  if (hours >= 8) return 'text-green-600 dark:text-green-400 font-semibold';
  if (hours >= 4) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

// ============================================================================
// SKELETON
// ============================================================================
const SkeletonGrid: React.FC = () => (
  <div className="space-y-2">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-10 bg-[#E8E0B8] dark:bg-[#2E2E2E] rounded-lg animate-pulse" />
    ))}
  </div>
);

// ============================================================================
// TYPES
// ============================================================================
interface TimestampGridProps {
  entries: ITimestampEntry[];
  loading?: boolean;
  /** Column date labels extracted from first entry's slots */
  dateLabels?: string[];  // ["Mon Feb 17", "Tue Feb 18", …]
}

// ============================================================================
// COMPONENT
// ============================================================================
const TimestampGrid: React.FC<TimestampGridProps> = ({
  entries,
  loading = false,
  dateLabels,
}) => {
  // Derive column labels from first entry's slots
  const cols = dateLabels?.length
    ? dateLabels
    : (entries[0]?.attendance ?? []).map((s: ITimestampSlot) => {
        const d = new Date(s.startDate * 1000);
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      });

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (!loading && entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-4xl mb-3">📅</span>
        <p className="text-sm text-[#5A5A5A] dark:text-[#AAAAAA]">No attendance data for this period</p>
      </div>
    );
  }

  if (loading) return <SkeletonGrid />;

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div className="overflow-x-auto rounded-xl border border-[#E8E0B8] dark:border-[#2E2E2E]">
      <table className="w-full text-sm" aria-label="Attendance Timestamp Grid">
        {/* Header */}
        <thead>
          <tr className="bg-[#FAF7E8] dark:bg-[#1A1A1A] border-b border-[#E8E0B8] dark:border-[#2E2E2E]">
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider min-w-[140px]">
              Employee
            </th>
            {cols.map((col: string, i: number) => (
              <th
                key={i}
                className="px-3 py-3 text-center text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider min-w-[80px]"
              >
                {col}
              </th>
            ))}
            <th className="px-4 py-3 text-center text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-[#E8E0B8]/40 dark:divide-[#2E2E2E]/60">
          {entries.map((entry, index) => (
            <tr
              key={entry.userId || index}
              className="hover:bg-[#FAF7E8]/30 dark:hover:bg-[#1E1E1E]/30 transition-colors"
            >
              {/* Employee name */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  {/* Avatar initials */}
                  <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-[#D4AF37]">
                      {entry.fullName?.charAt(0)?.toUpperCase() ?? '?'}
                    </span>
                  </div>
                  <span className="text-[#2A2A2A] dark:text-[#F5F5F5] font-medium text-xs truncate max-w-[100px]">
                    {entry.fullName}
                  </span>
                </div>
              </td>

              {/* Per-day slots */}
              {cols.map((_: string, i: number) => {
                const slot = entry.attendance?.[i];
                const hours = slot?.durationInHours ?? 0;
                return (
                  <td key={i} className="px-3 py-3 text-center">
                    <span className={`font-mono text-xs ${getHoursColor(hours)}`}>
                      {hours > 0 ? decimalHoursToStr(hours) : '—'}
                    </span>
                  </td>
                );
              })}

              {/* Total */}
              <td className="px-4 py-3 text-center">
                <span className="text-xs font-bold text-[#D4AF37]">
                  {decimalHoursToStr(entry.totalDurationInHours ?? 0)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-[#E8E0B8] dark:border-[#2E2E2E] bg-[#FAF7E8]/50 dark:bg-[#1A1A1A]/50 flex gap-4 text-xs">
        <span className="text-green-600 dark:text-green-400 font-medium">≥ 8h Full day</span>
        <span className="text-yellow-600 dark:text-yellow-400">4–8h Partial</span>
        <span className="text-red-600 dark:text-red-400">&lt; 4h Short</span>
        <span className="text-[#9A9A9A]">— Absent</span>
      </div>
    </div>
  );
};

export default TimestampGrid;
