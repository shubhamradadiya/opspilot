// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import { Package } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface InventorySummaryProps {
  data?: {
    carTires: number;
    truckTires: number;
    mixedTires: number;
    bales: number;
  };
  loading?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const CATEGORIES = [
  { key: 'carTires' as const, label: 'Car Tires', emoji: '🚗' },
  { key: 'truckTires' as const, label: 'Truck Tires', emoji: '🚛' },
  { key: 'mixedTires' as const, label: 'Mixed Tires', emoji: '🔄' },
  { key: 'bales' as const, label: 'Bales', emoji: '📦' },
];

// ============================================================================
// SKELETON
// ============================================================================
const InventorySkeleton: React.FC = () => (
  <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] p-5 animate-pulse">
    <div className="h-4 w-36 bg-[#E8E0B8] dark:bg-[#2E2E2E] rounded mb-4" />
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-16 bg-[#F5F0D0] dark:bg-[#252525] rounded-lg" />
      ))}
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const InventorySummary: React.FC<InventorySummaryProps> = ({
  data,
  loading = false,
}) => {
  // ── RENDER ─────────────────────────────────────────────────────────────────
  if (loading) return <InventorySkeleton />;

  const totals = data ?? { carTires: 0, truckTires: 0, mixedTires: 0, bales: 0 };

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Package size={16} className="text-[#D4AF37]" />
        <h3 className="text-sm font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
          Inventory Summary
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.key}
            className="flex items-center gap-3 p-3 rounded-lg bg-[#F5F0D0]/50 dark:bg-[#252525] border border-[#E8E0B8]/50 dark:border-[#2E2E2E]"
          >
            <span className="text-lg">{cat.emoji}</span>
            <div>
              <p className="text-lg font-bold text-[#2A2A2A] dark:text-[#F5F5F5]">
                {totals[cat.key].toLocaleString()}
              </p>
              <p className="text-xs text-[#9A9A9A] dark:text-[#666666]">{cat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventorySummary;
