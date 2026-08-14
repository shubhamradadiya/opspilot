import React from 'react';
import { IContainer, ContainerStatus } from '@/store/containers/containers.types';
import ContainerStatusBadge from './ContainerStatusBadge';
import { Eye, Edit2, Trash2, Box, CalendarClock, Scale } from 'lucide-react';
import { format, isPast } from 'date-fns';

// Components - Common
import SkeletonLoader from '@/components/common/SkeletonLoader';


interface ContainerTableProps {
  containers: IContainer[];
  loading: boolean;
  onView: (c: IContainer) => void;
  onEdit: (c: IContainer) => void;
  onDelete: (c: IContainer) => void;
}

const isOverdue = (targetDate: number | null, status: string | undefined | null) => {
  if (!targetDate) return false;
  if (!status) return false;
  const isCompleted = status.toLowerCase() === ContainerStatus.COMPLETED.toLowerCase();
  return isPast(new Date(targetDate)) && !isCompleted;
};

const ContainerTable: React.FC<ContainerTableProps> = ({
  containers,
  loading,
  onView,
  onEdit,
  onDelete,
}) => {
  // Mobile Card View
  const renderCard = (c: IContainer) => {
    const etdOverdue = isOverdue(c.etdDate, c.status);
    const etaOverdue = isOverdue(c.etaDate, c.status);

    return (
      <div
        key={c.cId}
        className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] shadow-sm flex flex-col gap-3"
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              <Box className="w-4 h-4 text-accent" /> {c.bookingNumber}
            </span>
            <span className="text-xs text-text-muted mt-1 flex items-center gap-1">
              <Scale className="w-3 h-3" /> {c.avgWeightInKgs ? `${c.avgWeightInKgs} kg/avg` : 'No weight req'}
            </span>
          </div>
          <ContainerStatusBadge status={c.status} />
        </div>

        <div className="grid grid-cols-2 gap-2 p-2 bg-bg-base rounded-lg mt-1 border border-border/50">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted uppercase font-semibold">ETD</span>
            <span className={`text-xs font-medium ${(etdOverdue) ? 'text-danger font-bold' : 'text-text-primary'}`}>
              {c.etdDate ? format(new Date(c.etdDate), 'MMM dd, yyyy') : 'N/A'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted uppercase font-semibold">ETA</span>
            <span className={`text-xs font-medium ${(etaOverdue) ? 'text-danger font-bold' : 'text-text-primary'}`}>
              {c.etaDate ? format(new Date(c.etaDate), 'MMM dd, yyyy') : 'N/A'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
          <span className="text-xs text-text-secondary">
            Count: <b className="text-text-primary">{c.containerCount || 0}</b>
          </span>
          <div className="flex gap-2">
            <button onClick={() => onView(c)} className="p-1.5 text-info hover:bg-info/10 rounded transition-colors">
              <Eye className="w-4 h-4" />
            </button>
            <button onClick={() => onEdit(c)} className="p-1.5 text-text-secondary hover:bg-bg-base rounded transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(c)} className="p-1.5 text-danger hover:bg-danger/10 rounded transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile view (< sm) */}
      <div className="flex flex-col gap-3 sm:hidden">
        {loading ? (
          <SkeletonLoader variant="card" count={3} />
        ) : containers.length === 0 ? (
          <div className="text-center py-10 text-[#9A9A9A] dark:text-[#666666] bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E]">
            No containers found
          </div>
        ) : (
          containers.map(renderCard)
        )}
      </div>

      {/* Desktop view (>= sm) */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] bg-white dark:bg-[#1A1A1A] shadow-sm">
        <table className="min-w-full divide-y divide-[#F0EDD0] dark:divide-[#222222]">
          <thead className="bg-[#F5F0D0] dark:bg-[#252525]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Booking #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Count
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                ETD
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                ETA
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EDD0] dark:divide-[#222222] bg-white dark:bg-[#1A1A1A]">
            {loading ? (
              <tr><td colSpan={6}><SkeletonLoader variant="table" count={5} /></td></tr>
            ) : containers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-text-muted">
                  No containers found
                </td>
              </tr>
            ) : (
              containers.map((c) => {
                const etdOverdue = isOverdue(c.etdDate, c.status);
                const etaOverdue = isOverdue(c.etaDate, c.status);
                
                return (
                  <tr key={c.cId} className="hover:bg-[#FDFBD4] dark:hover:bg-[#252525] even:bg-[#FEFDF0] dark:even:bg-[#1A1A1A] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                        <span className="text-sm font-medium text-text-primary">
                          {c.bookingNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-text-secondary">
                        {c.containerCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm flex items-center gap-1.5 ${etdOverdue ? 'text-danger font-semibold' : 'text-text-secondary'}`}>
                        {etdOverdue && <CalendarClock className="w-3.5 h-3.5" />}
                        {c.etdDate ? format(new Date(c.etdDate), 'MMM dd, yyyy') : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm flex items-center gap-1.5 ${etaOverdue ? 'text-danger font-semibold' : 'text-text-secondary'}`}>
                        {etaOverdue && <CalendarClock className="w-3.5 h-3.5" />}
                        {c.etaDate ? format(new Date(c.etaDate), 'MMM dd, yyyy') : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ContainerStatusBadge status={c.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onView(c)}
                          className="text-info hover:text-accent p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(c)}
                          className="text-text-secondary hover:text-text-primary p-1"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(c)}
                          className="text-danger hover:text-red-700 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};


export default ContainerTable;
