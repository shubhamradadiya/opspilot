// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import {
  LineChart,
  Line,
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
interface ExpenseChartProps {
  data?: { month: string; amount: number }[];
  loading?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const CHART_TOKENS = {
  light: {
    line: '#2D7A4F',
    grid: '#E8E0B8',
    text: '#9A9A9A',
    tooltip: '#FFFFFF',
    tooltipBorder: '#E8E0B8',
    dot: '#D4AF37',
  },
  dark: {
    line: '#4CAF80',
    grid: '#2E2E2E',
    text: '#AAAAAA',
    tooltip: '#1E1E1E',
    tooltipBorder: '#2E2E2E',
    dot: '#D4AF37',
  },
};

const DEMO_DATA = [
  { month: 'Jan', amount: 1200 },
  { month: 'Feb', amount: 1800 },
  { month: 'Mar', amount: 1400 },
  { month: 'Apr', amount: 2200 },
  { month: 'May', amount: 1600 },
  { month: 'Jun', amount: 2400 },
];

// ============================================================================
// SKELETON
// ============================================================================
const ChartSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] p-5 animate-pulse">
    <div className="h-4 w-40 bg-[#E8E0B8] dark:bg-[#2E2E2E] rounded mb-4" />
    <div className="h-[250px] bg-[#F5F0D0] dark:bg-[#252525] rounded" />
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const ExpenseChart: React.FC<ExpenseChartProps> = ({
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
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] p-5">
      <h3 className="text-sm font-semibold text-[#2A2A2A] dark:text-[#F5F5F5] mb-4">
        📉 Monthly Expenses
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={tokens.grid} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: tokens.text, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: tokens.text, fontSize: 12 }}
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
            formatter={(value: number | string | undefined) => {
              const num = typeof value === 'number' ? value : 0;
              return [`$${num.toLocaleString()}`, 'Amount'];
            }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke={tokens.line}
            strokeWidth={2}
            dot={{ fill: tokens.dot, r: 4, strokeWidth: 0 }}
            activeDot={{ fill: tokens.dot, r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
