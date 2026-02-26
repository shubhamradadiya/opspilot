<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║          ███╗   ███╗ ██████╗ ███╗   ███╗████████╗                         ║
║          ████╗ ████║██╔════╝ ████╗ ████║╚══██╔══╝                         ║
║          ██╔████╔██║██║  ███╗██╔████╔██║   ██║                            ║
║          ██║╚██╔╝██║██║   ██║██║╚██╔╝██║   ██║                            ║
║          ██║ ╚═╝ ██║╚██████╔╝██║ ╚═╝ ██║   ██║                            ║
║          ╚═╝     ╚═╝ ╚═════╝ ╚═╝     ╚═╝   ╚═╝                            ║
║                                                                            ║
║              MANAGEMENT SYSTEM — FRONTEND MASTER PLAN                     ║
║                      http://localhost:3001                                 ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->

<div align="center">

# 🗺 Frontend Master Phase Plan

**Stack** `Vite + React 18 + TypeScript + Redux Toolkit + Tailwind CSS v4`
&nbsp;·&nbsp; **API** `http://localhost:3001`
&nbsp;·&nbsp; **Theme** `Dark & Light Mode`

</div>

---

## ◈ Quick Reference — All Phases

| Phase | Title | Priority | Depends On | Status |
|:-----:|-------|:--------:|-----------|:------:|
| [FE-01](./FE-01_Project_Setup_Auth_UI.md) | Project Setup & Auth UI | 🔴 CRITICAL | — | ⬜ TODO |
| [FE-02](./FE-02_Auth_Integration_App_Shell.md) | Auth Integration & App Shell | 🔴 CRITICAL | FE-01 | ⬜ TODO |
| [FE-03](./FE-03_Admin_Dashboard.md) | Admin Dashboard | 🟠 HIGH | FE-02 | ⬜ TODO |
| [FE-04](./FE-04_Employee_Management.md) | Employee Management | 🟠 HIGH | FE-02 | ⬜ TODO |
| [FE-05](./FE-05_Attendance_Module.md) | Attendance Module | 🟠 HIGH | FE-02 | ⬜ TODO |
| [FE-06](./FE-06_Payout_Module.md) | Payout Module | 🟠 HIGH | FE-05 | ⬜ TODO |
| [FE-07](./FE-07_Inventory_Module.md) | Inventory Module | 🟡 MEDIUM | FE-02 | ⬜ TODO |
| [FE-08](./FE-08_Expense_Module.md) | Expense Module | 🟡 MEDIUM | FE-02 | ⬜ TODO |
| [FE-09](./FE-09_Walk_In_Customer_Module.md) | Walk-In Customer Module | 🟡 MEDIUM | FE-02 | ⬜ TODO |
| [FE-10](./FE-10_Ring_Customer_Module.md) | Ring Customer Module | 🟡 MEDIUM | FE-02 | ⬜ TODO |
| [FE-11](./FE-11_Container_Module.md) | Container Module | 🟡 MEDIUM | FE-02 | ⬜ TODO |
| [FE-12](./FE-12_Polish_Dark_Mode_Release.md) | Polish, Dark Mode & Release | 🟠 HIGH | FE-01→FE-11 | ⬜ TODO |

---

## ◈ Execution Order

```
                    ┌──────────┐
                    │  FE-01   │  Project Setup + Auth UI
                    │ CRITICAL │
                    └────┬─────┘
                         │
                    ┌────▼─────┐
                    │  FE-02   │  Auth Integration + Shell
                    │ CRITICAL │
                    └────┬─────┘
                         │
          ┌──────────────┼──────────────────────┐
          │              │                      │
     ┌────▼─────┐  ┌─────▼────┐          ┌─────▼────┐
     │  FE-03   │  │  FE-04   │          │  FE-07   │
     │Dashboard │  │Employees │          │Inventory │
     └──────────┘  └──────────┘          └──────────┘
                         │
                    ┌────▼─────┐         ┌──────────┐
                    │  FE-05   │         │  FE-08   │
                    │Attendance│         │ Expenses │
                    └────┬─────┘         └──────────┘
                         │
                    ┌────▼─────┐         ┌──────────┐
                    │  FE-06   │         │  FE-09   │
                    │ Payouts  │         │ Walk-In  │
                    └──────────┘         └──────────┘
                                         ┌──────────┐
                                         │  FE-10   │
                                         │   Ring   │
                                         └──────────┘
                                         ┌──────────┐
                                         │  FE-11   │
                                         │Container │
                                         └──────────┘
                              ↓ All complete ↓
                         ┌────────────┐
                         │   FE-12    │
                         │  Release   │
                         └────────────┘
```

---

## ◈ Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Build Tool | Vite | 5.x |
| Framework | React + TypeScript | 18.x + 5.x |
| State | Redux Toolkit | 2.x |
| Routing | React Router | v6 |
| HTTP | Axios | 1.x |
| Styling | Tailwind CSS | v4 |
| Forms | React Hook Form + Zod | 7.x |
| Icons | Lucide React | latest |
| Charts | Recharts | 2.x |
| Dates | date-fns | 3.x |
| Toasts | Sonner | latest |
| PDF | jsPDF | 2.x |

---

## ◈ Database Entities → Frontend Slices

| DB Table | Frontend Store Slice | Phase |
|----------|---------------------|:-----:|
| `users` + `access_tokens` + `refresh_tokens` | `auth` | FE-01 |
| `users` (employee role) | `employees` | FE-04 |
| `user_logs` | `attendance` | FE-05 |
| `payout` | `payouts` | FE-06 |
| `inventories` + `inventory_logs` | `inventory` | FE-07 |
| `expenses` | `expenses` | FE-08 |
| `walk_in_customers` | `walkInCustomers` | FE-09 |
| `ring_customers` | `ringCustomers` | FE-10 |
| `containers` + `container_documents` | `containers` | FE-11 |
| `countries` | `countries` (shared util) | FE-01 |

---

## ◈ Complete API Surface

| Module | Endpoints | Phase |
|--------|----------|:-----:|
| **Auth** | POST login, send-otp, verify-otp, reset-password, change-password, logout · GET user | FE-01/02 |
| **Employees** | GET list · POST create · PUT update · PATCH status · DELETE | FE-04 |
| **Attendance** | POST check-status, clock-in-out, add-log · GET logs, today, timestamps · DELETE logs | FE-05 |
| **Payouts** | POST create, add-loan, download-receipt · GET self-payouts, all-payouts | FE-06 |
| **Inventory** | POST create · GET list, activity-logs · PUT update, mark-read · DELETE | FE-07 |
| **Expenses** | POST create · GET list, vendor-names · PUT update · DELETE | FE-08 |
| **Walk-In** | POST create · GET list, customer-names, download-invoice · PUT update, status · DELETE | FE-09 |
| **Ring** | POST create · GET list · PUT update · DELETE | FE-10 |
| **Containers** | POST create · GET list, booking-numbers · PUT update · DELETE | FE-11 |
| **Admin Dashboard** | GET dashboard | FE-03 |

---

## ◈ Role-Based Access Matrix

| Feature | Admin | User (enabled) | User (disabled) |
|---------|:-----:|:--------------:|:---------------:|
| Dashboard | ✅ | ❌ | ❌ |
| Employees | ✅ | ❌ | ❌ |
| Attendance | ✅ | ✅ | ❌ |
| Payouts | ✅ | ✅ | ❌ |
| Inventory | ✅ | ✅ | ❌ |
| Expenses | ✅ | ✅ | ❌ |
| Walk-In | ✅ | ✅ | ❌ |
| Ring | ✅ | ✅ | ❌ |
| Containers | ✅ | ✅ | ❌ |
| Settings | ✅ | ✅ | ✅ |

> User visibility per module controlled by `is{Module}Enabled` flag on the `users` table.

---

## ◈ Design System Tokens

### Colors

```
Light Mode                        Dark Mode
──────────────────────────────    ──────────────────────────────
Background   #F8FAFC (slate-50)   #0F172A (slate-900)
Surface      #FFFFFF               #1E293B (slate-800)
Elevated     #FFFFFF               #334155 (slate-700)
Text/Primary #0F172A (slate-900)  #F8FAFC (slate-50)
Text/Muted   #64748B (slate-500)  #94A3B8 (slate-400)
Border       #E2E8F0 (slate-200)  #334155 (slate-700)
─────────────────────────────────────────────────────
Accent/Blue  #1E40AF (blue-800)   #3B82F6 (blue-500)
Success      #16A34A (green-600)  #22C55E (green-500)
Warning      #D97706 (amber-600)  #F59E0B (amber-500)
Danger       #DC2626 (red-600)    #EF4444 (red-500)
Purple       #7C3AED (violet-600) #8B5CF6 (violet-500)
```

### Typography

```
Font Family:   Inter (body), system-ui fallback
Headings:      font-semibold, tracking-tight
Body:          font-normal, leading-relaxed
Code/IDs:      font-mono, text-sm
```

### Spacing Scale (Tailwind)

```
4px   →  p-1, m-1
8px   →  p-2, m-2
12px  →  p-3, m-3
16px  →  p-4, m-4  (base)
24px  →  p-6, m-6
32px  →  p-8, m-8
48px  →  p-12, m-12
64px  →  p-16, m-16
```

---

## ◈ File Structure

```
client/
├── src/
│   ├── api/                         # HTTP service modules
│   │   ├── auth.api.ts
│   │   ├── dashboard.api.ts
│   │   ├── employees.api.ts
│   │   ├── attendance.api.ts
│   │   ├── payouts.api.ts
│   │   ├── inventory.api.ts
│   │   ├── expenses.api.ts
│   │   ├── walkInCustomers.api.ts
│   │   ├── ringCustomers.api.ts
│   │   └── containers.api.ts
│   │
│   ├── components/
│   │   ├── common/                  # Shared, reusable components
│   │   │   ├── DataTable.tsx
│   │   │   ├── DeleteConfirmModal.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── guards/                  # Route protection
│   │   │   ├── AdminRoute.tsx
│   │   │   ├── AuthRoute.tsx
│   │   │   └── GuestRoute.tsx
│   │   ├── layout/                  # App shell
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Topbar.tsx
│   │   ├── ui/                      # Base UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── OtpInput.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── dashboard/
│   │   ├── employees/
│   │   ├── attendance/
│   │   ├── payouts/
│   │   ├── inventory/
│   │   ├── expenses/
│   │   ├── walkInCustomers/
│   │   ├── ringCustomers/
│   │   └── containers/
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useRedux.ts
│   │   └── useTheme.ts
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   └── ChangePassword.tsx
│   │   ├── dashboard/
│   │   ├── employees/
│   │   ├── attendance/
│   │   ├── payouts/
│   │   ├── inventory/
│   │   ├── expenses/
│   │   ├── walkInCustomers/
│   │   ├── ringCustomers/
│   │   ├── containers/
│   │   └── NotFound.tsx
│   │
│   ├── store/
│   │   ├── auth/
│   │   │   ├── auth.slice.ts
│   │   │   ├── auth.thunk.ts
│   │   │   └── auth.types.ts
│   │   ├── dashboard/
│   │   ├── employees/
│   │   ├── attendance/
│   │   ├── payouts/
│   │   ├── inventory/
│   │   ├── expenses/
│   │   ├── walkInCustomers/
│   │   ├── ringCustomers/
│   │   ├── containers/
│   │   ├── rootReducer.ts
│   │   └── store.ts
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── utils/
│   │   ├── axiosInstance.ts
│   │   ├── formatters.ts
│   │   ├── routes.ts
│   │   └── validators.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env
├── tailwind.config.ts
├── tsconfig.app.json
├── vite.config.ts
└── package.json
```

---

## ◈ Phase Documents Index

| File | Description |
|------|-------------|
| [`FE-01_Project_Setup_Auth_UI.md`](./FE-01_Project_Setup_Auth_UI.md) | Full setup, auth UI, Tailwind tokens |
| [`FE-02_Auth_Integration_App_Shell.md`](./FE-02_Auth_Integration_App_Shell.md) | Session restore, shell, route guards |
| [`FE-03_Admin_Dashboard.md`](./FE-03_Admin_Dashboard.md) | Dashboard stats, charts, widgets |
| [`FE-04_Employee_Management.md`](./FE-04_Employee_Management.md) | Employee CRUD, feature flags |
| [`FE-05_Attendance_Module.md`](./FE-05_Attendance_Module.md) | Clock in/out, logs, timestamps |
| [`FE-06_Payout_Module.md`](./FE-06_Payout_Module.md) | Payouts, loans, PDF receipts |
| [`FE-07_Inventory_Module.md`](./FE-07_Inventory_Module.md) | Inventory CRUD, activity logs |
| [`FE-08_Expense_Module.md`](./FE-08_Expense_Module.md) | Expense CRUD, vendor autocomplete |
| [`FE-09_Walk_In_Customer_Module.md`](./FE-09_Walk_In_Customer_Module.md) | Walk-in sales, invoice PDF |
| [`FE-10_Ring_Customer_Module.md`](./FE-10_Ring_Customer_Module.md) | Ring orders, delivery tracking |
| [`FE-11_Container_Module.md`](./FE-11_Container_Module.md) | Containers, documents, ETD/ETA |
| [`FE-12_Polish_Dark_Mode_Release.md`](./FE-12_Polish_Dark_Mode_Release.md) | Dark mode, a11y, performance, release |
| [`IMPLEMENTATION_PROGRESS.md`](./IMPLEMENTATION_PROGRESS.md) | 🤖 AI-updated live status tracker |

---

<div align="center">

*Management System · Frontend Master Plan*
&nbsp;·&nbsp;
`12 Phases` &nbsp;·&nbsp; `http://localhost:3001` &nbsp;·&nbsp; `Dark & Light Mode`

</div>
