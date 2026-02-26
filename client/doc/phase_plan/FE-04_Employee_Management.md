<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║                    MANAGEMENT SYSTEM · FRONTEND PHASES                     ║
║                         http://localhost:3001                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->

<div align="center">

```
███████╗███████╗      ██████╗ ██╗  ██╗
██╔════╝██╔════╝     ██╔═══██╗██║  ██║
█████╗  █████╗  █████╗██║   ██║███████║
██╔══╝  ██╔══╝  ╚════╝██║   ██║╚════██║
██║     ███████╗      ╚██████╔╝     ██║
╚═╝     ╚══════╝       ╚═════╝      ╚═╝
```

# 👥 Employee Management

**Phase** `FE-04` &nbsp;·&nbsp; **Priority** `🟠 HIGH` &nbsp;·&nbsp; **Status** `⬜ TODO`

---

*Backend:* `http://localhost:3001` &nbsp;|&nbsp; *Depends On:* [`FE-02`](./FE-02_Auth_Integration_App_Shell.md) &nbsp;|&nbsp; *Enables:* `FE-05`

</div>

---

## ◈ Overview

Full employee management CRUD for admins. List view with search/filter, create new employee with feature flag configuration, edit existing employee details, toggle active/inactive status with optimistic UI, and soft-delete with confirmation modal.

---

## ◈ API Endpoints

| Method | Endpoint | Used In | Auth? |
|:------:|----------|---------|:-----:|
| `GET` | `/api/v1/employee` | `EmployeeList.tsx` | 🔒 Admin |
| `POST` | `/api/v1/employee` | `CreateEmployee.tsx` | 🔒 Admin |
| `PUT` | `/api/v1/employee/:uid` | `EditEmployee.tsx` | 🔒 Admin |
| `PATCH` | `/api/v1/employee/:uid/status` | `EmployeeTable.tsx` toggle | 🔒 Admin |
| `DELETE` | `/api/v1/employee/:uid` | `EmployeeTable.tsx` delete | 🔒 Admin |

---

## ◈ Files to Create

| File | Type | Description |
|------|------|-------------|
| `src/pages/employees/EmployeeList.tsx` | Page | Table + search + filter |
| `src/pages/employees/CreateEmployee.tsx` | Page | Multi-section create form |
| `src/pages/employees/EditEmployee.tsx` | Page | Pre-filled edit form |
| `src/components/employees/EmployeeTable.tsx` | UI | Data table with actions |
| `src/components/employees/EmployeeForm.tsx` | UI | Shared form component |
| `src/components/employees/FeatureFlagsToggle.tsx` | UI | Checkbox grid for flags |
| `src/components/employees/EmployeeStatusBadge.tsx` | UI | Active / Inactive badge |
| `src/components/common/DeleteConfirmModal.tsx` | UI | Reusable delete confirm |
| `src/api/employees.api.ts` | API | All employee HTTP calls |
| `src/store/employees/employees.slice.ts` | Slice | List + selected employee |
| `src/store/employees/employees.thunk.ts` | Thunk | All async operations |
| `src/store/employees/employees.types.ts` | Types | `IEmployee`, `ICreateEmployeePayload` |

---

## ◈ Employee Form Fields

| Field | Input Type | Required | Validation |
|-------|-----------|:--------:|------------|
| Full Name | Text | ✅ | Min 2 chars |
| Email | Email | ❌ | Valid format |
| Country Code | Select (countries list) | ❌ | — |
| Phone | Text | ❌ | Numeric |
| Password | Password | ✅ create / ❌ edit | Min 8 chars |
| Role | Select | ✅ | `admin` \| `user` |
| Language | Select | ✅ | `en` \| `ar` \| ... |
| Timezone | Select | ❌ | Timezone list |
| Price Unit | Select | ✅ | `$` \| `€` \| `£` |
| Per Hour Rate | Number | ❌ | ≥ 0, 2 decimal |
| **Feature Flags** | Checkbox group | ❌ | — |
| &nbsp;&nbsp;↳ Clock In/Out | Checkbox | — | `isClockInClockOutEnabled` |
| &nbsp;&nbsp;↳ Inventory | Checkbox | — | `isInventoryEnabled` |
| &nbsp;&nbsp;↳ Payouts | Checkbox | — | `isPayoutEnabled` |
| &nbsp;&nbsp;↳ Containers | Checkbox | — | `isContainerEnabled` |
| &nbsp;&nbsp;↳ Expenses | Checkbox | — | `isExpenseEnabled` |
| &nbsp;&nbsp;↳ Walk-In Customers | Checkbox | — | `isWalkInCustomerEnabled` |
| &nbsp;&nbsp;↳ Ring Customers | Checkbox | — | `isRingCustomerEnabled` |

---

## ◈ Status Toggle Flow

```
EmployeeTable row
    │
    ▼
Toggle switch clicked
    │
    ▼
Optimistic update (UI changes immediately)
    │
    ▼
PATCH /api/v1/employee/:uid/status
    │
    ├─ 200 OK → confirm state, show success toast
    └─ error  → revert UI, show error toast
```

---

## ◈ Acceptance Criteria

- [ ] Employee list loads all employees with avatar placeholder, name, role, and status
- [ ] Search bar filters employees by name or email (client-side, real-time)
- [ ] Role filter dropdown (All / Admin / User) filters table
- [ ] Status filter (All / Active / Inactive) filters table
- [ ] Create form validates all required fields before submitting
- [ ] Edit form pre-fills all fields from selected employee
- [ ] Password field hidden on edit form (separate change-password flow)
- [ ] Status toggle shows instant optimistic UI update
- [ ] Delete shows `DeleteConfirmModal` with employee name before calling API
- [ ] Feature flags checklist visible and editable in both create and edit forms
- [ ] All actions admin-only — regular users cannot access `/employees`

---

<div align="center">

[`FE-03`](./FE-03_Admin_Dashboard.md) &nbsp;→&nbsp; `FE-04` &nbsp;→&nbsp; [`FE-05`](./FE-05_Attendance_Module.md)

*Management System · Frontend Phase Plans*

</div>
