// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import { Bell } from 'lucide-react';
import type { IInventoryActivity } from '@/store/dashboard/dashboard.types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface RecentActivityLogProps {
  data?: IInventoryActivity[];
  loading?: boolean;
}

// ============================================================================
// HELPERS
// ============================================================================
const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

// ============================================================================
// SKELETON
// ============================================================================
const ActivitySkeleton: React.FC = () => (
  <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E8E0B8] dark:border-[#2E2E2E] p-5 animate-pulse">
    <div className="h-4 w-44 bg-[#E8E0B8] dark:bg-[#2E2E2E] rounded mb-4" />
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-start gap-3 mb-3">
        <div className="h-8 w-8 bg-[#E8E0B8] dark:bg-[#2E2E2E] rounded-full" />
        <div className="flex-1">
          <div className="h-3 w-full bg-[#F5F0D0] dark:bg-[#252525] rounded mb-1" />
          <div className="h-3 w-20 bg-[#F5F0D0] dark:bg-[#252525] rounded" />
        </div>
      </div>
    ))}
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const RecentActivityLog: React.FC<RecentActivityLogProps> = ({
  data,
  loading = false,
}) => {
  // ── RENDER ─────────────────────────────────────────────────────────────────
  if (loading) return <ActivitySkeleton />;

  const entries = data ?? [];

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E8E0B8] dark:border-[#2E2E2E] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Bell size={16} className="text-[#D4AF37]" />
        <h3 className="text-sm font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
          Recent Activity
        </h3>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-[#9A9A9A] dark:text-[#666666] text-center py-6">
          No recent activity
        </p>
      ) : (
        <div className="space-y-3">
          {entries.slice(0, 5).map((entry) => (
            <div
              key={entry.ilId}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#F5F0D0]/40 dark:hover:bg-[#252525] transition-colors"
            >
              <div
                className={`flex-shrink-0 mt-0.5 w-2 h-2 rounded-full ${
                  entry.isRead
                    ? 'bg-[#E8E0B8] dark:bg-[#2E2E2E]'
                    : 'bg-[#D4AF37]'
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#2A2A2A] dark:text-[#F5F5F5] leading-snug">
                  {entry.description || entry.action}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {entry.user?.fullName && (
                    <span className="text-xs font-medium text-[#D4AF37]">
                      {entry.user.fullName}
                    </span>
                  )}
                  <span className="text-xs text-[#9A9A9A] dark:text-[#666666]">
                    {timeAgo(entry.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivityLog;
