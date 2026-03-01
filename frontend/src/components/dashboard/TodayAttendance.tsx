// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import { Clock } from 'lucide-react';
import type { ITodayAttendanceEntry } from '@/store/dashboard/dashboard.types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface TodayAttendanceProps {
  data?: ITodayAttendanceEntry[];
  loading?: boolean;
}

// ============================================================================
// HELPERS
// ============================================================================
const formatTime = (value: string | number | null): string => {
  if (!value) return '—';
  const d = new Date(value);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// ============================================================================
// SKELETON
// ============================================================================
const TableSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] p-5 animate-pulse">
    <div className="h-4 w-40 bg-[#E8E0B8] dark:bg-[#2E2E2E] rounded mb-4" />
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-8 bg-[#F5F0D0] dark:bg-[#252525] rounded mb-2" />
    ))}
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const TodayAttendance: React.FC<TodayAttendanceProps> = ({
  data,
  loading = false,
}) => {
  // ── RENDER ─────────────────────────────────────────────────────────────────
  if (loading) return <TableSkeleton />;

  const entries = data ?? [];

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-[#D4AF37]" />
        <h3 className="text-sm font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
          Today's Attendance
        </h3>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-[#9A9A9A] dark:text-[#666666] text-center py-6">
          No attendance data available
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A] dark:border-[#2E2E2E]">
                <th className="text-left py-2 text-xs font-medium text-[#9A9A9A] dark:text-[#666666] uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left py-2 text-xs font-medium text-[#9A9A9A] dark:text-[#666666] uppercase tracking-wider">
                  In
                </th>
                <th className="text-left py-2 text-xs font-medium text-[#9A9A9A] dark:text-[#666666] uppercase tracking-wider">
                  Out
                </th>
                <th className="text-left py-2 text-xs font-medium text-[#9A9A9A] dark:text-[#666666] uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.slice(0, 6).map((entry) => {
                const latestLog = entry.userLogs?.[entry.userLogs.length - 1];
                const isActive = entry.attendanceStatus === 'clockedIn';
                
                return (
                  <tr
                    key={entry.userId}
                    className="border-b border-[#2A2A2A]/50 dark:border-[#2E2E2E]/50 last:border-0"
                  >
                    <td className="py-2 text-[#2A2A2A] dark:text-[#F5F5F5] font-medium">
                      {entry.fullName ?? 'Unknown'}
                    </td>
                    <td className="py-2 text-[#5A5A5A] dark:text-[#AAAAAA]">
                      {formatTime(latestLog?.checkedInAt ?? null)}
                    </td>
                    <td className="py-2 text-[#5A5A5A] dark:text-[#AAAAAA]">
                      {formatTime(latestLog?.checkedOutAt ?? null)}
                    </td>
                    <td className="py-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          isActive
                            ? 'bg-[#D4F5E0] text-[#2D7A4F] dark:bg-[rgba(45,122,79,0.15)] dark:text-[#4CAF80]'
                            : entry.userLogs?.length
                              ? 'bg-[#F0EDD0] text-[#5A5A5A] dark:bg-[rgba(90,90,90,0.15)] dark:text-[#AAAAAA]'
                              : 'bg-[#FADADD] text-[#C0392B] dark:bg-[rgba(192,57,43,0.15)] dark:text-[#E05A4A]'
                        }`}
                      >
                        {isActive
                          ? 'Active'
                          : entry.userLogs?.length
                            ? 'Done'
                            : 'Absent'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TodayAttendance;
