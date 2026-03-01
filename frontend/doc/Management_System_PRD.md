<!--
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MANAGEMENT SYSTEM — PRODUCT REQUIREMENTS DOCUMENT
  Internal Use Only · Confidential · v1.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-->

<div align="center">

# ⚙️ OpsPilot
## Product Requirements Document

**Vite · React 18 · TypeScript · Redux Toolkit · Tailwind CSS v4**

---

| Field | Details |
|-------|---------|
| **Project Name** | OpsPilot |
| **Version** | 1.0 |
| **Document Type** | Product Requirements Document (PRD) |
| **Date Created** | February 2026 |
| **Backend URL** | `http://localhost:3001` |
| **Status** | Draft |
| **Author** | Project Team |
| **Confidentiality** | Internal Use Only |

---

*This document is the definitive specification for the OpsPilot frontend.*
*All phases, features, and design decisions reference this document as the primary authority.*

</div>

---

## 📋 Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [Business Goals & Objectives](#3-business-goals--objectives)
4. [Target Users & Roles](#4-target-users--roles)
5. [Product Vision & Design Philosophy](#5-product-vision--design-philosophy)
6. [Feature Requirements](#6-feature-requirements)
7. [User Journeys & Workflows](#7-user-journeys--workflows)
8. [Functional Requirements by Module](#8-functional-requirements-by-module)
9. [Technical Architecture](#9-technical-architecture)
10. [Database Schema](#10-database-schema)
11. [Security Requirements](#11-security-requirements)
12. [Performance Requirements](#12-performance-requirements)
13. [Development Phases](#13-development-phases)
14. [Success Metrics](#14-success-metrics)
15. [Future Enhancements](#15-future-enhancements)
16. [Glossary](#16-glossary)
17. [Appendix](#17-appendix)

---

## 1. Executive Summary

The **OpsPilot** is a web-based internal operations platform designed to centralize and streamline day-to-day business workflows. It serves as the single source of truth for employee management, attendance tracking, salary payouts, inventory control, expense reporting, and customer order management — all accessible from one secure, role-aware interface.

### Key Value Propositions

- **For Admins** — Full visibility and control over employees, payouts, inventory, expenses, containers, and walk-in/ring customer orders from a single dashboard
- **For Employees** — Simple interface to clock in/out, view personal attendance history, and download payout receipts without admin involvement
- **For Operations** — Real-time inventory activity logs with read/unread tracking, automated duration calculations, PDF generation on demand, and feature-flag-based module visibility per employee

### What This System Replaces

| Before (Manual) | After (OpsPilot) |
|-----------------|---------------------------|
| Spreadsheets for attendance | Automated clock-in/out with live timer |
| WhatsApp/manual payout calculations | Auto-calculated payouts with loan deduction & PDF |
| No inventory change history | Full activity log with ADDED / UPDATED / DELETED attribution |
| Disconnected expense notes | Vendor autocomplete, type classification, monthly totals |
| Paper-based customer orders | Walk-in and ring customer orders with auto-total |
| No visibility into container shipments | ETD/ETA tracking with overdue detection |

---

## 2. Project Overview

### 2.1 Problem Statement

Business operations without a centralized platform suffer from:

- **Fragmented attendance tracking** across manual timesheets, spreadsheets, and messaging apps
- **Inconsistent payout calculations** with no automated loan-deduction logic or PDF receipt generation
- **Untracked inventory changes** — no audit trail of who added, edited, or deleted stock records
- **Scattered expense records** with no vendor history, type classification, or monthly totals
- **Customer order data** (walk-in and ring orders) managed in disconnected tools with no status tracking
- **No unified role-based access** — admins and employees see the same interface regardless of permissions
- **No feature-level control** — modules are globally on or off with no per-employee configuration

### 2.2 Proposed Solution

The OpsPilot addresses these challenges by providing a single, role-aware web application that:

- Centralizes all operational data under one authenticated interface with JWT session management
- Enforces role-based access — admins see everything; employees see only what is enabled for them
- Automates time-consuming calculations (duration from timestamps, totals from line items, net payout after loan)
- Provides full audit trails for inventory changes with unread/read notification logic
- Generates PDF documents on demand (payout receipts, customer invoices)
- Supports **feature flags per employee** — modules are toggled at the user level, not globally

### 2.3 Project Scope

**In Scope:**

- Web-based responsive platform (desktop-first, mobile-responsive)
- JWT authentication, session restore, role-based routing
- Employee management (CRUD, status toggle, feature flags per user)
- Attendance clock-in/out, personal logs, admin timestamp grid, manual entries
- Payout creation, loan management, PDF receipt download
- Inventory CRUD with activity log and unread notification badge
- Expense tracking with vendor autocomplete and monthly summaries
- Walk-in customer order management with auto-total and invoice PDF
- Ring customer order management with auto-total and status tracking
- Container shipping management with ETD/ETA and document attachments
- Admin dashboard with live stats, Recharts charts, and quick-action widgets
- Full dark/light mode with class-based Tailwind CSS v4 implementation

**Out of Scope (Phase 1):**

- Native mobile applications (iOS/Android)
- Third-party payment gateway or payroll system integration
- Real-time collaboration or multi-user live editing
- Customer-facing portal or external public API
- Multilingual support beyond English/Arabic
- Advanced analytics or custom report builder
- Biometric or hardware device integration
- White-label or multi-tenant architecture

---

## 3. Business Goals & Objectives

### 3.1 Primary Goals

1. **Eliminate manual tracking** — Replace spreadsheets and messaging-based workflows with structured data entry and automated calculations
2. **Real-time visibility** — Admins can see live attendance status, current inventory levels, and pending payouts at any time
3. **Accurate payroll** — Automate payout calculations incorporating attendance hours, per-hour rate, and loan deductions
4. **Audit readiness** — Maintain complete change history for inventory, attendance, and financial records
5. **Employee autonomy** — Employees can manage their own clock-in/out, view their logs, and download payout receipts without admin involvement

### 3.2 Secondary Goals

1. Build a platform that scales with growing headcount and feature needs
2. Create a foundation for future analytics, reporting, and mobile access
3. Establish consistent data models that can support third-party integrations in future phases
4. Reduce admin time spent on routine data entry and status checks

### 3.3 Success Criteria

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Attendance tracking coverage | 100% of active employees | Daily clock-in rate vs active employee count |
| Payout accuracy | Zero manual recalculations | Admin reports of payout corrections post-launch |
| Inventory audit trail | Every change logged and attributed | Activity log completeness audit |
| Feature adoption | 80%+ of enabled modules used weekly | Module-level page view tracking |
| Page load performance | < 3 seconds on all routes | Lighthouse performance scores |
| Build quality | Zero TypeScript errors at build | CI pipeline pass rate |
| Accessibility | WCAG 2.1 AA compliant | Lighthouse accessibility audit ≥ 90 |

---

## 4. Target Users & Roles

### 4.1 User Personas

#### Persona 1: System Administrator (Admin)

| Field | Details |
|-------|---------|
| **Role** | Owner, Manager, or Operations Lead |
| **Tech-Savviness** | Medium–High |
| **Primary Tasks** | Manage employees, create payouts, review all data, monitor inventory and attendance |
| **Pain Points** | Currently spends hours on manual calculations, has no real-time visibility into operations |
| **Goals** | Single dashboard to see everything; one-click payout creation; full audit trail |

#### Persona 2: Operations Staff (Employee — Enabled)

| Field | Details |
|-------|---------|
| **Role** | Employee with most modules enabled |
| **Tech-Savviness** | Low–Medium |
| **Primary Tasks** | Clock in/out, view personal logs, log inventory, manage customer orders |
| **Pain Points** | No easy way to track own hours, has to ask admin for payout info |
| **Goals** | Simple clock-in button, self-service payout history, downloadable receipts |

#### Persona 3: Restricted Employee

| Field | Details |
|-------|---------|
| **Role** | Employee with minimal modules enabled |
| **Tech-Savviness** | Low |
| **Primary Tasks** | Clock in/out and view own payouts only |
| **Pain Points** | Confused by complex interfaces with irrelevant modules |
| **Goals** | Clean, minimal interface showing only what is relevant to them |

### 4.2 User Role Permissions Matrix

| Module | Admin | User (Enabled) | User (Disabled) |
|--------|:-----:|:--------------:|:---------------:|
| Dashboard (live stats) | ✅ Full access | — Not available | — Not available |
| Employee Management | ✅ Full CRUD | — Not available | — Not available |
| Attendance | ✅ All employees + manual logs | ✅ Own records only | ❌ Hidden |
| Payouts | ✅ Create + manage all | ✅ View own only | ❌ Hidden |
| Inventory | ✅ CRUD + activity logs | ✅ CRUD only | ❌ Hidden |
| Expenses | ✅ Full access | ✅ Full access | ❌ Hidden |
| Walk-In Customers | ✅ Full access | ✅ Full access | ❌ Hidden |
| Ring Customers | ✅ Full access | ✅ Full access | ❌ Hidden |
| Containers | ✅ Full access | ✅ Full access | ❌ Hidden |
| Settings / Profile | ✅ All settings | ✅ Own profile | ✅ Own profile |

> **Note:** Module visibility is controlled by per-user feature flags:
> `isInventoryEnabled` · `isPayoutEnabled` · `isExpenseEnabled` · `isWalkInCustomerEnabled` · `isRingCustomerEnabled` · `isContainerEnabled` · `isClockInClockOutEnabled`

### 4.3 Secondary Users

- **Accountants / Finance reviewers** — Read-only access to expense and payout data (future phase)
- **Warehouse staff** — Dedicated inventory-only access (future feature flag combination)
- **Customer service** — Walk-in and ring customer modules only (future)

---

## 5. Product Vision & Design Philosophy

### 5.1 Brand Identity

**Name:** OpsPilot

**Visual Tagline:** *Precision tools for daily operations*

**Brand Personality:**

| Dimension | Description |
|-----------|-------------|
| Personality | Precise, professional, calm confidence — built for daily power users |
| Emotional Tone | Neutral and informative (data), direct and helpful (errors), quiet satisfaction (success) |
| Visual Intent | Data density without clutter — every visual element earns its place |
| Must Feel Like | Fast, capable, organized, reliable |
| Must Never Look Like | Gamified, consumer-app-y, cluttered, experimental, corporate-cold |

### 5.2 Design Principles

1. **Data density without clutter** — Tables, forms, and lists carry the majority of content. Spacing must be generous enough to read quickly but tight enough to show more data per screen.

2. **One primary action per view** — Every page has one clear primary CTA. Nothing competes for attention.

3. **Dark mode is first-class** — Every component is designed simultaneously for both modes. No afterthought dark styling.

4. **Consistency over cleverness** — A status badge in the attendance table looks identical to a status badge in the payout table. Users learn once, apply everywhere.

5. **Functional hierarchy, not decorative** — Bold means important. Color means state. Size means hierarchy. None are used for decoration.

### 5.3 Design System Summary

| Category | Value | Usage |
|----------|-------|-------|
| Font | `DM Sans` (UI) · `JetBrains Mono` (IDs/codes) | All text — data precision |
| Icon Library | Lucide React — outline only | 16/20/24px, inherits text color |
| Dark Mode | Class-based `.dark` on `<html>` | First-class, not optional |
| Primary (Light) | `#D4AF37` (gold) | CTAs, nav active, focus rings |
| Primary (Dark) | `#D4AF37` (gold) | CTAs, nav active, focus rings |
| Background (Light) | `#FDFBD4` (warm cream) | App background |
| Background (Dark) | `#121212` (near-black) | App background |
| Spacing Base | 8px system | All spacing multiples of 4px |
| Max Content Width | 1280px | Centered layout |
| Border Radius | `sm:4px · md:6px · lg:8px · xl:12px · 2xl:16px` | Defined scale — no exceptions |
| Animation Duration | 150–200ms ease-out | No bounce, no spring |
| Accessibility | WCAG 2.1 AA minimum | 4.5:1 contrast, 44px touch targets |

> 📄 Full brand and design specifications are documented in `BRAND_DESIGN_GUIDELINES.md` — that document is the **final authority** for all UI decisions.

---

## 6. Feature Requirements

### 6.1 Core Features — Must-Have for MVP

The platform consists of **11 functional modules** plus a core authentication and shell layer. All modules must support full dark/light mode, skeleton loading states, error boundaries, and role-based visibility.

---

#### 6.1.1 Authentication & Session Management

**Description:** Secure JWT-based authentication with 3-step forgot password flow and complete session lifecycle management.

**Requirements:**

- Email and password login via `POST /auth/login`
- Session restore on page refresh via `GET /user` on app mount
- Forgot password 3-step flow: Send OTP → Verify OTP → Reset Password
- Authenticated change password via `POST /auth/change-password`
- Logout clears all tokens and redirects to `/login`
- Axios interceptor attaches `Authorization: Bearer <token>` to all protected requests
- `returnUrl` query param preserves intended destination through login flow

**Route Guards:**

| Guard | Behavior |
|-------|----------|
| `AuthRoute` | Unauthenticated → `/login?returnUrl=<intended>` |
| `AdminRoute` | Non-admin → `/attendance` |
| `GuestRoute` | Authenticated → `/dashboard` |

**Acceptance Criteria:**

- [ ] Login form submits credentials and stores `accessToken` in localStorage
- [ ] Page refresh restores auth state without flash of login screen
- [ ] Forgot password 3-step flow completes end-to-end
- [ ] Theme preference persists across sessions
- [ ] `npm run build` succeeds with zero TypeScript errors

---

#### 6.1.2 Employee Management *(Admin Only)*

**Description:** Full CRUD for employee accounts including feature flag configuration per employee.

**Requirements:**

- List employees with search (name/email) and filter (role, status)
- Create employee with full form including feature flags checkbox grid
- Edit employee — pre-fills all fields; password field hidden on edit
- Status toggle with **optimistic UI** (updates instantly, reverts on error)
- Delete employee with `DeleteConfirmModal` confirmation
- Feature flags per employee: `isInventoryEnabled`, `isPayoutEnabled`, `isExpenseEnabled`, `isWalkInCustomerEnabled`, `isRingCustomerEnabled`, `isContainerEnabled`, `isClockInClockOutEnabled`

**Employee Form Fields:**

| Field | Type | Required | Validation |
|-------|------|:--------:|------------|
| Full Name | Text | ✅ | Min 2 chars |
| Email | Email | ❌ | Valid format |
| Country Code | Select | ❌ | From countries list |
| Phone | Text | ❌ | Numeric |
| Password | Password | ✅ create / ❌ edit | Min 8 chars |
| Role | Select | ✅ | `admin` \| `user` |
| Language | Select | ✅ | `en` \| `ar` \| ... |
| Timezone | Select | ❌ | Timezone list |
| Price Unit | Select | ✅ | `$` \| `€` \| `£` |
| Per Hour Rate | Number | ❌ | ≥ 0, 2 decimal |
| Feature Flags | Checkboxes | ❌ | Boolean group |

**Acceptance Criteria:**

- [ ] Employee list with search, role filter, and status filter
- [ ] Create form validates all required fields with Zod
- [ ] Edit form pre-fills all existing values
- [ ] Status toggle shows instant optimistic UI update
- [ ] Delete requires `DeleteConfirmModal` with employee name
- [ ] Feature flags are editable in both create and edit forms
- [ ] Admin-only — regular users cannot access `/employees`

---

#### 6.1.3 Attendance Module

**Description:** Clock-in/out tracking for employees; admin tools for viewing all logs, timestamps grid, and manual entries.

**Requirements:**

- Clock button queries current status on mount via `POST /attendance/check-status`
- Clock In/Out action via `POST /attendance/clock-in-clock-out`
- Live elapsed timer (`setInterval`) while user is clocked in
- Employee sees own logs with calculated duration (`HH:mm`)
- Admin can switch between all employees via dropdown
- Admin: weekly timestamps grid — hours per day per employee
- Admin: add manual log entry (employee, date, clock-in, optional clock-out)
- Admin: delete individual log entries

**Clock Button States:**

```
STATE: CLOCKED OUT          STATE: CLOCKED IN
┌─────────────────┐        ┌─────────────────┐
│                 │        │  ● LIVE         │
│   ▶ CLOCK IN    │        │  02:34:17       │
│                 │        │  ■ CLOCK OUT    │
└─────────────────┘        └─────────────────┘
bg: #D4AF37 (gold)     bg: #C0392B (danger)
```

**Timestamps Grid Color Coding:**

| Hours | Color |
|-------|-------|
| ≥ 8h | `text-green-600 dark:text-green-400` |
| 4h–8h | `text-yellow-600 dark:text-yellow-400` |
| < 4h | `text-red-600 dark:text-red-400` |
| Absent | `text-[#9A9A9A]` |

**Acceptance Criteria:**

- [ ] Clock button accurately reflects current state on page load
- [ ] Live timer counts up while user is clocked in
- [ ] Duration calculated as difference between checkedIn and checkedOut timestamps
- [ ] Admin timestamps grid shows correct hours per day per employee
- [ ] Manual log entry modal accepts all required fields
- [ ] Module hidden when `isClockInClockOutEnabled === false`

---

#### 6.1.4 Payout Module

**Description:** Employee salary payout creation, loan management, and PDF receipt generation.

**Requirements:**

- Admin creates payout for any active employee
- Loan amount auto-populates from `employee.loanAmount`
- `AddLoanModal` adds to employee loan balance without creating a payout
- Paid / Unpaid status badge shown in table
- PDF receipt via `POST /payout/download-payout-receipt` — opens in new tab
- Employee self-view shows own payout history only

**Payout Form Fields:**

| Field | Type | Notes |
|-------|------|-------|
| Employee | Select | Active employees only |
| Amount | Number | Gross payout amount |
| Loan Deduction | Number | Auto-filled from `employee.loanAmount` |
| Paid Amount | Number | Net after loan deduction |
| Is Paid | Toggle | Mark as settled |
| Signature | Text/File | Optional |

**Acceptance Criteria:**

- [ ] Loan amount auto-populated from employee record
- [ ] `AddLoanModal` updates loan balance without creating payout
- [ ] Paid/Unpaid badge uses defined badge color map
- [ ] PDF receipt download works and opens in new tab
- [ ] Employee self-view shows only their own records
- [ ] Module hidden when `isPayoutEnabled === false`

---

#### 6.1.5 Inventory Module

**Description:** Daily tire and bale stock count management with full activity audit log.

**Requirements:**

- Daily stock snapshot: Car Tires, Truck Tires, Mixed Tires, Bales (all decimal)
- CRUD with delete requiring confirmation modal
- Stock summary cards showing current totals at top of list
- Every create/update/delete generates an activity log entry: `ADDED` / `UPDATED` / `DELETED`
- Unread log count badge in sidebar nav for admins
- Admin marks logs as read via `PUT /inventory/activity-log/read`

**Activity Log Badge Colors:**

| Type | Badge Color |
|------|-------------|
| `ADDED` | Green |
| `UPDATED` | Blue |
| `DELETED` | Red |

**Acceptance Criteria:**

- [ ] List sorted by date descending with stock summary cards at top
- [ ] Form validates non-negative decimal values
- [ ] Activity log shows who changed what and when
- [ ] Unread count badge updates when new logs arrive
- [ ] Admin can mark individual or all logs as read
- [ ] Module hidden when `isInventoryEnabled === false`

---

#### 6.1.6 Expense Module

**Description:** Business expense tracking with vendor history, type classification, and monthly summaries.

**Requirements:**

- CRUD for expense records
- Vendor name autocomplete from `GET /expense/vendor-names` — free-text still allowed
- Expense type enum displayed as distinct colored badges
- Monthly summary card showing current month total
- Date range filter to narrow list
- Sortable by date, vendor name, and total amount

**Acceptance Criteria:**

- [ ] Vendor autocomplete fetches from API
- [ ] Expense type shown as distinct colored badge per category
- [ ] Monthly summary card updates on new entries
- [ ] Date range filter narrows list correctly
- [ ] Module hidden when `isExpenseEnabled === false`

---

#### 6.1.7 Walk-In Customer Module

**Description:** Walk-in sales tracking for car tires, truck tires, and rims with auto-calculated totals, bulk status updates, and invoice PDF.

**Requirements:**

- Form: Car tires, truck tires, rims — each with count and per-unit price
- **Auto-total:** `(carCount × carPrice) + (truckCount × truckPrice) + (rimsCount × rimsPrice)`
- Customer name autocomplete from `GET /customer-names`
- Status filter: All / Pending / Paid / Cancelled
- Bulk status update: select multiple rows → apply new status
- Invoice PDF via `GET /download-invoice` — opens in new tab

**Acceptance Criteria:**

- [ ] `totalAmount` recalculates in real-time as user enters counts and prices
- [ ] Bulk status update selects rows via checkboxes and applies status
- [ ] Invoice PDF opens in new browser tab
- [ ] Module hidden when `isWalkInCustomerEnabled === false`

---

#### 6.1.8 Ring Customer Module

**Description:** Ring order management with auto-calculated totals and delivery tracking.

**Requirements:**

- Form: Customer name, ordered ring count, price per ring, delivery fee
- **Auto-total:** `(orderedRingCount × price) + deliveryFee`
- Status: `pending` | `delivered` | `cancelled`
- Date range filter on list

**Acceptance Criteria:**

- [ ] Total auto-calculates on count/price/delivery fee change
- [ ] Status badges use distinct colors per status
- [ ] Module hidden when `isRingCustomerEnabled === false`

---

#### 6.1.9 Container Module

**Description:** Shipping container management with ETD/ETA dates, overdue detection, status timeline, and document management.

**Requirements:**

- Form: Booking number, container count, avg weight (kg), loading date, ETD date, ETA date, status
- Status values: `loading` → `shipped` → `arrived` · `delayed` (special state)
- Visual timeline component shows current position in the status flow
- ETD/ETA dates highlighted red when past due and status is not `arrived`
- Booking number autocomplete from `GET /container/booking-numbers`
- Container detail page lists attached documents with download links

**Status Timeline:**

```
[ Loading ] ──►──── [ Shipped ] ──►──── [ Arrived ]
    ●                    ○                    ○
  Current               Next               Complete
```

**Acceptance Criteria:**

- [ ] Status timeline visual reflects current status accurately
- [ ] Overdue ETD/ETA shows red highlight when applicable
- [ ] Documents listed and downloadable on detail page
- [ ] Module hidden when `isContainerEnabled === false`

---

#### 6.1.10 Admin Dashboard

**Description:** Admin-only landing page with live stats, charts, and quick-action widgets loaded from `GET /admin/dashboard`.

**Dashboard Grid:**

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  👥 Employees│ 🕐 Today     │ 📦 Inventory │ 💰 Expenses  │
│  Total: 12  │ Clocked: 8  │ Tires: 450  │ Month: $2.4k│
└─────────────┴─────────────┴─────────────┴─────────────┘
┌────────────────────────────┬────────────────────────────┐
│  📈 Weekly Attendance       │  📉 Monthly Expenses        │
│  [Recharts BarChart]        │  [Recharts LineChart]       │
└────────────────────────────┴────────────────────────────┘
┌────────────────────────────┬────────────────────────────┐
│  🕐 Today's Attendance      │  🔔 Recent Inventory Logs   │
│  [Mini table: name/time]    │  [Last 5 log entries]       │
└────────────────────────────┴────────────────────────────┘
```

**Acceptance Criteria:**

- [ ] All 4 stats cards display correct values from API
- [ ] Skeleton loaders shown during initial data fetch
- [ ] Charts render and adapt colors to dark mode
- [ ] Admin-only access — non-admins redirected by `AdminRoute`

---

### 6.2 Secondary Features — Phase 2

- Advanced analytics with custom date range reports and Excel/PDF export
- Bulk import — employee data and inventory via CSV upload
- Push notifications for attendance reminders and inventory low-stock alerts
- Native mobile app (React Native) with push notifications
- Two-factor authentication (TOTP or SMS)
- Audit log viewer for admins — all system-level changes with user attribution
- Multi-currency support beyond $, €, £
- Dark mode scheduled toggle (auto-switch at sunset)

---

## 7. User Journeys & Workflows

### 7.1 New User (Admin Setup) Journey

**Goal:** Admin sets up the system and onboards first employee

1. **First Login** → Admin logs in with credentials set up during backend deployment
2. **Dashboard** → Reviews live stats (empty initially) and quick-action shortcuts
3. **Create Employee** → Navigates to Employees → Create → fills form with feature flags
4. **Configure Modules** → Checks relevant feature flags for the employee's role
5. **Employee Onboarding** → Employee receives credentials, logs in, is directed to Attendance page
6. **First Clock-In** → Employee clicks Clock In → timer starts

### 7.2 Admin Daily Workflow

**Goal:** Admin reviews and manages daily operations

1. Logs in → session restored via `GET /user` on mount
2. **Dashboard** → scans live stats (attendance, inventory, expenses)
3. **Attendance** → reviews today's clock-ins, adds manual entry if needed
4. **Inventory** → creates today's stock entry, reviews unread activity logs
5. **Expenses** → adds new vendor expenses, checks monthly totals
6. **Payouts** → creates payout for employee — loan deduction auto-fills — PDF generated
7. **Containers** → checks ETD/ETA for overdue shipments, updates statuses
8. **Walk-In / Ring** → reviews recent customer orders, updates statuses

### 7.3 Employee Daily Workflow

**Goal:** Employee completes daily attendance and work tasks

1. Logs in → redirected to Attendance page (non-admin default)
2. Clicks **Clock In** → timer starts, button turns red
3. Works throughout the day — timer counts up in real-time
4. Clicks **Clock Out** → duration calculated and stored
5. Views personal log → today's entry with check-in/check-out and hours
6. Navigates to **Payouts** → views payout history, downloads PDF receipt
7. Uses enabled modules (Inventory, Walk-In, etc.) as needed

### 7.4 Session Restore Flow

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

### 7.5 Feature Flag Check Flow

```
User navigates to /inventory
    │
    ▼
AuthRoute → authenticated? → YES
    │
    ▼
AppLayout renders Sidebar
    │
    ├─ user.isInventoryEnabled === true  → Show Inventory nav item
    └─ user.isInventoryEnabled === false → Hide Inventory nav item
    │
    ▼
Route renders InventoryList
    │
    ├─ Feature flag check passed  → Render page
    └─ Feature flag check failed  → Redirect to /attendance
```

---

## 8. Functional Requirements by Module

### 8.1 API Endpoint Reference

| Module | Method | Endpoint | Auth |
|--------|:------:|----------|:----:|
| **Auth** | POST | `/auth/login` | Public |
| **Auth** | POST | `/auth/forgot-password/send-otp` | Public |
| **Auth** | POST | `/auth/forgot-password/verify-otp` | Public |
| **Auth** | POST | `/auth/reset-password` | Public |
| **Auth** | POST | `/auth/logout` | 🔒 Bearer |
| **Auth** | POST | `/auth/change-password` | 🔒 Bearer |
| **Auth** | GET | `/user` | 🔒 Bearer |
| **Employees** | GET | `/employee` | 🔒 Admin |
| **Employees** | POST | `/employee` | 🔒 Admin |
| **Employees** | PUT | `/employee/:uid` | 🔒 Admin |
| **Employees** | PATCH | `/employee/:uid/status` | 🔒 Admin |
| **Employees** | DELETE | `/employee/:uid` | 🔒 Admin |
| **Attendance** | POST | `/attendance/check-status` | 🔒 Bearer |
| **Attendance** | POST | `/attendance/clock-in-clock-out` | 🔒 Bearer |
| **Attendance** | GET | `/attendance/logs` | 🔒 Bearer |
| **Attendance** | GET | `/attendance/logs/today` | 🔒 Admin |
| **Attendance** | GET | `/attendance/timestamps` | 🔒 Admin |
| **Attendance** | POST | `/attendance/log` | 🔒 Admin |
| **Attendance** | DELETE | `/attendance/logs` | 🔒 Admin |
| **Payouts** | POST | `/payout` | 🔒 Admin |
| **Payouts** | POST | `/payout/add-loan` | 🔒 Admin |
| **Payouts** | POST | `/payout/download-payout-receipt` | 🔒 Bearer |
| **Payouts** | GET | `/payouts/self-payouts` | 🔒 Bearer |
| **Payouts** | GET | `/payouts/all-payouts` | 🔒 Admin |
| **Inventory** | POST | `/inventory` | 🔒 Bearer |
| **Inventory** | GET | `/inventory` | 🔒 Bearer |
| **Inventory** | PUT | `/inventory/:iId` | 🔒 Bearer |
| **Inventory** | DELETE | `/inventory/:iId` | 🔒 Bearer |
| **Inventory** | GET | `/inventory/activity-logs` | 🔒 Admin |
| **Inventory** | PUT | `/inventory/activity-log/read` | 🔒 Admin |
| **Expenses** | POST | `/expense` | 🔒 Bearer |
| **Expenses** | GET | `/expenses` | 🔒 Bearer |
| **Expenses** | PUT | `/expense/:eId` | 🔒 Bearer |
| **Expenses** | DELETE | `/expense/:eId` | 🔒 Bearer |
| **Expenses** | GET | `/expense/vendor-names` | 🔒 Bearer |
| **Walk-In** | POST | `/walk-in-customer` | 🔒 Bearer |
| **Walk-In** | GET | `/walk-in-customers` | 🔒 Bearer |
| **Walk-In** | PUT | `/walk-in-customer/:wcId` | 🔒 Bearer |
| **Walk-In** | DELETE | `/walk-in-customer/:wcId` | 🔒 Bearer |
| **Walk-In** | PUT | `/walk-in-customers/status` | 🔒 Bearer |
| **Walk-In** | GET | `/walk-in-customer/customer-names` | 🔒 Bearer |
| **Walk-In** | GET | `/walk-in-customer/download-invoice` | 🔒 Bearer |
| **Ring** | POST | `/ring-customer` | 🔒 Bearer |
| **Ring** | GET | `/ring-customers` | 🔒 Bearer |
| **Ring** | PUT | `/ring-customer/:rcId` | 🔒 Bearer |
| **Ring** | DELETE | `/ring-customer/:rcId` | 🔒 Bearer |
| **Containers** | POST | `/container` | 🔒 Bearer |
| **Containers** | GET | `/containers` | 🔒 Bearer |
| **Containers** | PUT | `/container/:cId` | 🔒 Bearer |
| **Containers** | DELETE | `/container/:cId` | 🔒 Bearer |
| **Containers** | GET | `/container/booking-numbers` | 🔒 Bearer |
| **Dashboard** | GET | `/admin/dashboard` | 🔒 Admin |

### 8.2 Sidebar Navigation

```
OpsPilot
├── 📊 Dashboard                /dashboard      Admin only
├── 👥 Employees               /employees      Admin only
├── 🕐 Attendance              /attendance     All users
├── 💸 Payouts                 /payouts        isPayoutEnabled
├── 📦 Inventory               /inventory      isInventoryEnabled
├── 💰 Expenses                /expenses       isExpenseEnabled
├── 🛒 Walk-In Customers       /walk-in        isWalkInCustomerEnabled
├── 💍 Ring Customers          /ring           isRingCustomerEnabled
├── 🚢 Containers              /containers     isContainerEnabled
└── ⚙️  Settings               /settings       All users
```

### 8.3 Core UI Components

| Component | Props / Variants | Required States |
|-----------|-----------------|-----------------|
| `Button` | `primary, secondary, ghost, danger` · `sm, md, lg` | default, hover, active, focus, disabled, loading |
| `Input` | `default, error` · `icon-left, icon-right` | default, focus, error, disabled |
| `StatusBadge` | `status, colorMap` | static display |
| `DataTable` | `columns, data, sortable` | loading (skeleton), empty, error |
| `SkeletonLoader` | `variant: table \| card \| form` | pulse animation |
| `ErrorBoundary` | `fallback?` | error + retry button |
| `EmptyState` | `title, description, action?` | no-data only |
| `ConfirmModal` | `title, message, onConfirm` | open, loading, closed |
| `PageHeader` | `title, breadcrumbs, action?` | static display |
| `Pagination` | `page, total, onChange` | active, first/last disabled |
| `ThemeToggle` | — | light, dark, persisted |
| `ClockButton` | `status: 'in' \| 'out'` | clocked-in, clocked-out, loading |

---

## 9. Technical Architecture

### 9.1 Technology Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Build Tool | Vite | 5.x | Dev server, HMR, bundle optimization |
| Framework | React | 18.x | UI component library |
| Language | TypeScript | 5.x | Type safety, strict mode |
| State Management | Redux Toolkit | 2.x | Global state, async thunks |
| Routing | React Router | v6 | Client-side navigation, guards |
| HTTP Client | Axios | 1.x | API calls, Bearer token interceptor |
| Styling | Tailwind CSS | v4 | Utility-first, class-based dark mode |
| Forms | React Hook Form + Zod | 7.x + 3.x | Form state + schema validation |
| Icons | Lucide React | latest | Outline icon library |
| Charts | Recharts | 2.x | Dashboard BarChart + LineChart |
| Date Utilities | date-fns | 3.x | Formatting and calculations |
| Toasts | Sonner | latest | Non-blocking notifications |
| Testing | Vitest | latest | Unit and integration tests |

### 9.2 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  Browser                                                │
│  ┌───────────────────────────────────────────────────┐  │
│  │  React 18 + TypeScript                           │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌───────────┐ │  │
│  │  │ Redux Store│  │React Router │  │ Tailwind  │ │  │
│  │  │ (RTK)      │  │ v6 Guards   │  │ CSS v4    │ │  │
│  │  └─────┬──────┘  └─────────────┘  └───────────┘ │  │
│  │        │                                         │  │
│  │  ┌─────▼──────────────────────────┐             │  │
│  │  │  Axios Instance                │             │  │
│  │  │  + Bearer Token Interceptor    │             │  │
│  │  └─────────────┬──────────────────┘             │  │
│  └────────────────│──────────────────────────────── ┘  │
└───────────────────│─────────────────────────────────────┘
                    │
                    ▼ HTTP / HTTPS
┌─────────────────────────────────────────────────────────┐
│  Backend API — http://localhost:3001                    │
│  Node.js + Express · JWT Auth · PostgreSQL              │
└─────────────────────────────────────────────────────────┘
```

### 9.3 Redux Store Architecture

| Slice | Key State | Key Thunks |
|-------|-----------|------------|
| `auth` | `user, accessToken, isAuthenticated, loading, fpStep` | `loginThunk, getMeThunk, logoutThunk, sendOtpThunk, verifyOtpThunk, resetPasswordThunk` |
| `employees` | `list[], selectedEmployee, loading` | `fetchEmployeesThunk, createEmployeeThunk, toggleStatusThunk, deleteEmployeeThunk` |
| `attendance` | `clockStatus, logs[], timestamps[], todayLogs[]` | `checkStatusThunk, clockInOutThunk, fetchLogsThunk, fetchTimestampsThunk, addManualLogThunk` |
| `payouts` | `list[], loading` | `fetchPayoutsThunk, createPayoutThunk, addLoanThunk, downloadReceiptThunk` |
| `inventory` | `list[], activityLogs[], unreadCount` | `fetchInventoryThunk, createInventoryThunk, fetchActivityLogsThunk, markReadThunk` |
| `expenses` | `list[], vendorNames[]` | `fetchExpensesThunk, createExpenseThunk, fetchVendorNamesThunk` |
| `walkInCustomers` | `list[], customerNames[]` | `fetchCustomersThunk, createCustomerThunk, bulkUpdateStatusThunk, downloadInvoiceThunk` |
| `ringCustomers` | `list[], loading` | `fetchRingCustomersThunk, createRingCustomerThunk` |
| `containers` | `list[], bookingNumbers[]` | `fetchContainersThunk, createContainerThunk` |
| `dashboard` | `data, loading, error` | `fetchDashboardThunk` |

### 9.4 File Structure

```
client/
├── src/
│   ├── api/                          # HTTP service modules per feature
│   ├── components/
│   │   ├── common/                   # Shared reusable components
│   │   ├── guards/                   # AuthRoute, AdminRoute, GuestRoute
│   │   ├── layout/                   # AppLayout, Sidebar, Topbar, Breadcrumb
│   │   ├── ui/                       # Button, Input, Spinner, ThemeToggle
│   │   ├── dashboard/
│   │   ├── employees/
│   │   ├── attendance/
│   │   ├── payouts/
│   │   ├── inventory/
│   │   ├── expenses/
│   │   ├── walkInCustomers/
│   │   ├── ringCustomers/
│   │   └── containers/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useRedux.ts
│   │   └── useTheme.ts
│   ├── pages/
│   │   ├── auth/                     # Login, ForgotPassword, ChangePassword
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
│   ├── store/
│   │   ├── auth/                     # slice + thunk + types
│   │   ├── [module]/                 # slice + thunk + types per module
│   │   ├── rootReducer.ts
│   │   └── store.ts
│   ├── styles/
│   │   └── globals.css               # CSS custom properties — full token set
│   ├── utils/
│   │   ├── axiosInstance.ts
│   │   ├── formatters.ts
│   │   ├── routes.ts
│   │   └── validators.ts
│   ├── App.tsx
│   └── main.tsx
├── .env
├── tailwind.config.ts
├── tsconfig.app.json
├── vite.config.ts
└── package.json
```

---

## 10. Database Schema

### 10.1 Core Tables

| Table | Key Fields | Frontend Slice | Phase |
|-------|-----------|----------------|:-----:|
| `users` | `id, uid, fullName, email, role, isActive, perHourRate, loanAmount, priceUnit, isInventoryEnabled, isPayoutEnabled, isExpenseEnabled, isWalkInCustomerEnabled, isRingCustomerEnabled, isContainerEnabled, isClockInClockOutEnabled` | `auth + employees` | FE-01, FE-04 |
| `access_tokens` | `token, userId, expiresAt` | `auth` | FE-01 |
| `refresh_tokens` | `token, userId` | `auth` | FE-01 |
| `user_logs` | `id, userId, checkedIn, checkedOut` | `attendance` | FE-05 |
| `payout` | `id, userId, amount, loanDeduction, paidAmount, isPaid, signatureUrl` | `payouts` | FE-06 |
| `inventories` | `id, inventoryDate, carTiresCount, truckTiresCount, mixedTiresCount, bales` | `inventory` | FE-07 |
| `inventory_logs` | `id, inventoryId, userId, activityLogType, isRead` | `inventory` | FE-07 |
| `expenses` | `id, userId, expenseDate, vendorName, expenseType, description, totalExpense` | `expenses` | FE-08 |
| `walk_in_customers` | `id, customerDate, customerName, status, carTiresCount, carTiresPrice, truckTiresCount, truckTiresPrice, rimsCount, rimsPrice, totalAmount` | `walkInCustomers` | FE-09 |
| `ring_customers` | `id, ringCustomerDate, customerName, orderedRingCount, price, deliveryFee, totalAmount, status` | `ringCustomers` | FE-10 |
| `containers` | `id, bookingNumber, containerCount, avgWeight, loadingDate, etd, eta, status` | `containers` | FE-11 |
| `container_documents` | `id, containerId, documentUrl, documentType, documentName` | `containers` | FE-11 |
| `countries` | `id, name, dialCode, code` | shared util | FE-01 |

### 10.2 Key Relationships

- `users` → `user_logs` (1:N) — one employee has many attendance logs
- `users` → `payout` (1:N) — one employee has many payouts
- `users` → `inventory_logs` (1:N) — one user generates many activity log entries
- `inventories` → `inventory_logs` (1:N) — one inventory record has many log entries
- `containers` → `container_documents` (1:N) — one container has many documents
- `users` → `expenses` (1:N) — one user creates many expenses

---

## 11. Security Requirements

### 11.1 Authentication Security

| Requirement | Implementation |
|-------------|---------------|
| Token storage | `accessToken` in `localStorage`; attached via Axios interceptor |
| Token expiry | 401 response triggers automatic logout and redirect to `/login` |
| Route protection | `AuthRoute`, `AdminRoute`, `GuestRoute` guards on all routes |
| Password | Min 8 characters; bcrypt hashed server-side |
| Session management | Managed server-side; client detects 401 and clears session |
| returnUrl | Preserved in `?returnUrl=` query param through login redirect |

### 11.2 Data Security

- HTTPS for all API calls (HTTP for `localhost:3001` in development only)
- All form inputs validated client-side with Zod AND server-side before persistence
- Profile images: JPG/PNG only, max 5MB, validated server-side
- **Role enforcement is server-side** — client-side guards are UX convenience only
- Feature flags are checked server-side on all data endpoints

### 11.3 Input Validation

- All forms use `react-hook-form` with `zod` resolver
- Error messages shown inline below each field
- No raw HTML injection — all user content sanitized
- File upload types restricted by MIME type, not extension only

### 11.4 Privacy & Compliance

- No personally identifiable information stored in localStorage beyond the access token
- Employee contact info (phone, email) shown only to admins
- Data deletion handled server-side on employee delete
- GDPR-compliant data handling on backend

---

## 12. Performance Requirements

### 12.1 Page Load Targets

| Page | Target | Strategy |
|------|--------|---------|
| Initial app load | < 3 seconds | React.lazy + Suspense code splitting |
| Route navigation | < 1 second | Pre-loaded Redux state, skeleton loaders |
| Dashboard | < 2.5 seconds | Skeleton loaders, parallel data fetching |
| Search results | < 500ms | Client-side filtering with Redux selectors |
| Form submission | < 500ms feedback | Optimistic UI where applicable |

### 12.2 API Performance

| Request Type | Target | Notes |
|-------------|--------|-------|
| GET requests | < 200ms average | Backend caching for frequently read data |
| POST requests | < 500ms | Form submission feedback |
| PDF generation | < 3 seconds | Show loading state on button |
| File uploads | < 5 seconds | Progress indicator |

### 12.3 Bundle Optimization

```typescript
// Every page must be lazy-loaded
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));
const EmployeeList   = lazy(() => import('./pages/employees/EmployeeList'));
// ... all page imports

// Target bundle sizes (gzip)
// Entry chunk:        < 50KB
// Largest lazy chunk: < 200KB
// Total app bundle:   < 1MB
```

### 12.4 Build Quality Gates

- [ ] `npm run build` — zero TypeScript errors (strict mode)
- [ ] `npm run lint` — zero ESLint warnings or errors
- [ ] All `console.log` statements removed
- [ ] No unused imports or variables
- [ ] Bundle analyzed — no unexpectedly large chunks

---

## 13. Development Phases

### Phase Overview

| Phase | Title | Priority | Depends On | Timeline |
|:-----:|-------|:--------:|-----------|:--------:|
| FE-01 | Project Setup & Auth UI | 🔴 CRITICAL | — | Week 1 |
| FE-02 | Auth Integration & App Shell | 🔴 CRITICAL | FE-01 | Week 2 |
| FE-03 | Admin Dashboard | 🟠 HIGH | FE-02 | Week 3 |
| FE-04 | Employee Management | 🟠 HIGH | FE-02 | Week 3–4 |
| FE-05 | Attendance Module | 🟠 HIGH | FE-02 | Week 4–5 |
| FE-06 | Payout Module | 🟠 HIGH | FE-05 | Week 5 |
| FE-07 | Inventory Module | 🟡 MEDIUM | FE-02 | Week 6 |
| FE-08 | Expense Module | 🟡 MEDIUM | FE-02 | Week 6 |
| FE-09 | Walk-In Customer Module | 🟡 MEDIUM | FE-02 | Week 7 |
| FE-10 | Ring Customer Module | 🟡 MEDIUM | FE-02 | Week 7 |
| FE-11 | Container Module | 🟡 MEDIUM | FE-02 | Week 8 |
| FE-12 | Polish, Dark Mode & Release | 🟠 HIGH | FE-01→FE-11 | Week 8–9 |

### Execution Order

```
FE-01 (Setup) → FE-02 (Shell) → ┬─ FE-03 (Dashboard)
                                  ├─ FE-04 (Employees)
                                  ├─ FE-05 (Attendance) → FE-06 (Payouts)
                                  ├─ FE-07 (Inventory)
                                  ├─ FE-08 (Expenses)
                                  ├─ FE-09 (Walk-In)
                                  ├─ FE-10 (Ring)
                                  └─ FE-11 (Containers)
                                          │
                                     All complete
                                          │
                                    FE-12 (Release)
```

### Phase FE-01: Project Setup & Auth UI

**Goal:** Bootstrap Vite + React + TypeScript, configure Tailwind with dark/light tokens, Redux store, Axios pointing to `:3001`, Login + Forgot Password UI

**Key Deliverables:**
- `vite.config.ts` with path aliases and proxy
- `tailwind.config.ts` with `darkMode: 'class'` and full token set
- `src/styles/globals.css` with CSS custom properties
- Redux store + `auth` slice with all types
- `axiosInstance.ts` with Bearer token interceptor
- `Login.tsx` — email + password, loading/error states
- `ForgotPassword.tsx` — 3-step OTP flow
- `Button.tsx`, `Input.tsx`, `Spinner.tsx`, `ThemeToggle.tsx`

**Acceptance Criteria:**
- [ ] `npm run dev` starts at `localhost:5173` with zero console errors
- [ ] Login submits to `POST /auth/login` and stores token
- [ ] Forgot Password 3-step flow works end-to-end
- [ ] Theme toggle persists preference
- [ ] `npm run build` — zero TypeScript errors

---

### Phase FE-02: Auth Integration & App Shell

**Goal:** Token persistence, app shell layout (Sidebar + Topbar), role-based route protection

**Key Deliverables:**
- `getMeThunk` — session restore on app mount
- `AppLayout.tsx` — Sidebar + Topbar + `<Outlet>`
- `Sidebar.tsx` — collapsible, role-aware, feature-flag-aware
- `Topbar.tsx` — user info, theme toggle, logout
- `AuthRoute`, `AdminRoute`, `GuestRoute` guards
- `returnUrl` preservation through login

**Acceptance Criteria:**
- [ ] Page refresh restores auth state without flash
- [ ] Sidebar shows correct items based on role and flags
- [ ] Admin-only routes redirect non-admins to `/attendance`
- [ ] Logout clears tokens and redirects to `/login`

---

### Phase FE-12: Polish, Dark Mode & Release

**Goal:** 100% dark mode coverage, skeleton loaders, error boundaries, bundle optimization, accessibility compliance

**Dark Mode Audit Checklist:**

| Element | Light | Dark |
|---------|-------|------|
| App background | `bg-[#FDFBD4]` | `dark:bg-[#121212]` |
| Cards / panels | `bg-white` | `dark:bg-[#1E1E1E]` |
| Modals | `bg-white shadow-xl border-[#E8E0B8]` | `dark:bg-[#1E1E1E] dark:border-[#2E2E2E]` |
| Table header | `bg-[#F5F0D0]` | `dark:bg-[#252525]` |
| Table row hover | `hover:bg-[#FDFBD4]` | `dark:hover:bg-[#252525]` |
| Input | `bg-white border-[#E8E0B8]` | `dark:bg-[#1E1E1E] dark:border-[#2E2E2E]` |
| Sidebar | `bg-white border-r-[#E8E0B8]` | `dark:bg-[#1E1E1E] dark:border-r-[#2E2E2E]` |
| Topbar | `bg-white border-b-[#E8E0B8]` | `dark:bg-[#1E1E1E] dark:border-b-[#2E2E2E]` |
| Active nav item | `bg-[#F0DFA0] border-l-[#D4AF37]` | `dark:bg-[#2A2200] dark:border-l-[#D4AF37]` |
| Primary button | `bg-[#D4AF37] hover:bg-[#CE8946]` | `dark:bg-[#D4AF37] dark:hover:bg-[#CE8946]` |
| Focus ring | `ring-[#D4AF37]` | `dark:ring-[#D4AF37]` |
| Status: Paid/Active | `bg-[#D4EDDA] text-[#2D7A4F]` | `dark:bg-green-900/20 dark:text-[#4CAF80]` |
| Status: Unpaid/Error | `bg-[#FADADD] text-[#C0392B]` | `dark:bg-red-900/20 dark:text-[#E05A4A]` |
| Status: Pending | `bg-[#FEF3CD] text-[#B8860B]` | `dark:bg-yellow-900/20 dark:text-[#D4A017]` |

**Final Release Checklist:**

```
Build & Quality
  [ ] npm run build — zero TypeScript errors
  [ ] npm run lint — zero ESLint warnings
  [ ] No console.log statements
  [ ] No unused imports

Functional
  [ ] All 12 phases tested end-to-end
  [ ] All feature flags respected
  [ ] All role restrictions verified
  [ ] All forms validate and submit correctly
  [ ] All PDF downloads work

UI/UX
  [ ] Dark mode consistent — zero hardcoded colors
  [ ] Skeleton loaders on every data-loading page
  [ ] Empty states for all no-data scenarios
  [ ] Error states with retry on all API-dependent pages
  [ ] Toast notifications for all CRUD actions
  [ ] All pages responsive

Performance
  [ ] All pages lazy-loaded via React.lazy
  [ ] Initial page load < 3s
  [ ] No unnecessary re-renders

Accessibility
  [ ] Keyboard navigation on all forms and modals
  [ ] aria-label on all icon-only buttons
  [ ] Focus indicators visible in both themes
  [ ] Color contrast ≥ 4.5:1 (WCAG 2.1 AA)
```

---

## 14. Success Metrics

### 14.1 Technical Quality KPIs

| KPI | Target | Measurement |
|-----|--------|-------------|
| TypeScript build errors | 0 | `npm run build` CI check |
| ESLint warnings | 0 | `npm run lint` CI check |
| Unit test coverage | ≥ 70% | Vitest coverage report |
| Page load time | < 3s (P95) | Lighthouse CI |
| Accessibility score | ≥ 90 | Lighthouse audit |
| Bundle size (gzip) | < 1MB total | Vite build stats |
| Dark mode coverage | 100% of components | Manual audit |

### 14.2 Feature Completeness Checklist

- [ ] All 12 phases (FE-01 → FE-12) delivered and passing acceptance criteria
- [ ] Every module respects its feature flag
- [ ] Every admin-only route correctly redirects non-admin users
- [ ] All forms have Zod validation with inline error display
- [ ] All delete actions require `ConfirmModal` confirmation
- [ ] All PDF downloads function correctly (payout receipt + walk-in invoice)
- [ ] Dark mode verified on every component and page
- [ ] Skeleton loaders on every data-fetching page
- [ ] Error states with retry on every API-dependent page
- [ ] Toast notifications for all create, update, delete, and error events
- [ ] Keyboard navigation functional on all modals and forms
- [ ] All icon-only buttons have `aria-label` attributes

### 14.3 User Satisfaction Targets

| Persona | Target Outcome |
|---------|---------------|
| Admin | Can complete full daily workflow in < 15 minutes |
| Employee | Can clock in/out in < 5 seconds from login |
| Operations Staff | Can log inventory entry in < 2 minutes |

---

## 15. Future Enhancements

### 15.1 Phase 2 Features

- **Native mobile app** (React Native) — employee clock-in/out via phone
- **Push notifications** — attendance reminders and inventory low-stock alerts
- **Advanced analytics** — custom date range reports, export to Excel/PDF
- **Biometric / QR check-in** — hardware integration for attendance
- **Multi-currency** — beyond `$`, `€`, `£`
- **Bulk import** — employee data and inventory via CSV upload
- **Two-factor authentication** — TOTP or SMS-based
- **Audit log viewer** — admin sees all system-level changes with user attribution

### 15.2 Architecture Evolution

- **WebSocket integration** — real-time attendance status updates on dashboard
- **Redis caching** — frequently read data (employee lists, dashboard stats)
- **API versioning** — non-breaking frontend/backend evolution strategy
- **Microservices split** — separate services for attendance, payouts, inventory
- **Multi-tenant architecture** — for white-label deployments
- **Service Worker** — offline access to recent data for employees

### 15.3 Business Expansion

- **White-label solution** — configurable branding for other businesses
- **Third-party integrations** — accounting software (QuickBooks, Xero), HRMS
- **Subscription tiers** — free tier with core features, paid tier with analytics
- **Partner API** — allow businesses to push data programmatically
- **Mobile app** — React Native with biometric clock-in

---

## 16. Glossary

| Term | Definition |
|------|-----------|
| **Feature Flag** | A boolean property on the `users` table that enables or disables a specific module for that employee. Example: `isInventoryEnabled = true` shows Inventory in the sidebar. |
| **Bearer Token** | The JWT access token stored in `localStorage` and attached to all protected API requests via the Axios interceptor in the `Authorization` header. |
| **Thunk** | A Redux Toolkit async action creator that handles API calls, dispatches loading/success/error states, and updates the Redux slice. |
| **Optimistic UI** | A UI pattern where the interface updates immediately on user interaction (e.g., status toggle) without waiting for the API response, reverting only on error. |
| **Activity Log** | A server-generated record of every inventory change (ADDED/UPDATED/DELETED), attributed to the user who made the change, with unread/read state for admins. |
| **Skeleton Loader** | A loading placeholder that mirrors the shape of actual content, shown while data is being fetched. Prevents layout shift and communicates loading state. |
| **Dark Mode (Class-based)** | Tailwind CSS dark mode activated by adding the `.dark` class to the `<html>` element, allowing full control independent of system preference. |
| **Clock In / Clock Out** | The attendance action recorded via `POST /attendance/clock-in-clock-out`. Duration = `checkedOut - checkedIn` timestamps. |
| **Loan Deduction** | An amount tracked in `user.loanAmount` that is automatically deducted when creating a payout, reducing the net paid amount. |
| **WCAG 2.1 AA** | Web Content Accessibility Guidelines version 2.1, Level AA — the minimum accessibility standard required for all UI components in this system. |
| **PRD** | Product Requirements Document — this document. Defines what the product does, for whom, how it works, and how it will be built and measured. |
| **DXA** | Document eXtension Attribute units used in DOCX generation. 1440 DXA = 1 inch. |
| **Zod** | A TypeScript-first schema validation library used for all form validation via `react-hook-form` resolver. |
| **RTK** | Redux Toolkit — the official, opinionated toolset for efficient Redux development with `createSlice`, `createAsyncThunk`, etc. |

---

## 17. Appendix

### 17.1 Related Documents

| Document | Description | Location |
|----------|-------------|---------|
| `MASTER_PHASE_PLAN.md` | Full overview of all 12 phases, execution order, file structure | `/docs/MASTER_PHASE_PLAN.md` |
| `BRAND_DESIGN_GUIDELINES.md` | **Final authority** for all UI/UX visual decisions | `/docs/BRAND_DESIGN_GUIDELINES.md` |
| `IMPLEMENTATION_PROGRESS.md` | AI-updated live status tracker per phase and task | `/docs/IMPLEMENTATION_PROGRESS.md` |
| `FE-01` → `FE-12` | Individual phase specification docs | `/docs/FE-XX_*.md` |

### 17.2 Environment Variables

```env
# .env
VITE_API_URL=http://localhost:3001

# .env.production
VITE_API_URL=https://api.yourdomain.com
```

### 17.3 NPM Scripts

```bash
npm run dev        # Start dev server at localhost:5173
npm run build      # Production build — must pass with zero TS errors
npm run lint       # ESLint check — must pass with zero warnings
npm run preview    # Preview production build locally
npm run test       # Run Vitest unit tests
npm run coverage   # Vitest with coverage report
```

### 17.4 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | February 2026 | Project Team | Initial draft |

---

<div align="center">

---

*This document is a living document and will be updated as the project evolves.*
*All changes should be tracked with version numbers and change logs.*

**OpsPilot PRD v1.0 · Internal Use Only · February 2026**

*For questions or clarifications, contact the project team.*

</div>
