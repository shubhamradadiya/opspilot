<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║   ██████╗ ██████╗  █████╗ ███╗   ██╗██████╗                               ║
║   ██╔══██╗██╔══██╗██╔══██╗████╗  ██║██╔══██╗                              ║
║   ██████╔╝██████╔╝███████║██╔██╗ ██║██║  ██║                              ║
║   ██╔══██╗██╔══██╗██╔══██║██║╚██╗██║██║  ██║                              ║
║   ██████╔╝██║  ██║██║  ██║██║ ╚████║██████╔╝                              ║
║   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝                               ║
║                                                                            ║
║          MANAGEMENT SYSTEM — BRAND & DESIGN GUIDELINES                    ║
║                    Single Source of Truth (SSOT)                          ║
║                                                                            ║
║   ⚠️  This document is FINAL AUTHORITY for all UI/UX decisions.           ║
║   Any conflict → choose the most restrictive rule in this document.       ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->

<div align="center">

# ⚙️ Brand & Design Guidelines

**Management System** &nbsp;·&nbsp; **SSOT v1.0**

> This document overrides all other design opinions.
> AI must never ask design questions — find the answer here.
> If something is undefined, apply the closest existing rule.

</div>

---

## ◈ Table of Contents

1. [Brand Identity](#-1-brand-identity)
2. [Design Philosophy](#-2-design-philosophy)
3. [Color System](#-3-color-system)
4. [Typography System](#-4-typography-system)
5. [Spacing & Layout](#-5-spacing--layout)
6. [Border, Radius & Elevation](#-6-border-radius--elevation)
7. [Component Rules](#-7-component-rules)
8. [Iconography](#-8-iconography)
9. [States & Variants](#-9-states--variants)
10. [Motion & Animation](#-10-motion--animation)
11. [Accessibility](#-11-accessibility)
12. [Tailwind CSS Mapping](#-12-tailwind-css-mapping)
13. [Dark Mode Rules](#-13-dark-mode-rules)
14. [Do & Don't Reference](#-14-do--dont-reference)
15. [AI Usage Instructions](#-15-ai-usage-instructions-final-authority)

---

## ◈ 1. Brand Identity

### Personality

This is an internal **operations management system** — used daily by admins and employees to manage attendance, payouts, inventory, customers, and containers. The brand must reflect the nature of the work: structured, dependable, and efficient.

```
MGMT System SHOULD feel like:       MGMT System MUST NEVER look like:
─────────────────────────────       ────────────────────────────────────
 ✓ Precise and professional          ✗ Consumer app (playful, gamified)
 ✓ Calm and focused                  ✗ Corporate-cold or sterile
 ✓ Fast and capable                  ✗ Experimental or trend-chasing
 ✓ Trustworthy and clear             ✗ Cluttered or dense
 ✓ Efficient without being cold      ✗ Overly flashy or animated
 ✓ Built for power users             ✗ Designed for first-time visitors
```

### Emotional Tone

| Context | Tone |
|---------|------|
| Dashboard & data | Neutral, informative, factual |
| Errors & alerts | Direct, non-alarming, helpful |
| Success states | Quiet satisfaction — not celebratory |
| Empty states | Encouraging, not apologetic |
| Loading states | Invisible effort — calm confidence |

### Visual Intent

The interface exists to **move information efficiently**, not to impress. Every visual decision must justify itself by making the user faster or clearer. If it doesn't serve that purpose, it doesn't belong.

---

## ◈ 2. Design Philosophy

### Hierarchy of Decisions

When making any visual decision, apply this order:

```
1. Does the rule exist in this document?  → Follow it exactly
2. Does a close rule apply?               → Apply the closest rule
3. Still unclear?                         → Ask before inventing
```

### Core Principles

**Data density without clutter**
Tables, forms, and lists carry the majority of this app's content. Spacing must be generous enough to read quickly but tight enough to show more data per screen.

**One primary action per view**
Every page has one clear primary CTA. Everything else is secondary or tertiary. Never compete for attention.

**Dark mode is first-class**
Dark mode is not an afterthought. Every component must be designed simultaneously for both modes. No exceptions.

**Consistency over cleverness**
The same type of data looks the same everywhere. A status badge in the attendance table looks identical to a status badge in the payout table. Users learn once, apply everywhere.

**Functional hierarchy, not decorative**
Visual weight communicates importance. Bold means important. Color means state. Size means hierarchy. None of these are used for decoration.

---

## ◈ 3. Color System

### Brand Palette — Core Colors

These 6 colors form the complete semantic palette. Nothing outside this set is permitted.

| Name | Light HEX | Dark HEX | Role |
|------|-----------|----------|------|
| **Primary** | `#1E40AF` | `#3B82F6` | CTAs, active nav, links, focus rings |
| **Success** | `#16A34A` | `#22C55E` | Confirmations, paid status, clocked-in |
| **Warning** | `#D97706` | `#F59E0B` | Alerts, pending status, overdue |
| **Danger** | `#DC2626` | `#EF4444` | Errors, delete actions, unpaid, clocked-out |
| **Purple** | `#7C3AED` | `#8B5CF6` | Admin-only indicators, charts accent |
| **Cyan** | `#0891B2` | `#06B6D4` | Info notices, secondary charts |

### Surface Palette — Light Mode

| Token | HEX | Tailwind | Usage |
|-------|-----|----------|-------|
| `bg-base` | `#F8FAFC` | `bg-slate-50` | App background |
| `bg-surface` | `#FFFFFF` | `bg-white` | Cards, panels |
| `bg-elevated` | `#FFFFFF` | `bg-white` | Modals, dropdowns |
| `bg-subtle` | `#F1F5F9` | `bg-slate-100` | Table header, inactive tabs |
| `text-primary` | `#0F172A` | `text-slate-900` | Primary text |
| `text-secondary` | `#475569` | `text-slate-600` | Supporting text |
| `text-muted` | `#94A3B8` | `text-slate-400` | Metadata, timestamps |
| `text-disabled` | `#CBD5E1` | `text-slate-300` | Disabled states |
| `border-default` | `#E2E8F0` | `border-slate-200` | Dividers, input borders |
| `border-strong` | `#CBD5E1` | `border-slate-300` | Cards, section dividers |

### Surface Palette — Dark Mode

| Token | HEX | Tailwind | Usage |
|-------|-----|----------|-------|
| `bg-base` | `#0F172A` | `dark:bg-slate-900` | App background |
| `bg-surface` | `#1E293B` | `dark:bg-slate-800` | Cards, panels |
| `bg-elevated` | `#334155` | `dark:bg-slate-700` | Modals, dropdowns |
| `bg-subtle` | `#1E293B` | `dark:bg-slate-800` | Table header |
| `text-primary` | `#F8FAFC` | `dark:text-slate-50` | Primary text |
| `text-secondary` | `#94A3B8` | `dark:text-slate-400` | Supporting text |
| `text-muted` | `#64748B` | `dark:text-slate-500` | Metadata |
| `text-disabled` | `#334155` | `dark:text-slate-700` | Disabled |
| `border-default` | `#334155` | `dark:border-slate-700` | Dividers |
| `border-strong` | `#475569` | `dark:border-slate-600` | Cards |

### Semantic Color Usage Rules

```
PRIMARY (#1E40AF / #3B82F6)
  ✓ Active sidebar nav item
  ✓ Primary buttons
  ✓ Links
  ✓ Focus ring outline
  ✓ Selected filter/tab
  ✗ Never used for text on colored background
  ✗ Never decorative

SUCCESS (#16A34A / #22C55E)
  ✓ "Paid" badge
  ✓ "Active" employee status
  ✓ "Clocked In" state
  ✓ "Arrived" container status
  ✓ Positive trend indicators
  ✗ Never for primary actions

WARNING (#D97706 / #F59E0B)
  ✓ "Pending" badge
  ✓ "Overdue" ETD/ETA
  ✓ Low inventory alerts
  ✓ Loan balance indicators
  ✗ Never for destructive actions

DANGER (#DC2626 / #EF4444)
  ✓ "Unpaid" badge
  ✓ "Inactive" employee
  ✓ Delete button
  ✓ Error messages
  ✓ "Clocked Out" clock button
  ✓ Negative trend indicators
  ✗ Never for warnings (use Warning color)

PURPLE (#7C3AED / #8B5CF6)
  ✓ Admin-only section indicators
  ✓ Secondary chart data
  ✓ "Admin" role badge
  ✗ Never for primary actions

CYAN (#0891B2 / #06B6D4)
  ✓ Information notices
  ✓ Third chart data series
  ✓ "Info" toast variant
  ✗ Never for status badges
```

### Color Interaction States

```
Hover:   +8% brightness  (Tailwind: use /90 opacity modifier)
Active:  -8% brightness  (Tailwind: use /80 opacity modifier)
Focus:   2px solid ring, primary color, 2px offset
Disabled: 40% opacity    (Tailwind: opacity-40 + cursor-not-allowed)
```

### Badge Color Map (Complete)

| Status | Light | Dark | Text |
|--------|-------|------|------|
| Active / Paid / Arrived / Delivered | `bg-green-100` | `dark:bg-green-900/30` | `text-green-700 dark:text-green-400` |
| Inactive / Unpaid / Cancelled | `bg-red-100` | `dark:bg-red-900/30` | `text-red-700 dark:text-red-400` |
| Pending / Loading / In Progress | `bg-yellow-100` | `dark:bg-yellow-900/30` | `text-yellow-700 dark:text-yellow-400` |
| Shipped / Processing | `bg-blue-100` | `dark:bg-blue-900/30` | `text-blue-700 dark:text-blue-400` |
| Admin role | `bg-purple-100` | `dark:bg-purple-900/30` | `text-purple-700 dark:text-purple-400` |
| User role | `bg-slate-100` | `dark:bg-slate-700` | `text-slate-600 dark:text-slate-300` |
| Delayed / Overdue | `bg-orange-100` | `dark:bg-orange-900/30` | `text-orange-700 dark:text-orange-400` |

---

## ◈ 4. Typography System

### Font Families

| Role | Font | Fallback |
|------|------|---------|
| Body / UI | `Inter` | `system-ui, sans-serif` |
| Numbers / Data | `Inter` | (same — Inter has excellent numerals) |
| Monospace (IDs, codes) | `JetBrains Mono` | `ui-monospace, monospace` |

> Poppins is **not used** in this project. Management interfaces require Inter's precision and data-readability over Poppins' rounded consumer feel.

### Type Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|------------|--------|-------|
| `text-xs` | 12px | 1.4 | 400 | Timestamps, helper text |
| `text-sm` | 14px | 1.5 | 400 / 500 | Table cells, labels, badges |
| `text-base` | 16px | 1.6 | 400 | Body text, form fields |
| `text-lg` | 18px | 1.5 | 500 / 600 | Card titles, section headers |
| `text-xl` | 20px | 1.4 | 600 | Page sub-headers |
| `text-2xl` | 24px | 1.3 | 600 / 700 | Page titles |
| `text-3xl` | 30px | 1.2 | 700 | Dashboard stat numbers |
| `text-4xl` | 36px | 1.1 | 700 | Large KPI display |

### Typography Rules

```
✓ Page title (h1):        text-2xl font-semibold text-slate-900 dark:text-slate-50
✓ Section header (h2):    text-xl font-semibold text-slate-800 dark:text-slate-100
✓ Card title (h3):        text-lg font-medium text-slate-800 dark:text-slate-100
✓ Table header:           text-xs font-semibold uppercase tracking-wider text-slate-500
✓ Table cell:             text-sm text-slate-700 dark:text-slate-300
✓ Form label:             text-sm font-medium text-slate-700 dark:text-slate-300
✓ Input text:             text-sm text-slate-900 dark:text-slate-50
✓ Helper / error text:    text-xs text-slate-500 (helper) | text-red-600 (error)
✓ Stat number (KPI):      text-3xl font-bold text-slate-900 dark:text-slate-50
✓ Monospace (IDs/codes):  font-mono text-sm text-slate-600 dark:text-slate-400
```

### Typography Don'ts

```
✗ Never use bold for body text emphasis (use color or weight change to medium)
✗ Never use accent/semantic colors on headings
✗ Never go below 12px for any visible text
✗ Never mix Inter and another font within a single component
✗ Never use text-transform: uppercase on body text
✗ Never center-align table data
```

---

## ◈ 5. Spacing & Layout

### Base Unit

**8px** — all spacing must be a multiple of 4px. The 8px system is preferred.

### Spacing Scale

```
4px   →  p-1, gap-1, m-1       (micro: icon padding, badge inner)
8px   →  p-2, gap-2, m-2       (tight: button icon gap, chip padding)
12px  →  p-3, gap-3, m-3       (compact: dense list items)
16px  →  p-4, gap-4, m-4       (base: standard element padding)
20px  →  p-5, gap-5, m-5       (card inner top/bottom)
24px  →  p-6, gap-6, m-6       (card padding, section spacing)
32px  →  p-8, gap-8, m-8       (between sections)
48px  →  p-12, gap-12, m-12    (page-level vertical spacing)
64px  →  p-16, gap-16, m-16    (hero areas, large section gaps)
```

### Page Layout

```
Max width:          1280px (max-w-7xl)
Content padding:    px-4 (mobile), px-6 (tablet), px-8 (desktop)
Sidebar width:      256px expanded, 64px collapsed
Topbar height:      64px (h-16)
Page header area:   pb-6 border-b
Content area:       pt-6
```

### Grid Rules

| Breakpoint | Columns | Gutter |
|-----------|---------|--------|
| Mobile `< 640px` | 1 | 16px |
| Tablet `640–1024px` | 2 | 24px |
| Desktop `1024–1280px` | 3–4 | 24px |
| Large `> 1280px` | 4–6 | 24px |

### Component-Specific Spacing

```
Table cell padding:        px-4 py-3 (standard), px-3 py-2 (compact)
Form group gap:            gap-4 (between fields), gap-6 (between sections)
Modal padding:             p-6
Card padding:              p-5 or p-6
Stats card padding:        p-6
Sidebar nav item:          px-3 py-2
Topbar inner:              px-4 or px-6, h-16
Badge padding:             px-2.5 py-0.5 (standard), px-2 py-0.5 (small)
Button padding:            px-4 py-2 (standard), px-3 py-1.5 (sm), px-6 py-3 (lg)
```

---

## ◈ 6. Border, Radius & Elevation

### Border

```
Default border:     1px solid (border-slate-200 / dark:border-slate-700)
Strong border:      1px solid (border-slate-300 / dark:border-slate-600)
Focus border:       2px solid (ring-2 ring-blue-600 dark:ring-blue-400)
Divider:            1px solid (same as default border)
```

### Border Radius

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `radius-sm` | 4px | `rounded` | Badges, tags, chips |
| `radius-md` | 6px | `rounded-md` | Inputs, small buttons |
| `radius-lg` | 8px | `rounded-lg` | Buttons (standard), dropdowns |
| `radius-xl` | 12px | `rounded-xl` | Cards, panels |
| `radius-2xl` | 16px | `rounded-2xl` | Modals |
| `radius-full` | 9999px | `rounded-full` | Avatar, pill badges, toggle |

### Elevation

| Level | Usage | Shadow |
|-------|-------|--------|
| 0 | Flat (tables, inputs) | `shadow-none` |
| 1 | Cards, panels | `shadow-sm` |
| 2 | Dropdowns, popovers | `shadow-md` |
| 3 | Modals, dialogs | `shadow-xl` |
| 4 | Toasts, notifications | `shadow-lg` |

```
Rules:
  ✓ Cards always level 1 (shadow-sm)
  ✓ Modals always level 3 (shadow-xl) + backdrop blur
  ✓ Dropdowns always level 2 (shadow-md)
  ✗ Shadows FORBIDDEN on buttons
  ✗ Shadows FORBIDDEN on form inputs
  ✗ Never use drop-shadow on text
```

---

## ◈ 7. Component Rules

### Buttons

```
┌─────────────────────────────────────────────────────────────┐
│  VARIANTS                                                   │
│                                                             │
│  Primary    bg-blue-700 hover:bg-blue-800 text-white        │
│             dark: bg-blue-600 hover:bg-blue-500             │
│                                                             │
│  Secondary  bg-white border border-slate-300 text-slate-700 │
│             hover:bg-slate-50                               │
│             dark: bg-slate-800 border-slate-600 text-white  │
│                                                             │
│  Ghost      bg-transparent text-slate-700 hover:bg-slate-100│
│             dark: text-slate-300 hover:bg-slate-800         │
│                                                             │
│  Danger     bg-red-600 hover:bg-red-700 text-white          │
│             dark: bg-red-700 hover:bg-red-600               │
│                                                             │
│  SIZES                                                      │
│  sm:   h-8  px-3 py-1.5 text-sm rounded-md                 │
│  md:   h-9  px-4 py-2   text-sm rounded-lg  (default)      │
│  lg:   h-11 px-6 py-3   text-base rounded-lg               │
│                                                             │
│  RULES                                                      │
│  · Always font-medium (500)                                 │
│  · Loading state: replace text with spinner (same size)     │
│  · Disabled: opacity-40 cursor-not-allowed                  │
│  · Shadow FORBIDDEN on all button variants                  │
│  · Icon buttons: must have aria-label or tooltip            │
└─────────────────────────────────────────────────────────────┘
```

### Inputs & Form Controls

```
┌─────────────────────────────────────────────────────────────┐
│  Base Input                                                 │
│  h-9 px-3 py-2 text-sm rounded-md border border-slate-300  │
│  bg-white text-slate-900 placeholder:text-slate-400         │
│  focus:outline-none focus:ring-2 focus:ring-blue-600        │
│  focus:border-transparent                                   │
│                                                             │
│  Dark mode:                                                 │
│  dark:bg-slate-800 dark:border-slate-600                    │
│  dark:text-slate-50 dark:placeholder:text-slate-500         │
│  dark:focus:ring-blue-400                                   │
│                                                             │
│  Error state:  border-red-500 focus:ring-red-500            │
│  Disabled:     opacity-50 cursor-not-allowed bg-slate-50    │
│                                                             │
│  Select:       same as input + cursor-pointer               │
│  Textarea:     same as input + resize-y min-h-[80px]        │
│  Checkbox:     h-4 w-4 rounded accent-blue-600              │
│  Toggle:       h-5 w-9 rounded-full (custom component)      │
└─────────────────────────────────────────────────────────────┘
```

### Cards

```
Padding:      p-5 or p-6
Radius:       rounded-xl
Border:       border border-slate-200 dark:border-slate-700
Background:   bg-white dark:bg-slate-800
Shadow:       shadow-sm
Hover (clickable cards): hover:shadow-md transition-shadow duration-150

Stats Card (specific):
  Padding:    p-6
  Layout:     flex items-start justify-between
  Icon area:  w-10 h-10 rounded-lg flex items-center justify-center
  Number:     text-2xl font-bold
  Label:      text-sm text-slate-500
```

### Tables

```
Wrapper:       overflow-hidden rounded-xl border border-slate-200
               dark:border-slate-700

Table:         w-full text-sm border-collapse

Header row:    bg-slate-50 dark:bg-slate-800/50
               border-b border-slate-200 dark:border-slate-700

Header cell:   px-4 py-3 text-left text-xs font-semibold
               uppercase tracking-wider
               text-slate-500 dark:text-slate-400

Data row:      border-b border-slate-100 dark:border-slate-700/50
               hover:bg-slate-50 dark:hover:bg-slate-700/30
               transition-colors duration-100

Alt row:       even:bg-slate-50/50 dark:even:bg-slate-800/30

Data cell:     px-4 py-3 text-slate-700 dark:text-slate-300

Empty state:   py-16 text-center text-slate-400 (use EmptyState component)
```

### Modals & Dialogs

```
Backdrop:      fixed inset-0 bg-black/50 backdrop-blur-sm
               (backdrop-blur MANDATORY, not optional)

Panel:         bg-white dark:bg-slate-800
               rounded-2xl shadow-xl
               max-w-lg w-full mx-4
               p-6

Header:        flex items-center justify-between pb-4 border-b
Title:         text-lg font-semibold text-slate-900 dark:text-slate-50
Close button:  Ghost variant, top-right

Footer:        flex items-center justify-end gap-3 pt-4 border-t
Action order:  [Cancel / Secondary] → [Primary action]
```

### Status Badges

```
Base:          inline-flex items-center gap-1
               px-2.5 py-0.5 rounded text-xs font-medium

Dot variant:   add before: w-1.5 h-1.5 rounded-full (same color as text)

All badge colors defined in §3 Color System → Badge Color Map

Usage rule:    Icon + label preferred over color-only
               Never change badge colors — use only the defined map
```

### Sidebar Navigation

```
Container:     w-64 (expanded) / w-16 (collapsed)
               h-screen sticky top-0
               bg-white dark:bg-slate-900
               border-r border-slate-200 dark:border-slate-700

Logo area:     h-16 px-4 flex items-center border-b

Nav item:      flex items-center gap-3 px-3 py-2
               rounded-lg text-sm font-medium
               text-slate-600 dark:text-slate-400
               hover:bg-slate-100 dark:hover:bg-slate-800
               transition-colors duration-100

Active item:   bg-blue-50 dark:bg-blue-900/20
               text-blue-700 dark:text-blue-400
               (left border: border-l-2 border-blue-600)

Icon:          w-5 h-5 shrink-0

Section label: px-3 py-2 text-xs font-semibold uppercase tracking-wider
               text-slate-400 dark:text-slate-500
```

### Topbar

```
Height:        h-16
Background:    bg-white dark:bg-slate-800
Border:        border-b border-slate-200 dark:border-slate-700
Padding:       px-4 md:px-6

Contents (left → right):
  [Menu toggle] [Page title / Breadcrumb] ... [Theme toggle] [User menu]

User menu:     Avatar (w-8 h-8 rounded-full) + name text-sm font-medium
```

### Toast Notifications

```
Position:      bottom-right (fixed)
Max width:     sm:max-w-sm
Radius:        rounded-xl
Shadow:        shadow-lg
Border:        border (color per variant)
Padding:       p-4

Variants:
  success:  border-green-200  bg-green-50  dark:bg-green-900/20
  error:    border-red-200    bg-red-50    dark:bg-red-900/20
  warning:  border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20
  info:     border-blue-200   bg-blue-50   dark:bg-blue-900/20

Always include:  icon + title + optional description + optional action
Auto-dismiss:    4000ms (success/info), 6000ms (warning/error)
```

### Page Header

```
Layout:    flex items-center justify-between pb-6 border-b
           border-slate-200 dark:border-slate-700

Left side:
  Title:   text-2xl font-semibold text-slate-900 dark:text-slate-50
  Sub:     text-sm text-slate-500 dark:text-slate-400 mt-0.5

Right side: Primary action button (single, always)

Breadcrumb (sub-pages):
  text-sm text-slate-500 → separator (/) → current page text-slate-900
```

---

## ◈ 8. Iconography

### Library

**Lucide React** — exclusively. No mixing with other icon libraries.

### Sizes

| Context | Size | Tailwind |
|---------|------|----------|
| Button icon | 16px | `w-4 h-4` |
| Nav icon | 20px | `w-5 h-5` |
| Feature / section icon | 24px | `w-6 h-6` |
| Stats card icon | 20px | `w-5 h-5` |
| Status badge dot | 6px | `w-1.5 h-1.5` |

### Rules

```
✓ Outline style only (Lucide default)
✓ Color always inherits from parent text color
✓ Icon-only buttons MUST have aria-label
✓ Icons in buttons: always left of text (gap-2)
✓ Nav icons: always same color as nav text
✓ Status icons (check, x, warning): use semantic color

✗ Filled icons forbidden
✗ Custom/hand-drawn icons forbidden
✗ Icons without labels on non-universal actions
✗ Icons larger than 24px in UI components
✗ Decorative icons forbidden (must convey meaning)
```

### Standard Icon Map

| Action / Concept | Lucide Icon |
|-----------------|-------------|
| Create / Add | `Plus` |
| Edit | `Pencil` |
| Delete | `Trash2` |
| Save | `Save` |
| Close / Cancel | `X` |
| Search | `Search` |
| Filter | `SlidersHorizontal` |
| Download / Export | `Download` |
| Upload | `Upload` |
| Settings | `Settings` |
| User / Employee | `User` |
| Users list | `Users` |
| Dashboard | `LayoutDashboard` |
| Attendance | `Clock` |
| Clock In | `LogIn` |
| Clock Out | `LogOut` |
| Payout | `Wallet` |
| Inventory | `Package` |
| Expense | `Receipt` |
| Walk-In Customer | `ShoppingCart` |
| Ring Customer | `Ring` (or `Circle`) |
| Container | `Container` (or `Box`) |
| Document | `FileText` |
| Status: Active | `CheckCircle` |
| Status: Inactive | `XCircle` |
| Status: Pending | `Clock` |
| Warning / Alert | `AlertTriangle` |
| Info | `Info` |
| Sort ascending | `ArrowUp` |
| Sort descending | `ArrowDown` |
| Chevron | `ChevronRight` / `ChevronDown` |
| Menu toggle | `Menu` / `X` |
| Theme toggle | `Sun` / `Moon` |
| Logout | `LogOut` |
| Password | `Lock` |
| Email | `Mail` |
| Phone | `Phone` |
| Calendar | `Calendar` |
| Refresh | `RefreshCw` |
| Copy | `Copy` |
| External link | `ExternalLink` |

---

## ◈ 9. States & Variants

### Required States for All Interactive Components

Every interactive component must implement all of these — no partial implementations:

| State | Visual Treatment |
|-------|-----------------|
| Default | Base styles as defined |
| Hover | Brightness +8% or `bg-*-50/100` shift |
| Active (pressed) | Brightness -8% or `bg-*-800` shift |
| Focus | `ring-2 ring-blue-600 ring-offset-2 dark:ring-blue-400` |
| Disabled | `opacity-40 cursor-not-allowed pointer-events-none` |
| Loading | Replace content with `<Spinner>`, keep dimensions |
| Error | `border-red-500 focus:ring-red-500` + error text below |
| Success | `border-green-500` + success text (brief, then normal) |

### Loading State Rules

```
✓ Spinner replaces button text/icon — button keeps its width
✓ Table loading: skeleton rows (same height as data rows)
✓ Card loading: skeleton matching card structure
✓ Page loading: skeleton layout (never full-screen spinner)
✓ Form submission: disable all inputs + show spinner on submit button
✗ Never overlay a spinner on top of existing content
✗ Never use a page-level spinner after initial app load
```

### Empty States

```
Structure:
  Icon (w-10 h-10 text-slate-300 dark:text-slate-600)
  Title (text-base font-medium text-slate-500)
  Description (text-sm text-slate-400 mt-1)
  Action button (optional, Primary variant)

Center vertically and horizontally within the content area.
Use only for empty data — not for loading or errors.
```

### Error States

```
Inline form errors:
  text-xs text-red-600 dark:text-red-400 mt-1
  Pair with border-red-500 on the input

API error (full page):
  ErrorBoundary component
  Shows: icon + "Something went wrong" + retry button

Empty result (search/filter):
  EmptyState component variant
  "No results found for '[query]'"
  Clear filters button
```

---

## ◈ 10. Motion & Animation

### Timing

| Type | Duration | Easing |
|------|----------|--------|
| Micro interactions (hover, active) | 100ms | `ease-out` |
| State transitions (show/hide) | 150ms | `ease-out` |
| Entrance animations (modal, dropdown) | 200ms | `ease-out` |
| Exit animations | 150ms | `ease-in` |
| Loading skeleton pulse | 1500ms | `ease-in-out` infinite |

### Allowed Animations

```
✓ transition-colors   (hover state changes)
✓ transition-shadow   (card hover elevation)
✓ transition-opacity  (show/hide, loading)
✓ transition-transform + scale-95/100  (modal entrance)
✓ skeleton pulse animation
✓ Spinner rotation

✗ Bounce / spring animations
✗ Slide animations on table rows
✗ Animations on form validation feedback
✗ Parallax or scroll-triggered animations
✗ Animations > 300ms
```

### Reduced Motion

```css
/* Always implement */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## ◈ 11. Accessibility

### Minimum Requirements (WCAG 2.1 AA)

| Rule | Requirement |
|------|------------|
| Color contrast (normal text) | ≥ 4.5:1 |
| Color contrast (large text ≥ 18px bold) | ≥ 3:1 |
| Focus indicator | Always visible, never removed |
| Touch targets | ≥ 44px × 44px |
| Minimum font size | 12px (no exceptions) |
| Color-only communication | Never — always pair with text/icon |

### Keyboard Navigation

```
Tab order:     Logical, top-left → bottom-right
Modal:         Focus trapped inside when open
               First focusable element receives focus on open
               Escape key closes
Dropdown:      Arrow keys navigate options
               Enter/Space selects
               Escape closes
Table:         Tab moves between cells if interactive
Data input:    Enter submits form
```

### ARIA Requirements

```
Icon-only buttons:    aria-label="[action]"
Loading states:       aria-label="Loading..." or aria-busy="true"
Error messages:       aria-describedby pointing to input
Form sections:        fieldset + legend for grouped inputs
Table:                aria-sort on sortable column headers
Modal:                role="dialog" aria-modal="true" aria-labelledby="[title-id]"
Toast:                role="alert" aria-live="polite" (success/info)
                      role="alert" aria-live="assertive" (error)
Status badges:        Include text, not just color
```

---

## ◈ 12. Tailwind CSS Mapping

### Configuration (tailwind.config.ts)

```typescript
export default {
  darkMode: 'class', // MUST be class-based, not media
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:  { DEFAULT: '#1E40AF', dark: '#3B82F6' },
          success:  { DEFAULT: '#16A34A', dark: '#22C55E' },
          warning:  { DEFAULT: '#D97706', dark: '#F59E0B' },
          danger:   { DEFAULT: '#DC2626', dark: '#EF4444' },
          purple:   { DEFAULT: '#7C3AED', dark: '#8B5CF6' },
          cyan:     { DEFAULT: '#0891B2', dark: '#06B6D4' },
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
      }
    }
  }
}
```

### Mandatory Practices

```
✓ Semantic tokens only (bg-slate-900, not bg-[#0F172A])
✓ Dark mode via dark: prefix on every color class
✓ Responsive via sm: md: lg: xl: prefixes
✓ State via hover: focus: active: disabled: prefixes
✓ Utility-first: compose classes, don't write custom CSS
✓ Custom CSS only for: animations, complex gradients, patterns

✗ Inline styles forbidden (style={{ }})
✗ Raw HEX values in className forbidden
✗ !important forbidden (fix specificity properly)
✗ Custom CSS for anything Tailwind can do natively
✗ Arbitrary values (bg-[#xxx]) except for one-off brand colors
```

---

## ◈ 13. Dark Mode Rules

### Implementation

```typescript
// src/hooks/useTheme.ts
// ─ Toggle: document.documentElement.classList.toggle('dark', isDark)
// ─ Persist: localStorage.setItem('theme', 'dark' | 'light')
// ─ Detect system: window.matchMedia('(prefers-color-scheme: dark)')
// ─ Default: 'light' unless system prefers dark
```

### Every Component Must

```
1. Define BOTH light and dark classes
2. Never rely on default browser colors
3. Test with CSS class .dark on <html> before completion
4. Charts: provide separate color values per theme
5. Images/illustrations: have both light/dark variants if needed
```

### Dark Mode Anti-Patterns to Avoid

```
✗ Adding dark mode as an afterthought
✗ Using opacity to "fake" dark mode colors
✗ Different component structure in dark vs light
✗ Missing dark: prefix on any background or text color
✗ Hardcoded white/black colors (use slate-50/slate-900)
✗ Borders invisible in dark mode (always define dark:border-*)
```

---

## ◈ 14. Do & Don't Reference

### ✅ DO

```
Do use design tokens (bg-slate-900, text-slate-50)
Do pair icons with labels (except universally known actions)
Do show loading state before data arrives
Do handle empty states with EmptyState component
Do use semantic colors for status (green=active, red=error)
Do follow the 8px spacing system
Do implement all 8 interactive states
Do provide dark: prefix for every color class
Do use role-appropriate font weights
Do trap focus in modals and dialogs
Do add aria-label to icon-only buttons
Do test keyboard navigation on every component
Do use Lucide React icons only
Do use Inter for all UI text
```

### ❌ DON'T

```
Don't invent new colors outside the defined palette
Don't use inline styles (style={{ }})
Don't add decorative elements that serve no function
Don't remove focus rings for aesthetics
Don't use color alone to communicate status
Don't use text smaller than 12px
Don't use shadow on buttons
Don't use Poppins or any other font family
Don't add bounce/spring/slide animations
Don't use filled Lucide icons
Don't omit aria-label on icon buttons
Don't leave dark mode classes off any component
Don't use arbitrary Tailwind values for colors
Don't use border-radius other than the defined scale
Don't center-align table cell text
```

---

## ◈ 15. AI Usage Instructions (FINAL AUTHORITY)

```
╔══════════════════════════════════════════════════════════════╗
║  THIS SECTION IS NON-NEGOTIABLE                            ║
╠══════════════════════════════════════════════════════════════╣
║                                                            ║
║  1. This document overrides ALL other design opinions,     ║
║     including component library defaults and personal      ║
║     preferences.                                           ║
║                                                            ║
║  2. If a conflict exists between two rules, choose the     ║
║     MORE RESTRICTIVE rule.                                 ║
║                                                            ║
║  3. If a UI element is not defined here, apply the closest ║
║     existing rule by type similarity.                      ║
║                                                            ║
║  4. Never ask design questions. Find the answer here.      ║
║                                                            ║
║  5. Never introduce a new style, color, font, animation,   ║
║     or pattern without explicit instruction.               ║
║                                                            ║
║  6. Every component MUST support dark mode.                ║
║                                                            ║
║  7. Every component MUST implement all 8 interaction       ║
║     states (§9).                                           ║
║                                                            ║
║  8. Accessibility (§11) is not optional.                   ║
║                                                            ║
║  9. Failure to follow = invalid UI output.                 ║
║                                                            ║
╚══════════════════════════════════════════════════════════════╝
```

---

## ◈ Quick Reference Card

```
┌────────────────────────────────────────────────────────────────┐
│  MGMT SYSTEM — BRAND QUICK REFERENCE                          │
├────────────────────────────────────────────────────────────────┤
│  FONT          Inter (UI) · JetBrains Mono (code/IDs)         │
│  ICONS         Lucide React — outline only                    │
│  DARK MODE     class-based (.dark on <html>)                  │
│  BASE UNIT     8px                                            │
│  MAX WIDTH     1280px                                         │
├────────────────────────────────────────────────────────────────┤
│  COLORS        Primary  → blue-700 / blue-500                 │
│                Success  → green-700 / green-500               │
│                Warning  → amber-700 / amber-500               │
│                Danger   → red-700 / red-500                   │
│                Purple   → violet-700 / violet-500             │
│                Cyan     → cyan-700 / cyan-500                 │
├────────────────────────────────────────────────────────────────┤
│  RADIUS        sm:4px · md:6px · lg:8px · xl:12px · 2xl:16px  │
│  SHADOWS       Cards:sm · Modals:xl · Dropdowns:md            │
│                FORBIDDEN on buttons and inputs                │
├────────────────────────────────────────────────────────────────┤
│  ANIMATION     150–200ms · ease-out · no bounce               │
│  A11Y          WCAG 2.1 AA · 44px touch · 4.5:1 contrast      │
├────────────────────────────────────────────────────────────────┤
│  FORBIDDEN     Inline styles · Raw HEX · Custom fonts         │
│                Filled icons · >24px icons in UI               │
│                Decorative elements · Poppins font             │
│                Button shadows · Missing dark: classes         │
└────────────────────────────────────────────────────────────────┘
```

---

<div align="center">

**Management System · Brand & Design Guidelines · SSOT v1.0**

*This document is FINAL AUTHORITY for all UI decisions.*
*AI must not deviate from these rules under any circumstance.*

</div>
