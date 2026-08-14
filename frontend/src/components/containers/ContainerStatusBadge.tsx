import React from 'react';
import { ContainerStatus } from '@/store/containers/containers.types';

interface ContainerStatusBadgeProps {
  status: ContainerStatus | string | null;
}

const getStatusConfig = (status: string | null) => {
  if (!status) return { label: 'Unknown', className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' };

  switch (status.toLowerCase()) {
    case ContainerStatus.LOADING:
      return {
        label: 'Loading',
        className: 'bg-[#FDFBD4] text-[#D4AF37] border border-[#F5F0D0] dark:bg-[rgba(212,175,55,0.1)] dark:border-[#D4AF37]/30 dark:text-[#D4AF37]',
      };
    case ContainerStatus.VGM:
      return {
        label: 'VGM Verified',
        className: 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-500/30 dark:text-indigo-400',
      };
    case ContainerStatus.SHIPPED:
      return {
        label: 'Shipped',
        className: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-500/30 dark:text-blue-400',
      };
    case ContainerStatus.COMPLETED:
      return {
        label: 'Arrived',
        className: 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:border-green-500/30 dark:text-green-400',
      };
    default:
      return {
        label: status.charAt(0).toUpperCase() + status.slice(1),
        className: 'bg-gray-100 text-gray-800 dark:bg-[#333333] dark:text-[#F5F5F5]',
      };
  }
};

const ContainerStatusBadge: React.FC<ContainerStatusBadgeProps> = ({ status }) => {
  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default ContainerStatusBadge;
