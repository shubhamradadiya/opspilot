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
█████╗  █████╗  █████╗██║   ██║ █████╔╝
██╔══╝  ██╔══╝  ╚════╝██║   ██║██╔═══╝
██║     ███████╗      ╚██████╔╝███████╗
╚═╝     ╚══════╝       ╚═════╝ ╚══════╝
```

# 🏛 Auth Integration & App Shell

**Phase** `FE-02` &nbsp;·&nbsp; **Priority** `🔴 CRITICAL` &nbsp;·&nbsp; **Status** `⬜ TODO`

---

*Backend:* `http://localhost:3001` &nbsp;|&nbsp; *Depends On:* [`FE-01`](./FE-01_Project_Setup_Auth_UI.md) &nbsp;|&nbsp; *Enables:* `FE-03 through FE-11`

</div>

---

## ◈ Overview

Wire up the authentication lifecycle (session restore on refresh, logout, token management) and build the full application shell that wraps every authenticated page. This shell includes a collapsible Sidebar with role-aware navigation, a Topbar with user info and theme toggle, and route guards for admin-only and auth-only routes.

---

## ◈ Scope

```
✅ IN SCOPE                              ❌ OUT OF SCOPE
────────────────────────────────────     ─────────────────────────────────
 Session restore (getMeThunk on mount)   Any feature module pages
 Logout flow (clear tokens + redirect)   Dashboard charts/data (FE-03)
 App layout shell (Sidebar + Topbar)     Profile edit page (future)
 Collapsible sidebar with nav links
 Role-aware sidebar (admin vs user)
 Feature-flag-aware sidebar items
 AdminRoute guard component
 AuthRoute guard component
 GuestRoute guard component
 404 Not Found page
 Breadcrumb navigation
 Change password page integration
```

---

## ◈ API Endpoints

| Method | Endpoint | Used In | Auth? |
|:------:|----------|---------|:-----:|
| `GET` | `/api/v1/user` | `App.tsx` mount → `getMeThunk` | 🔒 Bearer |
| `POST` | `/api/v1/auth/logout` | `Topbar` → `logoutThunk` | 🔒 Bearer |

---

## ◈ Files to Create

### 🏗 Layout Components

| File | Description |
|------|-------------|
| `src/components/layout/AppLayout.tsx` | Root shell: `<Sidebar> + <Topbar> + <Outlet>` |
| `src/components/layout/Sidebar.tsx` | Collapsible nav, role-aware links, feature flags |
| `src/components/layout/Topbar.tsx` | User avatar, name, theme toggle, logout button |
| `src/components/layout/Breadcrumb.tsx` | Auto breadcrumb from current route |

### 🔒 Route Guards

| File | Behavior |
|------|----------|
| `src/components/guards/AuthRoute.tsx` | Redirects unauthenticated → `/login?returnUrl=...` |
| `src/components/guards/AdminRoute.tsx` | Redirects non-admin → `/attendance` |
| `src/components/guards/GuestRoute.tsx` | Redirects authenticated → `/dashboard` |

### 🪝 Hooks

| File | Returns |
|------|---------|
| `src/hooks/useAuth.ts` | `{ user, isAdmin, isAuthenticated, loading }` |
| `src/hooks/useTheme.ts` | `{ theme, toggleTheme }` |
| `src/hooks/useRedux.ts` | Typed `useAppDispatch`, `useAppSelector` |

### 📄 Pages

| File | Route | Description |
|------|-------|-------------|
| `src/pages/NotFound.tsx` | `*` | 404 with back-to-home link |

### 🔄 Store Updates

| File | Change |
|------|--------|
| `src/store/auth/auth.thunk.ts` | Add `getMeThunk`, update `logoutThunk` |
| `src/store/rootReducer.ts` | Register all placeholder slices |

---

## ◈ Sidebar Navigation Map

```
┌─────────────────────────────────────────────────┐
│  ⚙️  Management System            [ collapse ]   │
├─────────────────────────────────────────────────┤
│  ▸  Dashboard           /dashboard   ADMIN ONLY  │
│  ▸  Employees           /employees   ADMIN ONLY  │
│  ▸  Attendance          /attendance  ALL USERS   │
│  ▸  Payouts             /payouts     ALL USERS   │
├── Feature-Flagged ──────────────────────────────┤
│  ▸  Inventory           /inventory   if enabled  │
│  ▸  Expenses            /expenses    if enabled  │
│  ▸  Walk-In Customers   /walk-in     if enabled  │
│  ▸  Ring Customers      /ring        if enabled  │
│  ▸  Containers          /containers  if enabled  │
├─────────────────────────────────────────────────┤
│  ▸  Settings            /settings    ALL USERS   │
└─────────────────────────────────────────────────┘
```

Feature flags from `IUser`:

| Flag | Controls |
|------|----------|
| `isInventoryEnabled` | Show/hide Inventory nav item |
| `isExpenseEnabled` | Show/hide Expenses nav item |
| `isWalkInCustomerEnabled` | Show/hide Walk-In Customers nav item |
| `isRingCustomerEnabled` | Show/hide Ring Customers nav item |
| `isContainerEnabled` | Show/hide Containers nav item |
| `isPayoutEnabled` | Show/hide Payouts nav item |
| `isClockInClockOutEnabled` | Show/hide Attendance clock button |

---

## ◈ Route Configuration

```typescript
// src/App.tsx — Route tree

<Routes>
  {/* Guest only */}
  <Route element={<GuestRoute />}>
    <Route path="/login" element={<Login />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
  </Route>

  {/* Authenticated — App Shell */}
  <Route element={<AuthRoute />}>
    <Route element={<AppLayout />}>

      {/* Admin only */}
      <Route element={<AdminRoute />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/employees/create" element={<CreateEmployee />} />
        <Route path="/employees/:uid/edit" element={<EditEmployee />} />
      </Route>

      {/* All authenticated users */}
      <Route path="/attendance" element={<AttendanceDashboard />} />
      <Route path="/attendance/logs" element={<AttendanceLogs />} />
      <Route path="/payouts" element={<PayoutList />} />
      <Route path="/inventory" element={<InventoryList />} />
      <Route path="/expenses" element={<ExpenseList />} />
      <Route path="/walk-in-customers" element={<WalkInCustomerList />} />
      <Route path="/ring-customers" element={<RingCustomerList />} />
      <Route path="/containers" element={<ContainerList />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/change-password" element={<ChangePassword />} />
    </Route>
  </Route>

  <Route path="*" element={<NotFound />} />
</Routes>
```

---

## ◈ Session Restore Flow

```
App mounts
    │
    ▼
getMeThunk() dispatched
    │
    ├─► accessToken in localStorage?
    │       │
    │       ├─ YES → GET /api/v1/user
    │       │           │
    │       │           ├─ 200 → store user, isAuthenticated = true
    │       │           └─ 401 → clear tokens, isAuthenticated = false
    │       │
    │       └─ NO  → isAuthenticated = false
    │
    ▼
AuthRoute reads isAuthenticated
    │
    ├─ true  → render requested route
    └─ false → redirect to /login?returnUrl=<current>
```

---

## ◈ Dark Mode — Layout Tokens

| Element | Light | Dark |
|---------|-------|------|
| `<body>` | `bg-slate-50` | `dark:bg-slate-900` |
| Sidebar | `bg-white border-r border-slate-200` | `dark:bg-slate-900 dark:border-slate-700` |
| Sidebar active item | `bg-blue-50 text-blue-700` | `dark:bg-blue-900/30 dark:text-blue-400` |
| Topbar | `bg-white border-b border-slate-200` | `dark:bg-slate-800 dark:border-slate-700` |
| Nav item hover | `hover:bg-slate-100` | `dark:hover:bg-slate-800` |
| User name text | `text-slate-800` | `dark:text-slate-100` |

---

## ◈ Acceptance Criteria

- [ ] Page refresh restores authentication state via `getMeThunk()` without flash of login page
- [ ] Sidebar collapses to icon-only mode on toggle; state remembered in localStorage
- [ ] Feature-flagged nav items hidden for users where the flag is `false`
- [ ] Admin-only routes redirect regular users to `/attendance`
- [ ] `AuthRoute` preserves intended URL in `returnUrl` query param after login
- [ ] Logout clears `accessToken` from localStorage and redirects to `/login`
- [ ] 404 page shown for any unmatched route with link back to home
- [ ] Topbar shows user's `fullName` and role badge
- [ ] Theme toggle in Topbar persists preference across sessions
- [ ] Sidebar and Topbar fully styled in both light and dark mode

---

<div align="center">

[`FE-01`](./FE-01_Project_Setup_Auth_UI.md) &nbsp;→&nbsp; `FE-02` &nbsp;→&nbsp; [`FE-03`](./FE-03_Admin_Dashboard.md)

*Management System · Frontend Phase Plans*

</div>
