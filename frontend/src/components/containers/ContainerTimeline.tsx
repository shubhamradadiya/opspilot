import React from 'react';
import { ContainerStatus } from '@/store/containers/containers.types';
import { Check } from 'lucide-react';

interface ContainerTimelineProps {
  status: ContainerStatus | string | null;
}

const STEPS = [
  { key: 'loading', label: 'Loading', statuses: [ContainerStatus.LOADING, ContainerStatus.VGM] },
  { key: 'shipped', label: 'Shipped', statuses: [ContainerStatus.SHIPPED] },
  { key: 'arrived', label: 'Arrived', statuses: [ContainerStatus.COMPLETED] },
];

const ContainerTimeline: React.FC<ContainerTimelineProps> = ({ status }) => {
  const currentStatusString = status?.toLowerCase() || '';

  // Calculate current active step index (0 = loading, 1 = shipped, 2 = arrived)
  let currentStepIndex = 0;
  if (STEPS[1].statuses.includes(currentStatusString as ContainerStatus)) {
    currentStepIndex = 1;
  } else if (STEPS[2].statuses.includes(currentStatusString as ContainerStatus)) {
    currentStepIndex = 2;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative mt-2 mb-6 mx-4">
        {/* Background track */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-[#E5E5E5] dark:bg-[#333333] -translate-y-1/2 z-0 rounded" />

        {/* Active track filling up */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-[#D4AF37] -translate-y-1/2 z-0 rounded transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
        />

        {/* Nodes */}
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isCompleted
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-white dark:text-[#121212]'
                    : isCurrent
                    ? 'bg-white dark:bg-[#1E1E1E] border-[#D4AF37] text-[#D4AF37]'
                    : 'bg-white dark:bg-[#1E1E1E] border-[#E5E5E5] dark:border-[#333333] text-[#9A9A9A]'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
              </div>
              <span
                className={`absolute top-10 whitespace-nowrap text-xs font-medium transition-colors ${
                  isCurrent || isCompleted
                    ? 'text-[#2A2A2A] dark:text-[#F5F5F5]'
                    : 'text-[#9A9A9A] dark:text-[#666666]'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContainerTimeline;
