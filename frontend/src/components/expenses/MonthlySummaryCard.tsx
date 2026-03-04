// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import { DollarSign } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface MonthlySummaryCardProps {
  totalExpense: number;
  loading?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const MonthlySummaryCard: React.FC<MonthlySummaryCardProps> = ({ totalExpense, loading }) => {
  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white dark:bg-[#1E1E1E] border border-[#2A2A2A] dark:border-[#2E2E2E] rounded-xl p-6 shadow-sm flex items-center gap-4">
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-[#F0DFA0] dark:bg-[#2A2200] flex items-center justify-center flex-shrink-0">
        <DollarSign className="w-5 h-5 text-[#D4AF37]" />
      </div>

      {/* Content */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#9A9A9A] dark:text-[#666666]">
          Total This Month
        </p>
        {loading ? (
          <div className="mt-1 h-7 w-24 rounded bg-[#F5F0D0] dark:bg-[#252525] animate-pulse" />
        ) : (
          <p className="text-2xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5] mt-0.5">
            ${Number(totalExpense || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        )}
      </div>
    </div>
  );
};

export default MonthlySummaryCard;
