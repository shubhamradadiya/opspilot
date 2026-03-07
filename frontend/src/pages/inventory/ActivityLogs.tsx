import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { getActivityLogs, markLogsAsRead } from '../../store/inventory/inventory.thunk';
import { RootState } from '../../store/store';
import { ActivityLogTable } from '../../components/inventory/ActivityLogTable';
import { Pagination } from '@/components/ui';

const ActivityLogs: React.FC = () => {
  const dispatch = useAppDispatch();
  const { logs, loading, logsTotalPages, logsTotalItems } = useAppSelector((state: RootState) => state.inventory);

  const [page, setPage] = useState(1);
  const LIMIT = 20;

  useEffect(() => {
    dispatch(getActivityLogs({ limit: LIMIT, page }));
  }, [dispatch, page]);

  const handleMarkRead = (logIds: number[]) => {
    dispatch(markLogsAsRead(logIds));
  };

  return (
    <div className="page-wrapper animate-in fade-in duration-300">
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

      <div className="space-y-4">
        <ActivityLogTable data={logs} isLoading={loading} onMarkRead={handleMarkRead} />
        
        {/* Pagination Controls */}
        <Pagination
          currentPage={page}
          totalPages={logsTotalPages}
          totalItems={logsTotalItems}
          itemsPerPage={LIMIT}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default ActivityLogs;
