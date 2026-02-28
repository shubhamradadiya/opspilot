import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { getActivityLogs, markLogsAsRead } from '../../store/inventory/inventory.thunk';
import { RootState } from '../../store/store';
import { ActivityLogTable } from '../../components/inventory/ActivityLogTable';

const ActivityLogs: React.FC = () => {
  const dispatch = useAppDispatch();
  const { logs, loading } = useAppSelector((state: RootState) => state.inventory);

  useEffect(() => {
    dispatch(getActivityLogs({ limit: 100 }));
  }, [dispatch]);

  const handleMarkRead = (logIds: number[]) => {
    dispatch(markLogsAsRead(logIds));
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
            Activity Logs
          </h1>
          <p className="text-sm text-[#5A5A5A] dark:text-[#AAAAAA] mt-1">
            Audit trailing for entire inventory lifecycle events
          </p>
        </div>
      </div>

      <ActivityLogTable data={logs} isLoading={loading} onMarkRead={handleMarkRead} />
    </div>
  );
};

export default ActivityLogs;
