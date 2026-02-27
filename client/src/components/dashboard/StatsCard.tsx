// ============================================================================
// IMPORTS
// ============================================================================
import React, { useMemo } from 'react';
import {
  Users,
  Clock,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: 'users' | 'clock' | 'package' | 'dollar';
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  loading?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const ICON_MAP = {
  users: Users,
  clock: Clock,
  package: Package,
  dollar: DollarSign,
};

const TREND_COLORS = {
  up: 'text-[#2D7A4F] dark:text-[#4CAF80]',
  down: 'text-[#C0392B] dark:text-[#E05A4A]',
  neutral: 'text-[#9A9A9A] dark:text-[#666666]',
};

const TREND_ICONS = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

// ============================================================================
// SKELETON
// ============================================================================
const StatsCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E8E0B8] dark:border-[#2E2E2E] p-5 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 w-24 bg-[#E8E0B8] dark:bg-[#2E2E2E] rounded" />
      <div className="h-10 w-10 bg-[#E8E0B8] dark:bg-[#2E2E2E] rounded-lg" />
    </div>
    <div className="h-8 w-16 bg-[#E8E0B8] dark:bg-[#2E2E2E] rounded mb-2" />
    <div className="h-3 w-32 bg-[#E8E0B8] dark:bg-[#2E2E2E] rounded" />
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  loading = false,
}) => {
  // ── COMPUTED VALUES ────────────────────────────────────────────────────────
  const IconComponent = useMemo(() => ICON_MAP[icon], [icon]);

  // ── RENDER ─────────────────────────────────────────────────────────────────
  if (loading) return <StatsCardSkeleton />;

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E8E0B8] dark:border-[#2E2E2E] p-5 transition-all duration-150 hover:shadow-md hover:shadow-[#E8E0B8]/40 dark:hover:shadow-black/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA]">
          {title}
        </span>
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0DFA0] dark:bg-[rgba(212,175,55,0.15)]">
          <IconComponent size={20} className="text-[#D4AF37]" />
        </div>
      </div>

      {/* Value */}
      <p className="text-2xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5] tracking-tight">
        {value}
      </p>

      {/* Subtitle + Trend */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-[#9A9A9A] dark:text-[#666666]">
          {subtitle}
        </span>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${TREND_COLORS[trend.direction]}`}>
            {React.createElement(TREND_ICONS[trend.direction], { size: 12 })}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
