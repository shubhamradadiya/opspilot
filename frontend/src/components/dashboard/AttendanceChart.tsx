// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@/hooks/useTheme';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface AttendanceChartProps {
  data?: { day: string; present: number; absent: number }[];
  loading?: boolean;
}

// ============================================================================
// CONSTANTS — Chart token map per BRAND_DESIGN_GUIDELINES.md §Dark Mode
// ============================================================================
const CHART_TOKENS = {
  light: {
    bar: '#D4AF37',
    barSecondary: '#E8E0B8',
    grid: '#E8E0B8',
    text: '#9A9A9A',
    tooltip: '#FFFFFF',
    tooltipBorder: '#E8E0B8',
  },
  dark: {
    bar: '#D4AF37',
    barSecondary: '#2E2E2E',
    grid: '#2E2E2E',
    text: '#AAAAAA',
    tooltip: '#1E1E1E',
    tooltipBorder: '#2E2E2E',
  },
};

// ── Demo data (used when no real data is available) ───────────────────────
const DEMO_DATA = [
  { day: 'Mon', present: 8, absent: 2 },
  { day: 'Tue', present: 9, absent: 1 },
  { day: 'Wed', present: 7, absent: 3 },
  { day: 'Thu', present: 10, absent: 0 },
  { day: 'Fri', present: 6, absent: 4 },
  { day: 'Sat', present: 4, absent: 6 },
  { day: 'Sun', present: 0, absent: 0 },
];

// ============================================================================
// SKELETON
// ============================================================================
const ChartSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] p-5 animate-pulse flex flex-col flex-1">
    <div className="h-4 w-40 bg-[#E8E0B8] dark:bg-[#2E2E2E] rounded mb-4" />
    <div className="flex-1 min-h-[300px] bg-[#F5F0D0] dark:bg-[#252525] rounded" />
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const AttendanceChart: React.FC<AttendanceChartProps> = ({
  data,
  loading = false,
}) => {
  // ── HOOKS ──────────────────────────────────────────────────────────────────
  const { theme } = useTheme();
  const tokens = theme === 'dark' ? CHART_TOKENS.dark : CHART_TOKENS.light;
  const chartData = data ?? DEMO_DATA;

  // ── RENDER ─────────────────────────────────────────────────────────────────
  if (loading) return <ChartSkeleton />;

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] p-3 sm:p-5 flex flex-col flex-1">
      <h3 className="text-sm font-semibold text-[#2A2A2A] dark:text-[#F5F5F5] mb-3">
        📊 Weekly Attendance
      </h3>
      <div className="flex-1 min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          barCategoryGap="20%"
          margin={{ top: 4, right: 4, bottom: 0, left: -8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={tokens.grid} vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: tokens.text, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            width={32}
            tickCount={5}
            tick={{ fill: tokens.text, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tokens.tooltip,
              border: `1px solid ${tokens.tooltipBorder}`,
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="present" fill={tokens.bar} radius={[4, 4, 0, 0]} name="Present" />
          <Bar dataKey="absent" fill={tokens.barSecondary} radius={[4, 4, 0, 0]} name="Absent" />
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;
