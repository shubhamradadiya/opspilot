<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║                    MANAGEMENT SYSTEM · FRONTEND PHASES                     ║
║                         http://localhost:3001                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->

<div align="center">

```
███████╗███████╗      ██████╗  ██████╗
██╔════╝██╔════╝     ██╔═══██╗██╔════╝
█████╗  █████╗  █████╗██║   ██║███████╗
██╔══╝  ██╔══╝  ╚════╝██║   ██║██╔═══╝
██║     ███████╗      ╚██████╔╝███████║
╚═╝     ╚══════╝       ╚═════╝╚══════╝
```

# 💸 Payout Module

**Phase** `FE-06` &nbsp;·&nbsp; **Priority** `🟠 HIGH` &nbsp;·&nbsp; **Status** `⬜ TODO`

---

*Backend:* `http://localhost:3001` &nbsp;|&nbsp; *Depends On:* [`FE-05`](./FE-05_Attendance_Module.md) &nbsp;|&nbsp; *Enables:* `FE-07`

</div>

---

## ◈ Overview

Payout management covering employee salary payouts, loan tracking, and PDF receipt generation. Admins create and manage payouts for all employees. Regular employees view their own payout history and can download PDF receipts.

---

## ◈ API Endpoints

| Method | Endpoint | Used In | Auth? |
|:------:|----------|---------|:-----:|
| `POST` | `/api/v1/payout` | `CreatePayout.tsx` | 🔒 Admin |
| `POST` | `/api/v1/payout/add-loan` | `AddLoanModal.tsx` | 🔒 Admin |
| `GET` | `/api/v1/payouts/self-payouts` | `PayoutList.tsx` (user) | 🔒 Bearer |
| `GET` | `/api/v1/payouts/all-payouts` | `PayoutList.tsx` (admin) | 🔒 Admin |
| `POST` | `/api/v2/payout/download-payout-receipt` | `PayoutReceiptButton.tsx` | 🔒 Bearer |

---

## ◈ Files to Create

| File | Type | Description |
|------|------|-------------|
| `src/pages/payouts/PayoutList.tsx` | Page | Admin: all payouts; User: self payouts |
| `src/pages/payouts/CreatePayout.tsx` | Page | Admin create payout form |
| `src/components/payouts/PayoutTable.tsx` | UI | Table with amount, loan, status |
| `src/components/payouts/AddLoanModal.tsx` | UI | Add loan to employee modal |
| `src/components/payouts/PayoutStatusBadge.tsx` | UI | Paid / Unpaid colored badge |
| `src/components/payouts/PayoutReceiptButton.tsx` | UI | PDF download trigger button |
| `src/api/payouts.api.ts` | API | All payout HTTP calls |
| `src/store/payouts/payouts.slice.ts` | Slice | Payout list state |
| `src/store/payouts/payouts.thunk.ts` | Thunk | Fetch, create, addLoan, downloadReceipt |
| `src/store/payouts/payouts.types.ts` | Types | `IPayout`, `ICreatePayoutPayload` |

---

## ◈ Payout Form Fields

| Field | Type | Notes |
|-------|------|-------|
| Employee | Select | Admin picks from active employee list |
| Amount | Number | Gross payout amount |
| Loan Deduction | Number | Auto-filled from employee `loanAmount` |
| Paid Amount | Number | Net after loan deduction |
| Is Paid | Toggle | Mark as settled |
| Employee Signature | Text / File | Optional signature reference |

---

## ◈ Acceptance Criteria

- [ ] Admin can create a payout for any active employee
- [ ] Loan amount auto-populated from employee's current `loanAmount`
- [ ] Add Loan modal updates employee loan balance without creating a payout
- [ ] Paid / Unpaid status badge shown with correct color in table
- [ ] PDF receipt download opens in new browser tab
- [ ] Employee self-payouts shows only their own records
- [ ] Module hidden when `isPayoutEnabled === false`

---

<div align="center">

[`FE-05`](./FE-05_Attendance_Module.md) &nbsp;→&nbsp; `FE-06` &nbsp;→&nbsp; [`FE-07`](./FE-07_Inventory_Module.md)

*Management System · Frontend Phase Plans*

</div>
