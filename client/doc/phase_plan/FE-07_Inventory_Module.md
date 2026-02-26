<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║                    MANAGEMENT SYSTEM · FRONTEND PHASES                     ║
║                         http://localhost:3001                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->

<div align="center">

```
███████╗███████╗      ██████╗ ███████╗
██╔════╝██╔════╝     ██╔═══██╗╚════██╗
█████╗  █████╗  █████╗██║   ██║    ███╗
██╔══╝  ██╔══╝  ╚════╝██║   ██║    ╚██║
██║     ███████╗      ╚██████╔╝███████║
╚═╝     ╚══════╝       ╚═════╝╚══════╝
```

# 📦 Inventory Module

**Phase** `FE-07` &nbsp;·&nbsp; **Priority** `🟡 MEDIUM` &nbsp;·&nbsp; **Status** `⬜ TODO`

---

*Backend:* `http://localhost:3001` &nbsp;|&nbsp; *Depends On:* [`FE-02`](./FE-02_Auth_Integration_App_Shell.md) &nbsp;|&nbsp; *Enables:* `FE-08`

</div>

---

## ◈ Overview

Tire and bale inventory management. Create daily stock count snapshots, edit or delete historical entries, and track all changes through an activity log. Admins see unread log entries highlighted and can mark them as read.

---

## ◈ API Endpoints

| Method | Endpoint | Used In | Auth? |
|:------:|----------|---------|:-----:|
| `POST` | `/api/v1/inventory` | `InventoryForm.tsx` create | 🔒 Bearer |
| `GET` | `/api/v1/inventory` | `InventoryList.tsx` | 🔒 Bearer |
| `PUT` | `/api/v1/inventory/:iId` | `InventoryForm.tsx` edit | 🔒 Bearer |
| `DELETE` | `/api/v1/inventory/:iId` | Table delete action | 🔒 Bearer |
| `GET` | `/api/v1/inventory/activity-logs` | `ActivityLogs.tsx` | 🔒 Admin |
| `PUT` | `/api/v1/inventory/activity-log/read` | `ActivityLogTable.tsx` | 🔒 Admin |

---

## ◈ Files to Create

| File | Type | Description |
|------|------|-------------|
| `src/pages/inventory/InventoryList.tsx` | Page | Inventory records table + stock summary |
| `src/pages/inventory/ActivityLogs.tsx` | Page | Admin: all activity log entries |
| `src/components/inventory/InventoryForm.tsx` | UI | Create / Edit modal or drawer |
| `src/components/inventory/InventoryTable.tsx` | UI | Records table with tire/bale counts |
| `src/components/inventory/StockSummaryCards.tsx` | UI | Current totals for each stock type |
| `src/components/inventory/ActivityLogTable.tsx` | UI | Log table with read/unread state |
| `src/api/inventory.api.ts` | API | All inventory HTTP calls |
| `src/store/inventory/inventory.slice.ts` | Slice | Inventory items + activity logs |
| `src/store/inventory/inventory.thunk.ts` | Thunk | CRUD + log thunks |
| `src/store/inventory/inventory.types.ts` | Types | `IInventory`, `IInventoryLog` |

---

## ◈ Inventory Form Fields

| Field | Type | Validation |
|-------|------|------------|
| Inventory Date | Date Picker | Required, not future |
| Car Tires Count | Number | ≥ 0, 2 decimal |
| Truck Tires Count | Number | ≥ 0, 2 decimal |
| Mixed Tires Count | Number | ≥ 0, 2 decimal |
| Bales | Number | ≥ 0, 2 decimal |

---

## ◈ Activity Log Types

| `activityLogType` | Description | Badge Color |
|-------------------|-------------|:-----------:|
| `ADDED` | New inventory record created | `green` |
| `UPDATED` | Existing record was edited | `blue` |
| `DELETED` | Record was removed | `red` |

---

## ◈ Acceptance Criteria

- [ ] Inventory list sorted by date descending with stock summary cards at top
- [ ] Create/edit form validates all fields, handles decimal values correctly
- [ ] Activity log shows `who → what → when` for every inventory change
- [ ] Unread log count shown as badge in sidebar nav for admins
- [ ] Admin can mark all/individual logs as read via `PUT activity-log/read`
- [ ] Module hidden when `isInventoryEnabled === false`

---

<div align="center">

[`FE-06`](./FE-06_Payout_Module.md) &nbsp;→&nbsp; `FE-07` &nbsp;→&nbsp; [`FE-08`](./FE-08_Expense_Module.md)

*Management System · Frontend Phase Plans*

</div>
