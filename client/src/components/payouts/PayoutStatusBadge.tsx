// ============================================================================
// PAYOUT STATUS BADGE COMPONENT
// OpsPilot · FE-06
// Paid / Unpaid colored status pill badge.
// ============================================================================
import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================
interface PayoutStatusBadgeProps {
  isPaid: boolean;
  compact?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================
const PayoutStatusBadge: React.FC<PayoutStatusBadgeProps> = ({ isPaid, compact = false }) => {
  const colorClass = isPaid
    ? 'text-[#2ECC71] bg-[#2ECC71]/10 border-[#2ECC71]/30'
    : 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass}`}
    >
      {!compact && (isPaid ? <CheckCircle2 size={11} /> : <Clock size={11} />)}
      {isPaid ? 'Paid' : 'Unpaid'}
    </span>
  );
};

export default PayoutStatusBadge;
