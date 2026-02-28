import React from 'react';
import { Check } from 'lucide-react';
import { IInventoryLog } from '../../store/inventory/inventory.types';

interface Props {
  data: IInventoryLog[];
  isLoading: boolean;
  onMarkRead?: (logIds: number[]) => void;
}

export const ActivityLogTable: React.FC<Props> = ({ data, isLoading, onMarkRead }) => {
  if (isLoading && data.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-[#1E1E1E] border border-cream-border dark:border-[#2E2E2E] rounded-xl overflow-hidden shadow-sm">
        <div className="animate-pulse flex flex-col">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 border-b border-cream-subtle dark:border-[#222222] bg-[#F5F0D0]/50 dark:bg-ink-subtle/50"
            />
          ))}
        </div>
      </div>
    );
  }


  const getUnreadRows = () => data.filter((row) => !row.isRead).map((row) => row.id);

  return (
    <div className="w-full bg-white dark:bg-[#1E1E1E] border border-cream-border dark:border-[#2E2E2E] rounded-xl overflow-hidden shadow-sm overflow-x-auto relative">
      <div className="flex justify-between items-center px-4 py-3 border-b border-cream-border dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E]">
        <h3 className="text-base font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">Activity Timeline</h3>
        {onMarkRead && getUnreadRows().length > 0 && (
          <button
            onClick={() => onMarkRead(getUnreadRows())}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors bg-white dark:bg-[#1E1E1E] border border-[#D4AF37] text-[#D4AF37] hover:bg-[#FDFBD4] dark:hover:bg-[#2A2A2A]"
          >
            <Check className="w-3.5 h-3.5" />
            Mark {getUnreadRows().length} as Read
          </button>
        )}
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F5F0D0] dark:bg-[#252525] border-b border-cream-border dark:border-[#2E2E2E]">
            <th className="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider dark:text-[#9A9A9A] w-1/2">
              Action
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider dark:text-[#9A9A9A]">
              User
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider dark:text-[#9A9A9A]">
              Timestamp
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F0EDD0] dark:divide-[#222222]">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center text-sm text-ink-600 dark:text-[#AAAAAA]"
              >
                No inventory activity logs found.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                className={`transition-colors group ${
                  !row.isRead
                    ? 'bg-[#FEFDF0] dark:bg-[#2A2200]/30'
                    : 'bg-white dark:bg-[#1E1E1E] hover:bg-cream-base dark:hover:bg-[#252525]'
                }`}
              >
                <td className="px-4 py-3 text-sm text-[#2A2A2A] dark:text-[#F5F5F5]">
                  <div className="flex items-center gap-3">
                    {!row.isRead && (
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#D4AF37]" title="Unread Event" />
                    )}
                    <span className="font-medium whitespace-pre-wrap">{row.text}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[#5A5A5A] dark:text-[#AAAAAA] whitespace-nowrap font-medium">
                  {row.user?.fullName || row.user?.email || 'System'}
                </td>
                <td className="px-4 py-3 text-sm text-ink-400 dark:text-[#666666] whitespace-nowrap">
                  <span className="font-mono">
                    {new Date(row.createdAt).toLocaleDateString()} at{' '}
                    {new Date(row.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
