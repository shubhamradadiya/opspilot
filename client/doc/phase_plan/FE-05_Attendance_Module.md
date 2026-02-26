<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║                    MANAGEMENT SYSTEM · FRONTEND PHASES                     ║
║                         http://localhost:3001                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->

<div align="center">

```
███████╗███████╗      ██████╗ ███████╗
██╔════╝██╔════╝     ██╔═══██╗██╔════╝
█████╗  █████╗  █████╗██║   ██║███████╗
██╔══╝  ██╔══╝  ╚════╝██║   ██║╚════██║
██║     ███████╗      ╚██████╔╝███████║
╚═╝     ╚══════╝       ╚═════╝╚══════╝
```

# 🕐 Attendance Module

**Phase** `FE-05` &nbsp;·&nbsp; **Priority** `🟠 HIGH` &nbsp;·&nbsp; **Status** `⬜ TODO`

---

*Backend:* `http://localhost:3001` &nbsp;|&nbsp; *Depends On:* [`FE-02`](./FE-02_Auth_Integration_App_Shell.md) &nbsp;|&nbsp; *Enables:* `FE-06`

</div>

---

## ◈ Overview

Attendance tracking for the entire workforce. Employees get a prominent Clock In / Clock Out button on their attendance page. Admins see all employees' logs, a day/week timestamp grid, and can add or delete manual log entries. Duration (hours worked) is auto-calculated from check-in and check-out timestamps.

---

## ◈ Scope

```
✅ IN SCOPE                              ❌ OUT OF SCOPE
────────────────────────────────────     ─────────────────────────────────
 Clock-in / clock-out button UI           Payroll calculation (FE-06)
 Real-time clock status from API          Overtime rules
 Personal attendance log (own logs)       Biometric integration
 Admin: all-employee logs view
 Admin: timestamps by day / week
 Admin: add manual log entry
 Admin: delete user logs
 Duration calculation (checkedIn→Out)
 Today's summary snapshot
```

---

## ◈ API Endpoints

| Method | Endpoint | Used In | Auth? |
|:------:|----------|---------|:-----:|
| `POST` | `/api/v1/attendance/check-status` | `ClockButton.tsx` on mount | 🔒 Bearer |
| `POST` | `/api/v1/attendance/clock-in-clock-out` | `ClockButton.tsx` on click | 🔒 Bearer |
| `GET` | `/api/v1/attendance/logs` | `AttendanceLogs.tsx` (own logs) | 🔒 Bearer |
| `GET` | `/api/v1/attendance/logs/today` | Admin: today's all-user snapshot | 🔒 Admin |
| `GET` | `/api/v1/attendance/timestamps` | Admin: `AttendanceTimestamps.tsx` | 🔒 Admin |
| `POST` | `/api/v1/attendance/log` | `ManualLogModal.tsx` | 🔒 Admin |
| `DELETE` | `/api/v1/attendance/logs` | Admin delete logs | 🔒 Admin |

---

## ◈ Files to Create

| File | Type | Description |
|------|------|-------------|
| `src/pages/attendance/AttendanceDashboard.tsx` | Page | Clock button + personal summary |
| `src/pages/attendance/AttendanceLogs.tsx` | Page | Log table — own (user) or all (admin) |
| `src/pages/attendance/AttendanceTimestamps.tsx` | Page | Admin: grid view by day/week |
| `src/components/attendance/ClockButton.tsx` | UI | Large toggle, shows status, elapsed time |
| `src/components/attendance/AttendanceLogTable.tsx` | UI | Table with date, in, out, duration |
| `src/components/attendance/ManualLogModal.tsx` | UI | Admin: add manual log form |
| `src/components/attendance/DurationBadge.tsx` | UI | Formatted HH:mm duration badge |
| `src/components/attendance/TimestampGrid.tsx` | UI | Weekly grid with hours per day |
| `src/api/attendance.api.ts` | API | All attendance HTTP calls |
| `src/store/attendance/attendance.slice.ts` | Slice | Clock status, logs, timestamps |
| `src/store/attendance/attendance.thunk.ts` | Thunk | All async operations |
| `src/store/attendance/attendance.types.ts` | Types | `IUserLog`, `IAttendanceStatus`, `ITimestamp` |

---

## ◈ Clock Button States

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   STATE: CLOCKED OUT             STATE: CLOCKED IN   │
│   ┌─────────────────┐           ┌─────────────────┐  │
│   │                 │           │   ● LIVE        │  │
│   │   CLOCK IN      │           │   02:34:17      │  │
│   │   ▶ Start Day   │           │   CLOCK OUT     │  │
│   │                 │           │   ■ End Day     │  │
│   └─────────────────┘           └─────────────────┘  │
│   bg: blue-600                  bg: red-600           │
│   dark: blue-500                dark: red-500         │
│                                                      │
│   LOADING STATE: Spinner replaces icon while POST    │
└──────────────────────────────────────────────────────┘
```

---

## ◈ Timestamps Grid (Admin)

```
Week of Feb 17 – Feb 23, 2026

Employee     │ Mon  │ Tue  │ Wed  │ Thu  │ Fri  │ Total
─────────────┼──────┼──────┼──────┼──────┼──────┼───────
John Doe     │ 8.0h │ 7.5h │  —   │ 8.5h │ 8.0h │ 32.0h
Jane Smith   │ 7.0h │ 8.0h │ 8.0h │ 7.5h │  —   │ 30.5h
Ali Hassan   │  —   │  —   │ 8.0h │ 8.0h │ 8.0h │ 24.0h
```

Color coding:
- `≥ 8h` → `text-green-600 dark:text-green-400`
- `4h–8h` → `text-yellow-600 dark:text-yellow-400`
- `< 4h` → `text-red-600 dark:text-red-400`
- `—` (absent) → `text-slate-400`

---

## ◈ Duration Calculation

```typescript
// src/utils/formatters.ts
export const calcDuration = (
  checkedIn: string,
  checkedOut: string | null
): string => {
  if (!checkedOut) return 'In Progress';
  const ms = new Date(checkedOut).getTime() - new Date(checkedIn).getTime();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m.toString().padStart(2, '0')}m`;
};
```

---

## ◈ Acceptance Criteria

- [ ] Clock button accurately reflects current state from `check-status` API on page load
- [ ] Clicking clock-in / clock-out shows spinner, then updates button state + shows toast
- [ ] Live elapsed timer counts up while user is clocked in (via `setInterval`)
- [ ] Employee log table shows checkedIn, checkedOut, and calculated duration
- [ ] Admin can switch between employees using a dropdown on the logs page
- [ ] Timestamps grid shows correct hours per day per employee for selected week
- [ ] Manual log modal accepts employee, date, clock-in time, and optional clock-out
- [ ] Module hidden for users where `isClockInClockOutEnabled === false`

---

<div align="center">

[`FE-04`](./FE-04_Employee_Management.md) &nbsp;→&nbsp; `FE-05` &nbsp;→&nbsp; [`FE-06`](./FE-06_Payout_Module.md)

*Management System · Frontend Phase Plans*

</div>
