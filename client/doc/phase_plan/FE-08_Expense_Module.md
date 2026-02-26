<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║                    MANAGEMENT SYSTEM · FRONTEND PHASES                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->
<div align="center">

```
███████╗███████╗      ██████╗  █████╗
██╔════╝██╔════╝     ██╔═══██╗██╔══██╗
█████╗  █████╗  █████╗██║   ██║╚█████╔╝
██╔══╝  ██╔══╝  ╚════╝██║   ██║██╔══██╗
██║     ███████╗      ╚██████╔╝╚█████╔╝
╚═╝     ╚══════╝       ╚═════╝  ╚════╝
```

# 💰 Expense Module

**Phase** `FE-08` &nbsp;·&nbsp; **Priority** `🟡 MEDIUM` &nbsp;·&nbsp; **Status** `⬜ TODO`

---

*Backend:* `http://localhost:3001` &nbsp;|&nbsp; *Depends On:* [`FE-02`](./FE-02_Auth_Integration_App_Shell.md) &nbsp;|&nbsp; *Enables:* `FE-09`

</div>

---

## ◈ Overview

Track business expenses with full CRUD, vendor name autocomplete, expense type categorization, date filtering, and monthly total summaries.

---

## ◈ API Endpoints

| Method | Endpoint | Used In | Auth? |
|:------:|----------|---------|:-----:|
| `POST` | `/api/v1/expense` | Create form | 🔒 Bearer |
| `GET` | `/api/v1/expenses` | Expense list | 🔒 Bearer |
| `PUT` | `/api/v1/expense/:eId` | Edit form | 🔒 Bearer |
| `DELETE` | `/api/v1/expense/:eId` | Table action | 🔒 Bearer |
| `GET` | `/api/v1/expense/vendor-names` | Form autocomplete | 🔒 Bearer |

---

## ◈ Files to Create

| File | Type | Description |
|------|------|-------------|
| `src/pages/expenses/ExpenseList.tsx` | Page | Table + date filter + summary |
| `src/components/expenses/ExpenseForm.tsx` | UI | Create/Edit with vendor autocomplete |
| `src/components/expenses/ExpenseTable.tsx` | UI | Table with type badge, total |
| `src/components/expenses/ExpenseTypeBadge.tsx` | UI | Colored badge per expense type |
| `src/components/expenses/MonthlySummaryCard.tsx` | UI | Total expenses this month |
| `src/api/expenses.api.ts` | API | All expense HTTP calls |
| `src/store/expenses/expenses.slice.ts` | Slice | Expense list + vendor names |
| `src/store/expenses/expenses.thunk.ts` | Thunk | CRUD + fetchVendorNames |
| `src/store/expenses/expenses.types.ts` | Types | `IExpense`, expense type enum |

---

## ◈ Expense Form Fields

| Field | Type | Notes |
|-------|------|-------|
| Expense Date | Date Picker | Required |
| Vendor Name | Autocomplete text | Loads from `GET /vendor-names` |
| Expense Type | Select (enum) | From `expenses_expensetype_enum` |
| Description | Textarea | Optional free text |
| Total Expense | Number | Required, ≥ 0, 2 decimal |
| Vendor (link) | Select (user) | Optional — links to employee as vendor |

---

## ◈ Acceptance Criteria

- [ ] Expense list sortable by date, vendor, total amount
- [ ] Vendor autocomplete populates from API; free-text still allowed
- [ ] Expense type shown as distinct colored badge for each category
- [ ] Monthly summary card shows total spend for current month
- [ ] Date range filter narrows list to selected period
- [ ] Module hidden when `isExpenseEnabled === false`

---

<div align="center">

[`FE-07`](./FE-07_Inventory_Module.md) &nbsp;→&nbsp; `FE-08` &nbsp;→&nbsp; [`FE-09`](./FE-09_Walk_In_Customer_Module.md)

</div>

---
---

<!--  FE-09  -->

<div align="center">

```
███████╗███████╗      ██████╗  █████╗
██╔════╝██╔════╝     ██╔═══██╗██╔══██╗
█████╗  █████╗  █████╗██║   ██║╚██████║
██╔══╝  ██╔══╝  ╚════╝██║   ██║╚═══██║
██║     ███████╗      ╚██████╔╝█████╔╝
╚═╝     ╚══════╝       ╚═════╝╚════╝
```

# 🛒 Walk-In Customer Module

**Phase** `FE-09` &nbsp;·&nbsp; **Priority** `🟡 MEDIUM` &nbsp;·&nbsp; **Status** `⬜ TODO`

---

*Backend:* `http://localhost:3001` &nbsp;|&nbsp; *Depends On:* [`FE-02`](./FE-02_Auth_Integration_App_Shell.md) &nbsp;|&nbsp; *Enables:* `FE-10`

</div>

---

## ◈ Overview

Sales tracking for walk-in customers purchasing car tires, truck tires, and rims. Auto-calculates the total from individual item prices. Supports bulk status updates, customer name autocomplete, and invoice PDF generation.

---

## ◈ API Endpoints

| Method | Endpoint | Used In | Auth? |
|:------:|----------|---------|:-----:|
