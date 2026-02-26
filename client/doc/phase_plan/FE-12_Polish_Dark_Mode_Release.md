<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║                    MANAGEMENT SYSTEM · FRONTEND PHASES                     ║
║                         http://localhost:3001                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->

<div align="center">

```
███████╗███████╗     ██╗██████╗
██╔════╝██╔════╝    ███║╚════██╗
█████╗  █████╗  █████╗██║  ▄███╔╝
██╔══╝  ██╔══╝  ╚════╝██║  ▀▀══╝
██║     ███████╗      ██║  ██╗
╚═╝     ╚══════╝      ╚═╝  ╚═╝
```

# 🏁 Polish, Dark Mode & Release Readiness

**Phase** `FE-12` &nbsp;·&nbsp; **Priority** `🟠 HIGH` &nbsp;·&nbsp; **Status** `⬜ TODO`

---

*Backend:* `http://localhost:3001` &nbsp;|&nbsp; *Depends On:* `FE-01 → FE-11 (All phases)` &nbsp;|&nbsp; *Enables:* `🚀 Production Release`

</div>

---

## ◈ Overview

Final hardening phase. Ensure 100% dark/light mode coverage across every component and page, implement skeleton loaders for all async states, add error boundaries, optimize bundle via code-splitting, create shared common components used throughout the app, and validate accessibility compliance. Nothing new is built here — everything already built gets polished.

---

## ◈ Scope

```
✅ IN SCOPE                              ❌ OUT OF SCOPE
────────────────────────────────────     ─────────────────────────────────
 Full dark mode audit + fixes             New features
 Skeleton loaders for all async UI        Backend changes
 Error boundaries on every page           New API integrations
 Common UI component library
 Global toast notification system
 Confirm modal (generic, reusable)
 Page header component (title + CTA)
 Generic DataTable component
 Pagination component
 Empty state components
 Currency / date formatter utilities
 Zod schema library (shared validators)
 Bundle analysis + code splitting
 React.lazy + Suspense for all pages
 Accessibility audit (WCAG 2.1 AA)
 Cross-browser testing
 npm run build zero-error verification
```

---

## ◈ Common Components to Build

| File | Props | Description |
|------|-------|-------------|
| `src/components/common/SkeletonLoader.tsx` | `variant: 'table' \| 'card' \| 'form'` | Loading placeholder shapes |
| `src/components/common/ErrorBoundary.tsx` | `fallback?` | React error boundary with retry UI |
| `src/components/common/EmptyState.tsx` | `title, description, action?` | No-data placeholder with CTA |
| `src/components/common/PageHeader.tsx` | `title, breadcrumbs, action?` | Consistent page header |
| `src/components/common/ConfirmModal.tsx` | `title, message, onConfirm` | Generic confirm dialog |
| `src/components/common/DataTable.tsx` | `columns, data, sortable` | Generic sortable table |
| `src/components/common/Pagination.tsx` | `page, total, onChange` | Page nav with per-page selector |
| `src/components/common/StatusBadge.tsx` | `status, colorMap` | Generic colored status badge |
| `src/components/common/Avatar.tsx` | `src, name, size` | User avatar with initials fallback |
| `src/components/common/CopyButton.tsx` | `value` | Copy-to-clipboard with feedback |

---

## ◈ Dark Mode Complete Audit

Every component must use **Tailwind's `dark:` prefix** — no hardcoded colors. Full token map:

| Token Purpose | Light Class | Dark Class |
|---------------|-------------|------------|
| Page background | `bg-slate-50` | `dark:bg-slate-900` |
| Card / surface | `bg-white` | `dark:bg-slate-800` |
| Elevated (modal, dropdown) | `bg-white shadow-md` | `dark:bg-slate-700 dark:shadow-slate-900` |
| Primary text | `text-slate-900` | `dark:text-slate-50` |
| Secondary text | `text-slate-500` | `dark:text-slate-400` |
| Muted text | `text-slate-400` | `dark:text-slate-500` |
| Dividers / borders | `border-slate-200` | `dark:border-slate-700` |
| Input background | `bg-white border-slate-300` | `dark:bg-slate-700 dark:border-slate-600` |
| Input focus ring | `ring-blue-600` | `dark:ring-blue-400` |
| Table header | `bg-slate-100 text-slate-600` | `dark:bg-slate-700 dark:text-slate-300` |
| Table row alt | `even:bg-slate-50` | `dark:even:bg-slate-800/50` |
| Table row hover | `hover:bg-slate-100` | `dark:hover:bg-slate-700/50` |
| Sidebar background | `bg-white` | `dark:bg-slate-900` |
| Sidebar active | `bg-blue-50 text-blue-700` | `dark:bg-blue-900/20 dark:text-blue-400` |
| Topbar | `bg-white border-b-slate-200` | `dark:bg-slate-800 dark:border-b-slate-700` |
| Badge (success) | `bg-green-100 text-green-700` | `dark:bg-green-900/30 dark:text-green-400` |
| Badge (danger) | `bg-red-100 text-red-700` | `dark:bg-red-900/30 dark:text-red-400` |
| Badge (warning) | `bg-yellow-100 text-yellow-700` | `dark:bg-yellow-900/30 dark:text-yellow-400` |
| Badge (info) | `bg-blue-100 text-blue-700` | `dark:bg-blue-900/30 dark:text-blue-400` |
| Toast background | `bg-white border-slate-200` | `dark:bg-slate-800 dark:border-slate-600` |

---

## ◈ Bundle Optimization

```typescript
// src/App.tsx — Every page must be lazy-loaded
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));
const EmployeeList   = lazy(() => import('./pages/employees/EmployeeList'));
const AttendanceDashboard = lazy(() => import('./pages/attendance/AttendanceDashboard'));
// ... all pages

// Wrap routes in Suspense
<Suspense fallback={<PageSkeleton />}>
  <Routes>...</Routes>
</Suspense>
```

Target bundle sizes:
- `index.html` entry chunk: `< 50KB` gzip
- Largest lazy chunk: `< 200KB` gzip
- Total app bundle: `< 1MB` gzip

---

## ◈ Accessibility Checklist

```
Keyboard Navigation
  [ ] Tab order logical on all forms and modals
  [ ] Modal traps focus correctly (focus-trap-react)
  [ ] Dropdown closes on Escape key
  [ ] All interactive elements reachable via Tab

Screen Reader
  [ ] aria-label on icon-only buttons
  [ ] aria-live="polite" on loading states
  [ ] aria-describedby linking errors to inputs
  [ ] role="alert" on error toasts
  [ ] Table headers use <th scope="col">

Color Contrast
  [ ] All text ≥ 4.5:1 contrast ratio (light mode)
  [ ] All text ≥ 4.5:1 contrast ratio (dark mode)
  [ ] Focus indicators visible in both themes
  [ ] Status badges readable without color alone (icons/text)
```

---

## ◈ Utility Functions to Finalize

```typescript
// src/utils/formatters.ts

// Currency — respects user.priceUnit
export const formatCurrency = (amount: number, unit: '$' | '€' | '£') =>
  `${unit}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

// Date display
export const formatDate = (iso: string) =>
  format(new Date(iso), 'MMM dd, yyyy');       // "Feb 17, 2026"

export const formatDateTime = (iso: string) =>
  format(new Date(iso), 'MMM dd, yyyy HH:mm'); // "Feb 17, 2026 09:30"

// Duration from timestamps
export const calcDuration = (checkedIn: string, checkedOut: string | null) => {
  if (!checkedOut) return '—';
  const ms = new Date(checkedOut).getTime() - new Date(checkedIn).getTime();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${String(m).padStart(2, '0')}m`;
};

// Truncate long strings
export const truncate = (str: string, len = 40) =>
  str.length > len ? `${str.slice(0, len)}…` : str;
```

---

## ◈ Final Release Checklist

```
Build & Quality
  [ ] npm run build — zero TypeScript errors
  [ ] npm run lint — zero ESLint warnings or errors
  [ ] All console.log statements removed
  [ ] No unused imports or variables
  [ ] Bundle analyzed, no unexpectedly large chunks

Functional
  [ ] All 12 phases tested end-to-end
  [ ] All feature flags respected (modules hidden/shown)
  [ ] All role restrictions verified (admin vs user)
  [ ] All forms validate and submit correctly
  [ ] All delete actions require confirmation
  [ ] PDF downloads work (payout receipt, invoice)

UI/UX
  [ ] Dark mode applied consistently — zero hardcoded colors
  [ ] Skeleton loaders shown on every data-loading page
  [ ] Empty states shown when no data exists
  [ ] Error states shown with retry when API fails
  [ ] Toast notifications for all create/update/delete actions
  [ ] All pages responsive (mobile, tablet, desktop)

Performance
  [ ] All pages lazy-loaded via React.lazy
  [ ] No unnecessary re-renders (memo/useMemo where needed)
  [ ] Initial page load < 3s on standard connection
  [ ] Axios requests de-duplicated (no double-fetch on mount)

Accessibility
  [ ] Keyboard navigation works on all forms and modals
  [ ] Screen reader labels on icon-only buttons
  [ ] Focus indicators visible in both themes
  [ ] Color contrast passes WCAG 2.1 AA
```

---

<div align="center">

[`FE-11`](./FE-11_Container_Module.md) &nbsp;→&nbsp; `FE-12` &nbsp;→&nbsp; **🚀 Production**

*Management System · Frontend Phase Plans*

</div>
