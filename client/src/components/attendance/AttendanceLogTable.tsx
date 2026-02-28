// ============================================================================
// ATTENDANCE LOG TABLE COMPONENT
// OpsPilot · FE-05
// Date-wise grouped table of attendance log entries.
// Admin can delete individual rows.
// ============================================================================
import React from 'react';
import { Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import DurationBadge from './DurationBadge';
import { formatDate, formatTime } from '@/utils/formatters';
import type { IDateWiseLog, IUserLog } from '@/store/attendance/attendance.types';

// ============================================================================
// SKELETON ROW
// ============================================================================
const SkeletonRow: React.FC = () => (
  <tr className="border-b border-[#E8E0B8]/40 dark:border-[#2E2E2E]/60">
    {[1, 2, 3, 4, 5].map((i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-[#E8E0B8] dark:bg-[#2E2E2E] rounded animate-pulse" />
      </td>
    ))}
  </tr>
);

// ============================================================================
// TYPES
// ============================================================================
interface AttendanceLogTableProps {
  logs: IDateWiseLog[];
  loading?: boolean;
  isAdmin?: boolean;
  /** Called when admin deletes a row */
  onDelete?: (ulId: string) => void;
  submitting?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================
const AttendanceLogTable: React.FC<AttendanceLogTableProps> = ({
  logs,
  loading = false,
  isAdmin = false,
  onDelete,
  submitting = false,
}) => {
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});

  const toggleGroup = (date: string) =>
    setCollapsed((prev) => ({ ...prev, [date]: !prev[date] }));

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (!loading && logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-[#E8E0B8]/40 dark:bg-[#2E2E2E] flex items-center justify-center mb-4">
          <span className="text-[#D4AF37] text-2xl">🕐</span>
        </div>
        <p className="text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA]">No attendance records found</p>
        <p className="text-xs text-[#9A9A9A] dark:text-[#666666] mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div className="overflow-x-auto rounded-xl border border-[#E8E0B8] dark:border-[#2E2E2E]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#FAF7E8] dark:bg-[#1A1A1A] border-b border-[#E8E0B8] dark:border-[#2E2E2E]">
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">Clock In</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">Clock Out</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">Duration</th>
            {isAdmin && (
              <th className="px-4 py-3 text-right text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider">Action</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E8E0B8]/40 dark:divide-[#2E2E2E]/60">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            : logs.map((group) => {
                const isCollapsed = collapsed[group.date];
                return (
                  <React.Fragment key={group.date}>
                    {/* Date group header row */}
                    <tr
                      className="bg-[#FAF7E8]/60 dark:bg-[#1A1A1A]/60 cursor-pointer hover:bg-[#F0EAC8]/60 dark:hover:bg-[#222]/60 transition-colors"
                      onClick={() => toggleGroup(group.date)}
                    >
                      <td colSpan={isAdmin ? 5 : 4} className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          {isCollapsed
                            ? <ChevronRight size={14} className="text-[#D4AF37]" />
                            : <ChevronDown size={14} className="text-[#D4AF37]" />
                          }
                          <span className="font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
                            {formatDate(group.date + 'T00:00:00')}
                          </span>
                          <span className="ml-auto text-xs text-[#9A9A9A] dark:text-[#666666]">
                            {group.logs.length} {group.logs.length === 1 ? 'entry' : 'entries'}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Log entries */}
                    {!isCollapsed &&
                      group.logs.map((log: IUserLog, idx) => (
                        <tr
                          key={log.ulId ?? idx}
                          className="hover:bg-[#FAF7E8]/30 dark:hover:bg-[#1E1E1E]/30 transition-colors"
                        >
                          <td className="px-4 py-3 pl-10 text-[#5A5A5A] dark:text-[#AAAAAA] text-xs">
                            #{idx + 1}
                          </td>
                          <td className="px-4 py-3 text-[#2A2A2A] dark:text-[#F5F5F5] font-mono text-xs">
                            {formatTime(log.checkedInAt)}
                          </td>
                          <td className="px-4 py-3 text-[#2A2A2A] dark:text-[#F5F5F5] font-mono text-xs">
                            {log.checkedOutAt ? formatTime(log.checkedOutAt) : (
                              <span className="text-[#D4AF37] text-xs">Active</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <DurationBadge
                              checkedIn={log.checkedInAt}
                              checkedOut={log.checkedOutAt}
                              compact
                            />
                          </td>
                          {isAdmin && (
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                disabled={submitting}
                                onClick={() => onDelete?.(log.ulId)}
                                className="p-1.5 rounded-md text-[#C0392B] hover:bg-[#C0392B]/10 transition-colors disabled:opacity-40"
                                title="Delete log"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    }
                  </React.Fragment>
                );
              })
          }
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceLogTable;
