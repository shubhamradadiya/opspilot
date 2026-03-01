<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║                    MANAGEMENT SYSTEM · FRONTEND PHASES                     ║
║                         http://localhost:3001                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->

<div align="center">

```
███████╗███████╗      ██████╗ ██████╗
██╔════╝██╔════╝     ██╔═══██╗╚════██╗
█████╗  █████╗  █████╗██║   ██║ ▄███╔╝
██╔══╝  ██╔══╝  ╚════╝██║   ██║▀▀══╝
██║     ███████╗      ╚██████╔╝███████╗
╚═╝     ╚══════╝       ╚═════╝╚══════╝
```

# 📊 Admin Dashboard

**Phase** `FE-03` &nbsp;·&nbsp; **Priority** `🟠 HIGH` &nbsp;·&nbsp; **Status** `⬜ TODO`

---

*Backend:* `http://localhost:3001` &nbsp;|&nbsp; *Depends On:* [`FE-02`](./FE-02_Auth_Integration_App_Shell.md) &nbsp;|&nbsp; *Enables:* `FE-04`

</div>

---

## ◈ Overview

Build the Admin Dashboard — the first screen admins see after login. Pulls real-time data from `GET /api/v1/admin/dashboard` and presents key business metrics: employee stats, today's attendance, inventory totals, expense summaries, and customer activity. Includes Recharts visualizations and quick-action shortcuts.

---

## ◈ Scope

```
✅ IN SCOPE                              ❌ OUT OF SCOPE
────────────────────────────────────     ─────────────────────────────────
 GET /api/v1/admin/dashboard call         Employee CRUD (FE-04)
 Stats cards (employees, attendance)      Attendance log details (FE-05)
 Recharts bar chart — daily attendance    Payout creation (FE-06)
 Recharts line chart — expenses trend
 Inventory stock summary widget
 Recent inventory activity log widget
 Today's attendance snapshot table
 Quick action buttons (shortcuts)
 Skeleton loaders during fetch
 Error state with retry
```

---

## ◈ API Endpoints

| Method | Endpoint | Used In | Auth? |
|:------:|----------|---------|:-----:|
| `GET` | `/api/v1/admin/dashboard` | `AdminDashboard.tsx` → `fetchDashboardThunk` | 🔒 Admin |

---

## ◈ Files to Create

| File | Type | Description |
|------|------|-------------|
| `src/pages/dashboard/AdminDashboard.tsx` | Page | Main layout — grid of widgets |
| `src/components/dashboard/StatsCard.tsx` | UI | Single metric: icon + value + label + trend |
| `src/components/dashboard/AttendanceChart.tsx` | Chart | Recharts `BarChart` — daily clock-ins by week |
| `src/components/dashboard/ExpenseChart.tsx` | Chart | Recharts `LineChart` — expense total by month |
| `src/components/dashboard/InventorySummary.tsx` | Widget | Car tires, truck tires, mixed, bales counts |
| `src/components/dashboard/TodayAttendance.tsx` | Widget | Table of who is clocked in today |
| `src/components/dashboard/RecentActivityLog.tsx` | Widget | Last 5 inventory activity log entries |
| `src/components/dashboard/QuickActions.tsx` | Widget | Shortcut buttons to key actions |
| `src/api/dashboard.api.ts` | API | `GET /api/v1/admin/dashboard` |
| `src/store/dashboard/dashboard.slice.ts` | Slice | Dashboard data state |
| `src/store/dashboard/dashboard.thunk.ts` | Thunk | `fetchDashboardThunk` |
| `src/store/dashboard/dashboard.types.ts` | Types | `IDashboardData`, `IStatsCard` |

---

## ◈ Dashboard Grid Layout

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  👥 Employees│ 🕐 Today     │ 📦 Inventory │ 💰 Expenses  │
│  Total: 12  │ Clocked: 8  │ Tires: 450  │ Month: $2.4k│
│  Active: 10 │ Absent: 2   │ Bales: 30   │ +12% ↑     │
└─────────────┴─────────────┴─────────────┴─────────────┘
┌───────────────────────────┬─────────────────────────────┐
│  📈 Weekly Attendance      │  📉 Monthly Expenses         │
│  [Recharts BarChart]       │  [Recharts LineChart]        │
│                           │                             │
└───────────────────────────┴─────────────────────────────┘
┌───────────────────────────┬─────────────────────────────┐
│  🕐 Today's Attendance     │  🔔 Recent Inventory Logs    │
│  [Mini table: name/time]   │  [Last 5 log entries]        │
└───────────────────────────┴─────────────────────────────┘
```

---

## ◈ Stats Card Variants

| Card | Icon | Value Source | Trend |
|------|------|-------------|-------|
| Total Employees | `Users` | `dashboard.totalEmployees` | Active vs Inactive |
| Today Clocked In | `Clock` | `dashboard.todayAttendance` | Absent count |
| Inventory Stock | `Package` | Sum of all tire + bale counts | vs last week |
| Monthly Expenses | `DollarSign` | `dashboard.monthlyExpenses` | vs last month % |

---

## ◈ Dark Mode — Chart Tokens

```typescript
// Chart colors adapt to theme
const chartColors = {
  bar: theme === 'dark' ? '#D4AF37' : '#D4AF37',
  line: theme === 'dark' ? '#22C55E' : '#16A34A',
  grid: theme === 'dark' ? '#2E2E2E' : '#E8E0B8',
  text: theme === 'dark' ? '#AAAAAA' : '#9A9A9A',
  tooltip: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
};
```

---

## ◈ Acceptance Criteria

- [ ] Dashboard is accessible only to users with `role === 'admin'`
- [ ] All 4 stats cards display correct values from API response
- [ ] Skeleton loaders shown for all widgets during initial data fetch
- [ ] Charts render correctly and adapt colors in dark mode
- [ ] Error state shows retry button if API call fails
- [ ] Today's attendance table lists employees with clock-in time
- [ ] Inventory summary card reflects latest inventory record counts
- [ ] Quick action buttons navigate to correct routes

---

<div align="center">

[`FE-02`](./FE-02_Auth_Integration_App_Shell.md) &nbsp;→&nbsp; `FE-03` &nbsp;→&nbsp; [`FE-04`](./FE-04_Employee_Management.md)

*OpsPilot · Frontend Phase Plans*

</div>
