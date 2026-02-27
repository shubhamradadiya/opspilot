<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║          OPSPILOT — BRAND & DESIGN GUIDELINES · SSOT v1.0                 ║
║                    ✦ Premium Gold Theme ✦                                  ║
║   ⚠️  FINAL AUTHORITY — Gold replaces blue everywhere.                    ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->

<div align="center">

# ✦ OpsPilot · Brand & Design Guidelines

**SSOT v1.0** &nbsp;·&nbsp; **Premium Gold Theme**

> Gold (`#D4AF37`) replaces blue everywhere — no exceptions.
> Cream (`#FDFBD4`) is the light mode background — never pure white.
> This document is FINAL AUTHORITY for all UI/UX decisions.

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

### Product Name

**OpsPilot** — precision tools for daily operations.

### Personality

```
OpsPilot SHOULD feel like:          OpsPilot MUST NEVER look like:
──────────────────────────────      ────────────────────────────────
 ✓ Premium and refined               ✗ Generic SaaS (blue palette)
 ✓ Calm authority                    ✗ Consumer-app playful
 ✓ Precise and capable               ✗ Cluttered or noisy
 ✓ Gold = trust, quality, value      ✗ Cold corporate sterile
 ✓ Warm cream tones (not white)      ✗ Neon or oversaturated
 ✓ Luxurious but functional          ✗ Experimental or trendy
```

### Emotional Tone

| Context | Tone |
|---------|------|
| Dashboard & data | Neutral, informative, factual |
| Errors & alerts | Direct, non-alarming, helpful |
| Success states | Quiet satisfaction — not celebratory |
| Empty states | Encouraging, never apologetic |
| Loading states | Invisible effort — calm confidence |

---

## ◈ 2. Design Philosophy

**Warm data density** — The cream background (`#FDFBD4`) creates warmth that distinguishes OpsPilot from cold enterprise tools.

**Gold as signal, not decoration** — `#D4AF37` is used exclusively for primary actions, active states, and focus indicators. Never decorative.

**One primary action per view** — Every page has one gold CTA. Nothing competes for attention.

**Dark mode is first-class** — Near-black (`#121212`) with gold accents preserved. Premium feel translates perfectly to dark.

**Consistency over cleverness** — Same component = same look everywhere.

---

## ◈ 3. Color System

### ✦ Brand Core — Gold Palette

| Name | HEX | Role |
|------|-----|------|
| **Gold** | `#D4AF37` | Primary CTAs, active nav, focus rings, links |
| **Gold Hover** | `#CE8946` | Hover state on all gold elements |
| **Gold Active** | `#A8892B` | Pressed / active state |
| **Gold Light** | `#F0DFA0` | Badge tint, icon bg, highlights |

> ⚠️ **Gold replaces ALL previous blue usage.** Every `gold`, `gold`, `gold` is now `#D4AF37`.

---

### ✦ Surface Palette — Light Mode

| Token | HEX | Tailwind Class | Usage |
|-------|-----|---------------|-------|
| `bg-base` | `#FDFBD4` | `bg-cream-base` | App background |
| `bg-surface` | `#FFFFFF` | `bg-white` | Cards, panels |
| `bg-elevated` | `#FFFFFF` | `bg-white` | Modals, dropdowns |
| `bg-subtle` | `#F5F0D0` | `bg-cream-subtle` | Table header, hover areas |
| `text-primary` | `#2A2A2A` | `text-ink-900` | All primary text |
| `text-secondary` | `#5A5A5A` | `text-ink-600` | Supporting text |
| `text-muted` | `#9A9A9A` | `text-ink-400` | Metadata, timestamps |
| `text-disabled` | `#C8C8C8` | `text-ink-300` | Disabled state |
| `border-default` | `#E8E0B8` | `border-cream-border` | Dividers, inputs |
| `border-strong` | `#D4C88A` | `border-cream-strong` | Cards |

### ✦ Surface Palette — Dark Mode

| Token | HEX | Tailwind Class | Usage |
|-------|-----|---------------|-------|
| `bg-base` | `#121212` | `dark:bg-ink-base` | App background |
| `bg-surface` | `#1E1E1E` | `dark:bg-ink-surface` | Cards, panels |
| `bg-elevated` | `#2A2A2A` | `dark:bg-ink-raised` | Modals, dropdowns |
| `bg-subtle` | `#252525` | `dark:bg-ink-subtle` | Table header |
| `text-primary` | `#F5F5F5` | `dark:text-cream-100` | All primary text |
| `text-secondary` | `#AAAAAA` | `dark:text-cream-400` | Supporting text |
| `text-muted` | `#666666` | `dark:text-cream-600` | Metadata |
| `text-disabled` | `#3A3A3A` | `dark:text-ink-strong` | Disabled state |
| `border-default` | `#2E2E2E` | `dark:border-ink-border` | Dividers, inputs |
| `border-strong` | `#3A3A3A` | `dark:border-ink-strong` | Cards |

---

### ✦ Semantic Colors

| Name | Light HEX | Dark HEX | Usage |
|------|-----------|----------|-------|
| **Success** | `#2D7A4F` | `#4CAF80` | Paid, Active, Arrived, Delivered, Clocked-In |
| **Warning** | `#B8860B` | `#D4A017` | Pending, Overdue, Low stock |
| **Danger** | `#C0392B` | `#E05A4A` | Error, Delete, Unpaid, Inactive, Clocked-Out |
| **Info** | `#5A6A7A` | `#8A9AAA` | Informational, helper text |
| **Purple** | `#6A3A8A` | `#9A6ABA` | Admin-only indicators, secondary charts |

### ✦ Badge Color Map

| Status | Light BG | Light Text | Dark BG | Dark Text |
|--------|----------|-----------|---------|-----------|
| Active / Paid / Arrived | `#D4EDDA` | `#2D7A4F` | `rgba(45,122,79,0.2)` | `#4CAF80` |
| Inactive / Unpaid / Cancelled | `#FADADD` | `#C0392B` | `rgba(192,57,43,0.2)` | `#E05A4A` |
| Pending / Loading | `#FEF3CD` | `#B8860B` | `rgba(184,134,11,0.2)` | `#D4A017` |
| Shipped / Processing | `#FFF8E0` | `#9A6A00` | `rgba(212,175,55,0.15)` | `#D4AF37` |
| Admin role | `#EDD6F5` | `#6A3A8A` | `rgba(106,58,138,0.2)` | `#9A6ABA` |
| User role | `#F0EDD0` | `#5A5A5A` | `rgba(90,90,90,0.2)` | `#AAAAAA` |
| Delayed / Overdue | `#FFE8CC` | `#CE8946` | `rgba(206,137,70,0.2)` | `#CE8946` |

### ✦ Color Interaction States

```
Hover:    Gold → #CE8946
Active:   Gold → #A8892B
Focus:    ring-2 ring-[#D4AF37] ring-offset-2
Disabled: opacity-40 cursor-not-allowed
```

---

## ◈ 4. Typography System

### Font Families

| Role | Font | Fallback |
|------|------|---------|
| Body / UI | `DM Sans` | `system-ui, sans-serif` |
| Monospace (IDs, codes) | `JetBrains Mono` | `ui-monospace, monospace` |

> **DM Sans** — geometric precision with warmth that complements the cream/gold palette. Never use DM Sans, Poppins, Roboto, or Space Grotesk.

### Type Scale

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-xs` | 12px | 400 | Timestamps, helper text |
| `text-sm` | 14px | 400/500 | Table cells, labels, badges |
| `text-base` | 16px | 400 | Body text, form fields |
| `text-lg` | 18px | 500/600 | Card titles |
| `text-xl` | 20px | 600 | Page sub-headers |
| `text-2xl` | 24px | 600/700 | Page titles |
| `text-3xl` | 30px | 700 | Dashboard KPI numbers |

### Typography Rules

```
✓ Page title:       text-2xl font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]
✓ Table header:     text-xs font-semibold uppercase tracking-wider text-[#9A9A9A]
✓ Table cell:       text-sm text-[#5A5A5A] dark:text-[#AAAAAA]
✓ Form label:       text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA]
✓ Error text:       text-xs text-[#C0392B] dark:text-[#E05A4A]
✓ KPI number:       text-3xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5]
✓ Gold text:        text-[#D4AF37] font-medium (links, active states only)
✓ Monospace:        font-mono text-sm text-[#5A5A5A] dark:text-[#AAAAAA]

✗ Never bold body text for decoration
✗ Never use gold on headings
✗ Never go below 12px
✗ Never use DM Sans, Poppins, or Roboto
✗ Never center-align table data
```

---

## ◈ 5. Spacing & Layout

**Base unit: 8px** — all spacing multiples of 4px.

```
4px  p-1   micro: badge, icon padding
8px  p-2   tight: button icon gap
12px p-3   compact: list items
16px p-4   base: standard padding
20px p-5   card inner
24px p-6   card padding, section spacing
32px p-8   between sections
48px p-12  page-level spacing
64px p-16  large gaps
```

**Layout:**
- Max width: `1280px`
- Sidebar: `256px` expanded, `64px` collapsed
- Topbar: `h-16` (64px)
- Content padding: `px-4` (mobile) → `px-8` (desktop)

---

## ◈ 6. Border, Radius & Elevation

### Border

```
Default:  1px solid #E8E0B8 (light) / #2E2E2E (dark)
Strong:   1px solid #D4C88A (light) / #3A3A3A (dark)
Focus:    2px solid #D4AF37 + 2px offset (both modes)
Selected: 1px solid #D4AF37 (highlighted states)
```

### Border Radius

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `sm` | 4px | `rounded` | Badges, tags |
| `md` | 6px | `rounded-md` | Inputs, small buttons |
| `lg` | 8px | `rounded-lg` | Buttons, dropdowns |
| `xl` | 12px | `rounded-xl` | Cards, panels |
| `2xl` | 16px | `rounded-2xl` | Modals |
| `full` | 9999px | `rounded-full` | Avatar, pill badges |

### Elevation

| Level | Usage | Shadow |
|-------|-------|--------|
| 0 | Tables, inputs | `shadow-none` |
| 1 | Cards | `shadow-sm` |
| 2 | Dropdowns | `shadow-md` |
| 3 | Modals | `shadow-xl` + backdrop blur |
| 4 | Toasts | `shadow-lg` |

```
✗ Shadows FORBIDDEN on buttons and inputs
```

---

## ◈ 7. Component Rules

### Buttons

```
PRIMARY
  bg-[#D4AF37] hover:bg-[#CE8946] active:bg-[#A8892B]
  text-[#2A2A2A] (dark text on gold for contrast)
  dark: same gold bg, text-[#121212]

SECONDARY
  Light: bg-white border border-[#D4AF37] text-[#D4AF37] hover:bg-[#FDFBD4]
  Dark:  bg-[#1E1E1E] border border-[#D4AF37] text-[#D4AF37] hover:bg-[#2A2A2A]

GHOST
  Light: bg-transparent text-[#5A5A5A] hover:bg-[#F5F0D0]
  Dark:  bg-transparent text-[#AAAAAA] hover:bg-[#252525]

DANGER
  bg-[#C0392B] hover:bg-[#A0302A] text-white (both modes)

SIZES:  sm: h-8 px-3 · md: h-9 px-4 · lg: h-11 px-6
FONT:   DM Sans, font-medium
RULES:  No shadow · Loading = spinner replaces text · Disabled = opacity-40
```

### Inputs

```
Light: bg-white border border-[#E8E0B8] text-[#2A2A2A]
       placeholder: text-[#9A9A9A]
       focus: ring-2 ring-[#D4AF37] border-transparent

Dark:  bg-[#1E1E1E] border border-[#2E2E2E] text-[#F5F5F5]
       placeholder: text-[#666666]
       focus: ring-2 ring-[#D4AF37] border-transparent

Error: border-[#C0392B] focus:ring-[#C0392B]
Size:  h-9 px-3 py-2 rounded-md
```

### Cards

```
Light: bg-white border border-[#E8E0B8] shadow-sm rounded-xl p-6
Dark:  bg-[#1E1E1E] border border-[#2E2E2E] shadow-md rounded-xl p-6

Hover (clickable): hover:border-[#D4AF37] transition-colors duration-150

Stats card icon area:
  Light: bg-[#F0DFA0] text-[#D4AF37] rounded-lg w-10 h-10
  Dark:  bg-[#2A2200] text-[#D4AF37] rounded-lg w-10 h-10
```

### Tables

```
Wrapper:  rounded-xl border border-[#E8E0B8] dark:border-[#2E2E2E] overflow-hidden
Header:   bg-[#F5F0D0] dark:bg-[#252525]
          text-xs font-semibold uppercase tracking-wider text-[#9A9A9A]
Row:      border-b border-[#F0EDD0] dark:border-[#222222]
          hover:bg-[#FDFBD4] dark:hover:bg-[#252525]
Alt row:  even:bg-[#FEFDF0] dark:even:bg-[#1A1A1A]
Cell:     px-4 py-3 text-sm text-[#5A5A5A] dark:text-[#AAAAAA]
```

### Modals

```
Backdrop: fixed inset-0 bg-black/60 backdrop-blur-sm (MANDATORY)
Panel:
  Light: bg-white rounded-2xl shadow-xl border border-[#E8E0B8] p-6 max-w-lg
  Dark:  bg-[#1E1E1E] rounded-2xl shadow-2xl border border-[#2E2E2E] p-6 max-w-lg
Header border: border-b border-[#E8E0B8] dark:border-[#2E2E2E]
Footer border: border-t border-[#E8E0B8] dark:border-[#2E2E2E]
Footer order:  [Cancel] → [Primary Action]
```

### Sidebar

```
Light: bg-white border-r border-[#E8E0B8]
Dark:  bg-[#1E1E1E] border-r border-[#2E2E2E]

Logo: text-[#D4AF37] font-bold text-lg (OpsPilot in gold)

Nav item:
  Light: text-[#5A5A5A] hover:bg-[#F5F0D0] hover:text-[#2A2A2A]
  Dark:  text-[#AAAAAA] hover:bg-[#252525] hover:text-[#F5F5F5]

Active item:
  Light: bg-[#F0DFA0] text-[#2A2A2A] border-l-2 border-[#D4AF37]
  Dark:  bg-[#2A2200] text-[#D4AF37] border-l-2 border-[#D4AF37]
  Icon:  text-[#D4AF37] (always gold when active)
```

### Topbar

```
Light: bg-white border-b border-[#E8E0B8] h-16
Dark:  bg-[#1E1E1E] border-b border-[#2E2E2E] h-16
User avatar: ring-2 ring-[#D4AF37]
```

### Toast Notifications

```
success: bg-[#F0FFF4] border-[#2D7A4F] / dark:bg-[#0A2010] dark:border-[#4CAF80]
error:   bg-[#FFF5F5] border-[#C0392B] / dark:bg-[#200A0A] dark:border-[#E05A4A]
warning: bg-[#FFFDF0] border-[#B8860B] / dark:bg-[#201800] dark:border-[#D4A017]
info:    bg-[#F5F0D0] border-[#D4C88A] / dark:bg-[#1E1E1E] dark:border-[#3A3A3A]
Dismiss: 4000ms (success/info) · 6000ms (warning/error)
```

---

## ◈ 8. Iconography

**Library:** Lucide React — exclusively. Outline only.

| Context | Size | Color |
|---------|------|-------|
| Button icon | `w-4 h-4` | Inherits button text color |
| Nav icon (default) | `w-5 h-5` | `text-[#9A9A9A]` |
| Nav icon (active) | `w-5 h-5` | `text-[#D4AF37]` |
| Feature/section | `w-6 h-6` | `text-[#D4AF37]` |
| Stats card | `w-5 h-5` | `text-[#D4AF37]` |

```
✓ Icon-only buttons MUST have aria-label
✓ Icons always left of button text, gap-2
✗ Filled icons forbidden
✗ Icons > 24px in UI components
```

---

## ◈ 9. States & Variants

| State | Visual Treatment |
|-------|-----------------|
| Default | Base styles as defined |
| Hover | Gold → `#CE8946`; bg → `#F5F0D0` (light) / `#252525` (dark) |
| Active | Gold → `#A8892B`; `scale-[0.98]` |
| Focus | `ring-2 ring-[#D4AF37] ring-offset-2` |
| Disabled | `opacity-40 cursor-not-allowed pointer-events-none` |
| Loading | Gold spinner replaces content; keep dimensions |
| Error | `border-[#C0392B]` + error text below |
| Success | Brief `border-[#2D7A4F]` → returns to default |

**Skeleton shimmer:** `#F5F0D0 → #FDFBD4 → #F5F0D0` (warm cream pulse)
**Spinner color:** `text-[#D4AF37]` (gold spinner always)

---

## ◈ 10. Motion & Animation

| Type | Duration | Easing |
|------|----------|--------|
| Hover | 100ms | `ease-out` |
| State transitions | 150ms | `ease-out` |
| Modal entrance | 200ms | `ease-out` |
| Exit | 150ms | `ease-in` |
| Skeleton shimmer | 1500ms | `ease-in-out` infinite |

```
✓ transition-colors · transition-shadow · transition-opacity
✓ Warm skeleton: #F5F0D0 → #FDFBD4 pulse
✗ Bounce or spring animations
✗ Animations on form validation
✗ Animations > 300ms
```

---

## ◈ 11. Accessibility

| Rule | Requirement |
|------|------------|
| Contrast (normal text) | ≥ 4.5:1 |
| Focus indicator | `ring-2 ring-[#D4AF37]` — never removed |
| Touch targets | ≥ 44px × 44px |
| Minimum font size | 12px |
| Color-only communication | Never — always pair with text/icon |
| Gold on cream `#FDFBD4` | ≥ 4.5:1 verified |
| Gold on `#121212` | ≥ 7:1 verified |

---

## ◈ 12. Tailwind CSS Mapping

```typescript
// tailwind.config.ts
export default {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          hover:   '#CE8946',
          active:  '#A8892B',
          light:   '#F0DFA0',
        },
        cream: {
          base:    '#FDFBD4',
          subtle:  '#F5F0D0',
          border:  '#E8E0B8',
          strong:  '#D4C88A',
        },
        ink: {
          base:    '#121212',
          surface: '#1E1E1E',
          raised:  '#2A2A2A',
          subtle:  '#252525',
          border:  '#2E2E2E',
          strong:  '#3A3A3A',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    }
  }
}
```

```
✓ Use config tokens (bg-cream-base, text-gold, border-cream-border)
✓ Apply dark: prefix on every color class
✓ Focus ring: always ring-[#D4AF37]
✗ Inline styles forbidden
✗ Blue colors anywhere forbidden
✗ !important forbidden
```

---

## ◈ 13. Dark Mode Rules

```typescript
// src/hooks/useTheme.ts
// Toggle: document.documentElement.classList.toggle('dark', isDark)
// Persist: localStorage.setItem('theme', 'dark' | 'light')
// Default: 'light'
```

```
Every component MUST:
1. Define BOTH light (#FDFBD4 base) and dark (#121212 base) classes
2. Never use white as page background in light mode — use #FDFBD4
3. Keep gold (#D4AF37) identical in both modes
4. Use warm shadows in light, deep shadows in dark

Anti-patterns:
✗ White page background in light mode (use #FDFBD4)
✗ Any blue color in either mode
✗ Missing dark: prefix on any color
✗ Cold sterile dark mode — maintain warmth through gold accents
```

---

## ◈ 14. Do & Don't Reference

### ✅ DO

```
Do use #FDFBD4 as app background (light mode)
Do use #121212 as app background (dark mode)
Do use #D4AF37 for every CTA, active state, and focus ring
Do use #CE8946 on hover over gold elements
Do use DM Sans for all UI text
Do use warm border colors (#E8E0B8 light / #2E2E2E dark)
Do use semantic colors for status badges only
Do implement all 8 interaction states
Do test dark mode on every component
Do add aria-label to all icon-only buttons
```

### ❌ DON'T

```
Don't use any blue color — fully replaced by gold
Don't use pure white (#FFFFFF) as page background in light mode
Don't use DM Sans, Poppins, Roboto, or Space Grotesk
Don't add decorative elements with no function
Don't remove or override focus rings
Don't use color alone to communicate status
Don't use text smaller than 12px
Don't add shadows to buttons or inputs
Don't use filled Lucide icons
Don't mix gold with blue or purple gradients
```

---

## ◈ 15. AI Usage Instructions (FINAL AUTHORITY)

```
╔══════════════════════════════════════════════════════════════╗
║  NON-NEGOTIABLE RULES                                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                            ║
║  1. Gold (#D4AF37) replaces blue EVERYWHERE.               ║
║     No blue colors exist in OpsPilot. None.                ║
║                                                            ║
║  2. App background is #FDFBD4 (light) / #121212 (dark).    ║
║     NEVER use pure white as the page background.           ║
║                                                            ║
║  3. Font is DM Sans. Never DM Sans, Poppins, Roboto.         ║
║                                                            ║
║  4. This document overrides ALL other design opinions.     ║
║                                                            ║
║  5. If something is undefined, apply the closest rule.     ║
║                                                            ║
║  6. Every component MUST support dark mode.                ║
║                                                            ║
║  7. Every component MUST implement all 8 states.           ║
║                                                            ║
║  8. Accessibility is not optional.                         ║
║                                                            ║
╚══════════════════════════════════════════════════════════════╝
```

---

## ◈ Quick Reference Card

```
┌────────────────────────────────────────────────────────────────┐
│  OPSPILOT — PREMIUM GOLD THEME · QUICK REFERENCE              │
├────────────────────────────────────────────────────────────────┤
│  FONT        DM Sans · JetBrains Mono (code)                  │
│  ICONS       Lucide React — outline only                      │
│  DARK MODE   .dark class on <html>                            │
│  MAX WIDTH   1280px · 8px base unit                           │
├────────────────────────────────────────────────────────────────┤
│  BG LIGHT    #FDFBD4  (warm cream)                            │
│  BG DARK     #121212  (near-black)                            │
│  CARD LIGHT  #FFFFFF                                          │
│  CARD DARK   #1E1E1E                                          │
│  GOLD        #D4AF37  (primary — both modes)                  │
│  HOVER       #CE8946  (gold hover — both modes)               │
│  TEXT LIGHT  #2A2A2A                                          │
│  TEXT DARK   #F5F5F5                                          │
├────────────────────────────────────────────────────────────────┤
│  SUCCESS     #2D7A4F / #4CAF80                                │
│  WARNING     #B8860B / #D4A017                                │
│  DANGER      #C0392B / #E05A4A                                │
│  PURPLE      #6A3A8A / #9A6ABA                                │
├────────────────────────────────────────────────────────────────┤
│  RADIUS      sm:4 · md:6 · lg:8 · xl:12 · 2xl:16 (px)        │
│  FOCUS RING  ring-2 ring-[#D4AF37] ring-offset-2              │
│  ANIMATION   150–200ms ease-out · no bounce                   │
│  A11Y        WCAG 2.1 AA · 44px touch · 4.5:1 contrast        │
├────────────────────────────────────────────────────────────────┤
│  FORBIDDEN   Blue colors · White page bg (light)              │
│              DM Sans/Poppins fonts · Button shadows             │
│              Filled icons · Inline styles                     │
└────────────────────────────────────────────────────────────────┘
```

---

<div align="center">

**OpsPilot · Brand & Design Guidelines · SSOT v1.0**

*Gold (#D4AF37) replaces blue everywhere.*
*Cream (#FDFBD4) is the light mode background — never pure white.*

</div>
