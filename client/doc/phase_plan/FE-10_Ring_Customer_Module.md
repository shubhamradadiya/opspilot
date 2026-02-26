<!--  FE-10  -->

<div align="center">

```
███████╗███████╗     ██╗ ██████╗
██╔════╝██╔════╝    ███║██╔═████╗
█████╗  █████╗  █████╗██║██║██╔██║
██╔══╝  ██╔══╝  ╚════╝██║████╔╝██║
██║     ███████╗      ██║╚██████╔╝
╚═╝     ╚══════╝      ╚═╝ ╚═════╝
```

# 💍 Ring Customer Module

**Phase** `FE-10` &nbsp;·&nbsp; **Priority** `🟡 MEDIUM` &nbsp;·&nbsp; **Status** `⬜ TODO`

---

*Backend:* `http://localhost:3001` &nbsp;|&nbsp; *Depends On:* [`FE-02`](./FE-02_Auth_Integration_App_Shell.md) &nbsp;|&nbsp; *Enables:* `FE-11`

</div>

---

## ◈ Overview

Ring order management — track customer ring orders with quantities, per-unit pricing, delivery fees, total amounts, and delivery status. Auto-calculates totals.

---

## ◈ API Endpoints

| Method | Endpoint | Used In | Auth? |
|:------:|----------|---------|:-----:|
| `POST` | `/api/v1/ring-customer` | Create form | 🔒 Bearer |
| `GET` | `/api/v1/ring-customers` | List page | 🔒 Bearer |
| `PUT` | `/api/v1/ring-customer/:rcId` | Edit form | 🔒 Bearer |
| `DELETE` | `/api/v1/ring-customer/:rcId` | Table action | 🔒 Bearer |

---

## ◈ Files to Create

| File | Type | Description |
|------|------|-------------|
| `src/pages/ringCustomers/RingCustomerList.tsx` | Page | Order list with status filter |
| `src/components/ringCustomers/RingCustomerForm.tsx` | UI | Form with auto-total |
| `src/components/ringCustomers/RingCustomerTable.tsx` | UI | Table with order details |
| `src/api/ringCustomers.api.ts` | API | All ring customer HTTP calls |
| `src/store/ringCustomers/ringCustomers.slice.ts` | Slice | Ring order list state |
| `src/store/ringCustomers/ringCustomers.thunk.ts` | Thunk | CRUD thunks |
| `src/store/ringCustomers/ringCustomers.types.ts` | Types | `IRingCustomer` |

---

## ◈ Ring Customer Form Fields

| Field | Type | Formula |
|-------|------|---------|
| Date | Date Picker | Required |
| Customer Name | Text | Required |
| Ordered Ring Count | Number | Required, ≥ 1 |
| Price | Number | Per-ring price |
| Delivery Fee | Number | Additional fee |
| Total Amount | Number (auto) | `(count × price) + deliveryFee` |
| Status | Select | `pending` \| `delivered` \| `cancelled` |

---

## ◈ Acceptance Criteria

- [ ] Total auto-calculates on count/price/delivery fee change
- [ ] Status filter on list: All / Pending / Delivered / Cancelled
- [ ] Status badge uses distinct color per status type
- [ ] Date range filter available on list
- [ ] Module hidden when `isRingCustomerEnabled === false`

---

<div align="center">

[`FE-09`](./FE-09_Walk_In_Customer_Module.md) &nbsp;→&nbsp; `FE-10` &nbsp;→&nbsp; [`FE-11`](./FE-11_Container_Module.md)

</div>