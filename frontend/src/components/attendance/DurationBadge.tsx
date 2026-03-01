// ============================================================================
// DURATION BADGE COMPONENT
// OpsPilot · FE-05
// Displays a formatted attendance duration with color-coded visual states.
// ============================================================================
import React from 'react';
import { Clock } from 'lucide-react';
import { calcDuration } from '@/utils/formatters';

// ============================================================================
// TYPES
// ============================================================================
interface DurationBadgeProps {
  checkedIn: string;
  checkedOut: string | null;
  /** Compact mode hides icon */
  compact?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================
const DurationBadge: React.FC<DurationBadgeProps> = ({
  checkedIn,
  checkedOut,
  compact = false,
}) => {
  const duration = calcDuration(checkedIn, checkedOut);
  const isInProgress = !checkedOut;

  // Color mapping
  const colorClass = isInProgress
    ? 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30'  // gold — active
    : 'text-[#2ECC71] bg-[#2ECC71]/10 border-[#2ECC71]/30'; // green — completed

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass} transition-colors`}
    >
      {!compact && (
        <Clock
          size={11}
          className={isInProgress ? 'animate-pulse' : ''}
        />
      )}
      {duration}
    </span>
  );
};

export default DurationBadge;
