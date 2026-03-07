# Responsive Design Rules — OpsPilot Frontend

This document defines the responsiveness standards for the entire frontend codebase. All future components and pages **must** follow these rules to maintain visual consistency.

---

## 1. Breakpoints

| Name | Tailwind prefix | Width |
|------|----------------|-------|
| Mobile | *(default)* | `< 480px` |
| Small | `sm:` | `≥ 640px` |
| Medium | `md:` | `≥ 768px` |
| Large | `lg:` | `≥ 1024px` |
| XL | `xl:` | `≥ 1280px` |
| Mobile sidebar breakpoint | *(custom CSS)* | `≤ 768px` |
| XS topbar padding | *(custom CSS)* | `≤ 480px` |

---

## 2. Page Wrapper (Max-Width Container)

Every authenticated page **must** wrap its root element with the `.page-wrapper` CSS class.

```css
/* Defined in index.css */
.page-wrapper {
  width: 100%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  padding: 1.5rem;          /* 24px desktop */
}

@media (max-width: 640px) {
  .page-wrapper { padding: 1rem; } /* 16px mobile */
}
```

**Usage:**
```tsx
return (
  <div className="page-wrapper space-y-6">
    {/* page content */}
  </div>
);
```

**Exception:** Form pages (Create/Edit) may use `max-w-2xl mx-auto` or `max-w-3xl mx-auto` instead since they contain a single centered form card.

---

## 3. Page Headers

All page headers must stack vertically on mobile:

```tsx
{/* ✅ Correct */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
  <div>
    <h1 className="text-2xl font-bold ...">Page Title</h1>
    <p className="text-sm ... mt-0.5">Subtitle</p>
  </div>
  <Button ...>Action</Button>
</div>

{/* ❌ Incorrect — squishes on mobile */}
<div className="flex items-center justify-between">
```

---

## 4. Grid Layouts

| Use case | Class |
|----------|-------|
| Stats cards (4 col) | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4` |
| Two-column content | `grid grid-cols-1 lg:grid-cols-2 gap-4` |
| Summary cards | `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4` |
| Auto-fit cards | `grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4` |
| Three-column filters | `grid grid-cols-1 sm:grid-cols-3 gap-4` |
| Four-column filters | `grid grid-cols-1 sm:grid-cols-4 gap-4` |

---

## 5. Tables — Mobile Responsiveness

### Strategy: Dual Layout (Cards on mobile, Table on desktop)

All tables use a **dual layout pattern**. On mobile (`< sm` / `< 640px`), table rows convert to stacked cards. On desktop (`sm+`), the normal table layout appears.

```tsx
{/* ✅ Correct: dual layout */}

{/* Mobile: stacked cards */}
<div className="sm:hidden space-y-3">
  {items.map(item => (
    <div key={item.id} className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] p-4 space-y-3">
      {/* Header: primary identifiers + actions */}
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-sm">{item.name}</p>
        <ActionButtons item={item} />
      </div>
      {/* Detail grid: label + value pairs */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-[#9A9A9A]">Status</p>
          <p className="mt-0.5">{item.status}</p>
        </div>
        <div>
          <p className="text-[#9A9A9A]">Amount</p>
          <p className="mt-0.5 font-mono">{item.amount}</p>
        </div>
      </div>
    </div>
  ))}
</div>

{/* Desktop: standard table */}
<div className="hidden sm:block overflow-x-auto rounded-xl">
  <div className="min-w-[600px] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] overflow-hidden">
    <table className="w-full text-sm">
      ...
    </table>
  </div>
</div>
```

**Mobile card layout rules:**
- Top row: primary identifier (name/title) + action buttons (right-aligned)
- Detail grid: `grid grid-cols-2 gap-2 text-xs` for key-value pairs
- Wide values (like description): `col-span-2`
- Loading: show animated skeleton cards (`animate-pulse`)
- Empty: centered message with helpful context

**Minimum widths by table type:**
- Simple tables (≤4 cols): `min-w-[400px]`
- Standard tables (5-6 cols): `min-w-[600px]`
- Complex tables (7+ cols): `min-w-[800px]`

---

## 6. Navbar / App-Shell Overflow Prevention

The **critical fix** to prevent nav from scrolling horizontally:

```css
/* index.css */
.app-main {
  overflow-x: hidden;  /* ← prevents wide tables from scrolling the navbar */
  min-width: 0;        /* ← prevents flex children from overflowing */
}

.app-content {
  padding: 0;          /* ← pages own their padding via .page-wrapper */
  min-width: 0;
}
```

This means:
- `.app-main` clips any horizontal overflow inside it
- The sidebar lives outside `.app-main` so it's unaffected
- Every page uses `.page-wrapper` which is `max-width: 1400px; width: 100%`



On mobile (`≤ 768px`), the sidebar slides in over content using CSS `transform`:

- **Collapsed** → `translateX(-100%)` (hidden off-screen)
- **Open** → `translateX(0)` (slides in)

A `.sidebar-overlay` backdrop is rendered via `AppLayout.tsx` when the sidebar is open, allowing users to tap outside to close it:

```tsx
{!sidebarCollapsed && (
  <div
    className="sidebar-overlay"
    onClick={toggleSidebar}
    aria-hidden="true"
  />
)}
```

The `.app-main` container always has `margin-left: 0` on mobile (overridden with `!important`).

---

## 7. Spacing Rules

| Element | Class |
|---------|-------|
| Page vertical spacing | `space-y-6` or `space-y-8` |
| Card internal padding | `p-4` (compact) or `p-5` / `p-6` (standard) |
| Section gap | `gap-4` |
| Header actions gap | `gap-2` or `gap-3` |
| Filter row gap | `gap-3` or `gap-4` |
| Input height | `h-9` |
| Button height (sm) | `h-8` or auto with `size="sm"` |
| Button height (md) | `h-10` or auto with `size="md"` |

---

## 8. Typography Scale

| Role | Class |
|------|-------|
| Page title | `text-2xl font-bold` or `text-2xl font-semibold` |
| Section subtitle / description | `text-sm text-[#9A9A9A] dark:text-[#666666]` |
| Table header | `text-xs font-semibold uppercase tracking-wider` |
| Table cell | `text-sm` or `text-xs` |
| Label | `text-xs font-medium uppercase tracking-wider` |
| Badge | `text-[10px] font-semibold uppercase` |

---

## 9. Card Standards

All card-like containers use:

```tsx
<div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] p-4 sm:p-5">
```

- **Border radius:** `rounded-xl` (12px)
- **Border color (light):** `border-[#2A2A2A]` (or `border-cream-border`)
- **Border color (dark):** `border-[#2E2E2E]`
- **Background (light):** `bg-white`
- **Background (dark):** `bg-[#1A1A1A]` or `bg-[#1E1E1E]`

---

## 10. Input & Form Fields

```tsx
<input
  className="w-full h-9 px-3 rounded-md text-sm border border-[#2A2A2A] dark:border-[#2E2E2E]
             bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5]
             placeholder:text-[#9A9A9A] dark:placeholder:text-[#666666]
             focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent
             transition-all"
/>
```

- All inputs use `h-9` (36px height)
- Focus ring: `focus:ring-2 focus:ring-[#D4AF37]`
- Error state: `border-[#C0392B] focus:ring-[#C0392B]`

---

---

## 11. Inventory / Summary Card Grids

Always use a 1 → 2 → 4 column progression:

```css
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4
```

❌ **Never skip `sm:grid-cols-2`** — jumping from 1 col to 4 col on md looks broken on tablets.

---

## 12. Expense / Date Filter Responsiveness

Keep the original inline filter row layout for large screens. On mobile, inputs go full-width:

```tsx
{/* Search — full width on mobile, capped on sm+ */}
<div className="relative w-full sm:flex-1 sm:min-w-[200px] sm:max-w-xs">

{/* Date pickers — full width on mobile, fixed 140px on sm+ */}
<div className="w-full sm:w-[140px]">

{/* "to" separator — hide on mobile (pickers are stacked) */}
<span className="hidden sm:inline text-[#9A9A9A] text-sm">to</span>
```

**Rules:**
- Do NOT use a fixed `w-[140px]` on mobile — wrap it with `w-full sm:w-[140px]` instead
- Search bar must also be full-width on mobile: `w-full sm:flex-1`
- Never add a card-panel wrapper or preset buttons unless explicitly requested

---

## 13. Attendance Timestamp Controls — Overflow Prevention

The controls card uses two rows on mobile, one row on sm+:

```tsx
{/* Single flex row on sm+, stacks on mobile */}
<div className="flex flex-col sm:flex-row sm:items-center gap-3">

  {/* Week navigator — always one row, label truncates */}
  <div className="flex items-center gap-2 min-w-0">
    <button className="flex-shrink-0">←</button>
    <span className="flex-1 min-w-0 text-center truncate px-1">{label}</span>
    <button className="flex-shrink-0">→</button>
    <button className="flex-shrink-0 whitespace-nowrap">Today</button>
  </div>

  {/* DAY/WEEK toggle — full width on mobile (w-full, flex-1 buttons), auto on sm+ */}
  <div className="flex w-full sm:w-auto sm:ml-auto rounded-lg border overflow-hidden">
    <button className="flex-1 sm:flex-none px-4 py-1.5 ...">DAY</button>
    <button className="flex-1 sm:flex-none px-4 py-1.5 ...">WEEK</button>
  </div>

  {/* Search — full width on mobile */}
  <div className="relative w-full sm:w-52 flex-shrink-0">
```

**Rules:**
- Week label: always `flex-1 min-w-0 truncate` — never `min-w-[200px]`
- DAY/WEEK toggle: `w-full sm:w-auto sm:ml-auto` + buttons use `flex-1 sm:flex-none`
- Navigation arrows + Today: always `flex-shrink-0 whitespace-nowrap`
- Search: `w-full sm:w-52` — no fixed width on mobile

---

## 14. Dashboard Chart Layout

Charts must never appear cramped or right-shifted on small screens.

**Container (AdminDashboard):**
```tsx
{/* Mobile: horizontal scroll strip */}
<div className="lg:hidden overflow-x-auto pb-2">
  <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
    <div className="min-w-[320px] w-[calc(100vw-3rem)] min-h-[320px] flex flex-col">
      <Chart />
    </div>
  </div>
</div>

{/* Desktop: normal 2-col grid */}
<div className="hidden lg:grid lg:grid-cols-2 gap-4">
```

**Chart component:**
```tsx
{/* Card: smaller padding on mobile */}
<div className="p-3 sm:p-5 flex flex-col flex-1">
  <div className="flex-1 min-h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
        {/* YAxis: narrow width + fewer ticks */}
        <YAxis width={32} tickCount={5} tick={{ fontSize: 11 }} />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
```

**Rules:**
- YAxis `width`: use `32` (Attendance/int) or `42` (Expense/$values) — never let it default to ~60px
- Chart `margin`: always set `left: -8, right: 4` to prevent right-shift on small screens
- `tickCount={5}`: keeps labels to 5 evenly-spaced ticks, preventing crowding
- Card padding: `p-3 sm:p-5` — recover horizontal space on mobile

---

## 15. Topbar Breadcrumb — Long Path Overflow

Long paths ("Attendance > Timestamps") must scroll horizontally inside the topbar without hiding the user/logout buttons.

**CSS (`index.css`):**
```css
/* Left section shrinks to fit, never pushes right section off */
.topbar-left {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

/* Nav wrapper also must shrink */
.breadcrumb {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

/* The list scrolls silently (no visible scrollbar) */
.breadcrumb-list {
  overflow-x: auto;
  scrollbar-width: none;
}
.breadcrumb-list::-webkit-scrollbar { display: none; }

/* Items stay on one line */
.breadcrumb-item {
  white-space: nowrap;
  flex-shrink: 0;
}
```

**The complete overflow-safe chain:**
```
topbar (flex row)
  ├── topbar-left (flex:1, min-width:0, overflow:hidden)
  │     ├── hamburger button (flex-shrink:0)
  │     └── nav.breadcrumb (flex:1, min-width:0, overflow:hidden)
  │           └── ol.breadcrumb-list (overflow-x:auto)
  │                 └── li.breadcrumb-item (white-space:nowrap)
  └── topbar-right (flex-shrink:0) ← always visible
```

---

## 16. Button Responsiveness

Action buttons must never stretch full width on mobile:

```tsx
{/* Icon-only button in flex-col header */}
<button className="self-start w-fit p-2 rounded-lg border ...">
  <Icon size={18} />
</button>

{/* Text button in flex-col → flex-row header */}
<button className="self-start sm:self-auto ...">
  Add Item
</button>
```

---

## 17. Future Component Checklist

Before committing any new component or page, verify:

- [ ] Root element uses `.page-wrapper` (or `max-w-*` for form pages)
- [ ] Page header uses `flex flex-col sm:flex-row` with `self-start` on buttons
- [ ] Summary card grids use `sm:grid-cols-2 lg:grid-cols-4` (never skip sm breakpoint)
- [ ] Date filter inputs: `w-full sm:w-[140px]` (no fixed width on mobile)
- [ ] Search inputs: `w-full sm:flex-1` (full width on mobile)
- [ ] Control panels with week nav: label uses `flex-1 min-w-0 truncate`, arrows use `flex-shrink-0`
- [ ] DAY/WEEK toggles: `w-full sm:w-auto` with `flex-1 sm:flex-none` on buttons
- [ ] Chart YAxis: explicit `width={32}` or `width={42}` + `tickCount={5}`
- [ ] Chart margin: `{{ top: 4, right: 4, bottom: 0, left: -8 }}`
- [ ] Chart card padding: `p-3 sm:p-5`
- [ ] Multiple charts: horizontal scroll on mobile (`lg:hidden overflow-x-auto`)
- [ ] Table rows: dual layout (`sm:hidden` cards + `hidden sm:block` table)
- [ ] Topbar breadcrumb: see §15 chain — all ancestors need `min-width:0`
- [ ] Tested at 375px (Galaxy S8), 640px, 768px, 1024px, and 1440px widths
