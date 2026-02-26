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
| `POST` | `/api/v1/walk-in-customer` | Create form | 🔒 Bearer |
| `GET` | `/api/v1/walk-in-customers` | List page | 🔒 Bearer |
| `PUT` | `/api/v1/walk-in-customer/:wcId` | Edit form | 🔒 Bearer |
| `DELETE` | `/api/v1/walk-in-customer/:wcId` | Table action | 🔒 Bearer |
| `PUT` | `/api/v1/walk-in-customers/status` | Bulk status | 🔒 Bearer |
| `GET` | `/api/v1/walk-in-customer/customer-names` | Autocomplete | 🔒 Bearer |
| `GET` | `/api/v1/walk-in-customer/download-invoice` | Invoice PDF | 🔒 Bearer |

---

## ◈ Files to Create

| File | Type | Description |
|------|------|-------------|
| `src/pages/walkInCustomers/WalkInCustomerList.tsx` | Page | List + status filter + bulk actions |
| `src/components/walkInCustomers/WalkInCustomerForm.tsx` | UI | Form with auto-total calculation |
| `src/components/walkInCustomers/WalkInCustomerTable.tsx` | UI | Table with line items and totals |
| `src/components/walkInCustomers/BulkStatusModal.tsx` | UI | Select rows → change status |
| `src/components/walkInCustomers/InvoiceButton.tsx` | UI | Triggers invoice PDF download |
| `src/api/walkInCustomers.api.ts` | API | All walk-in customer HTTP calls |
| `src/store/walkInCustomers/walkInCustomers.slice.ts` | Slice | Customer list state |
| `src/store/walkInCustomers/walkInCustomers.thunk.ts` | Thunk | CRUD + bulk status + invoice |
| `src/store/walkInCustomers/walkInCustomers.types.ts` | Types | `IWalkInCustomer`, status enum |

---

## ◈ Walk-In Customer Form Fields

| Field | Type | Notes |
|-------|------|-------|
| Date | Date Picker | Required |
| Customer Name | Autocomplete | From `GET /customer-names` |
| Car Tires Count | Number | Optional |
| Car Tires Price | Number | Per unit price |
| Truck Tires Count | Number | Optional |
| Truck Tires Price | Number | Per unit price |
| Rims Count | Number | Optional |
| Rims Price | Number | Per unit price |
| Total Amount | Number (auto) | `(carCount×carPrice) + (truckCount×truckPrice) + (rimsCount×rimsPrice)` |
| Status | Select | `pending` \| `paid` \| `cancelled` |

---

## ◈ Acceptance Criteria

- [ ] `totalAmount` recalculates in real-time as user enters counts and prices
- [ ] Customer name autocomplete fetches from API; free-text still allowed
- [ ] Status filter on list page (All / Pending / Paid / Cancelled)
- [ ] Bulk status update: select multiple rows via checkbox → apply status
- [ ] Invoice PDF button triggers `GET /download-invoice` and opens result in new tab
- [ ] Module hidden when `isWalkInCustomerEnabled === false`

---

<div align="center">

[`FE-08`](./FE-08_Expense_Module.md) &nbsp;→&nbsp; `FE-09` &nbsp;→&nbsp; [`FE-10`](./FE-10_Ring_Customer_Module.md)

</div>