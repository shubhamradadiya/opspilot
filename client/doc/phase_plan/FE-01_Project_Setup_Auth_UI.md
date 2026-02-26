<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║                    MANAGEMENT SYSTEM · FRONTEND PHASES                     ║
║                         http://localhost:3001                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->

<div align="center">

```
███████╗███████╗      ██████╗  ██╗
██╔════╝██╔════╝     ██╔═══██╗███║
█████╗  █████╗  █████╗██║   ██║╚██║
██╔══╝  ██╔══╝  ╚════╝██║   ██║ ██║
██║     ███████╗      ╚██████╔╝ ██║
╚═╝     ╚══════╝       ╚═════╝  ╚═╝
```

# ⚡ Project Setup & Auth UI

**Phase** `FE-01` &nbsp;·&nbsp; **Priority** `🔴 CRITICAL` &nbsp;·&nbsp; **Status** `⬜ TODO`

---

*Backend:* `http://localhost:3001` &nbsp;|&nbsp; *Depends On:* `None (Greenfield)` &nbsp;|&nbsp; *Enables:* `FE-02`

</div>

---

## ◈ Overview

Bootstrap the entire frontend project from scratch. This phase establishes the project foundation — Vite + React + TypeScript, Tailwind CSS with full dark/light token system, Redux Toolkit store architecture, Axios HTTP client pointing to `http://localhost:3001`, and the complete authentication UI (Login + Forgot Password 3-step flow).

---

## ◈ Scope

```
✅ IN SCOPE                              ❌ OUT OF SCOPE
────────────────────────────────────     ─────────────────────────────────
 Vite + React + TS project init           App shell / layout (FE-02)
 Tailwind CSS v4 + dark mode config       Protected routes (FE-02)
 Redux Toolkit base store                 Any feature modules
 Axios instance → localhost:3001          Dashboard pages
 Login page (email + password)            Register page (no registration)
 Forgot Password (3-step OTP flow)        Social auth
 Change Password page (auth'd)
 Base UI components (Button, Input)
 Theme toggle (dark ↔ light)
 Route constants & path aliases
```

---

## ◈ API Endpoints

| Method | Endpoint | Used In | Auth? |
|:------:|----------|---------|:-----:|
| `POST` | `/api/v1/auth/login` | `Login.tsx` → `loginThunk` | Public |
| `POST` | `/api/v1/auth/forgot-password/send-otp` | `ForgotPassword.tsx` → `sendOtpThunk` | Public |
| `POST` | `/api/v1/auth/forgot-password/verify-otp` | `ForgotPassword.tsx` → `verifyOtpThunk` | Public |
| `POST` | `/api/v1/auth/reset-password` | `ForgotPassword.tsx` → `resetPasswordThunk` | Public |
| `POST` | `/api/v1/auth/change-password` | `ChangePassword.tsx` → `changePasswordThunk` | 🔒 Bearer |

---

## ◈ Files to Create

### 🏗 Project Config

| File | Description |
|------|-------------|
| `package.json` | All dependencies declared |
| `vite.config.ts` | Path aliases `@/*`, proxy to `:3001` |
| `tailwind.config.ts` | `darkMode: 'class'`, custom color tokens |
| `tsconfig.app.json` | Strict mode, path aliases |
| `.env` | `VITE_API_URL=http://localhost:3001` |

### 🎨 Styles & Tokens

| File | Description |
|------|-------------|
| `src/styles/globals.css` | CSS custom properties — full dark/light token set |

```css
/* Light Mode */
--color-bg-base: #F8FAFC;
--color-bg-surface: #FFFFFF;
--color-bg-elevated: #FFFFFF;
--color-text-primary: #0F172A;
--color-text-secondary: #64748B;
--color-border: #E2E8F0;
--color-accent: #1E40AF;

/* Dark Mode (.dark class on <html>) */
--color-bg-base: #0F172A;
--color-bg-surface: #1E293B;
--color-bg-elevated: #334155;
--color-text-primary: #F8FAFC;
--color-text-secondary: #94A3B8;
--color-border: #334155;
--color-accent: #3B82F6;
```

### 🗂 Store Architecture

| File | Type | Description |
|------|------|-------------|
| `src/store/store.ts` | Store | Redux store configuration |
| `src/store/rootReducer.ts` | Reducer | Combined reducers |
| `src/store/auth/auth.types.ts` | Types | `IUser`, `IAuthState`, `ILoginPayload`, `ILoginResponse` |
| `src/store/auth/auth.slice.ts` | Slice | Auth state, reducers, selectors |
| `src/store/auth/auth.thunk.ts` | Thunk | `loginThunk`, `logoutThunk`, `sendOtpThunk`, `verifyOtpThunk`, `resetPasswordThunk`, `changePasswordThunk` |

### 🔌 API Layer

| File | Description |
|------|-------------|
| `src/api/auth.api.ts` | HTTP calls for all auth endpoints |
| `src/utils/axiosInstance.ts` | Axios with base URL + request/response interceptors |
| `src/utils/routes.ts` | All route path constants (`ROUTES.AUTH.LOGIN` etc.) |

### 📄 Pages

| File | Route | Description |
|------|-------|-------------|
| `src/pages/auth/Login.tsx` | `/login` | Email + password, remember me, loading & error state |
| `src/pages/auth/ForgotPassword.tsx` | `/forgot-password` | Step 1: Send OTP → Step 2: Verify → Step 3: Reset |
| `src/pages/auth/ChangePassword.tsx` | `/change-password` | Authenticated password change |

### 🧩 UI Components

| File | Variants | Description |
|------|----------|-------------|
| `src/components/ui/Button.tsx` | `primary`, `secondary`, `ghost`, `danger` | Full dark mode support |
| `src/components/ui/Input.tsx` | `default`, `error`, `icon-left`, `icon-right` | Zod error display |
| `src/components/ui/Spinner.tsx` | `sm`, `md`, `lg` | Loading indicator |
| `src/components/ui/ThemeToggle.tsx` | — | Toggle button, persists to localStorage |
| `src/components/ui/OtpInput.tsx` | — | 6-digit OTP entry for ForgotPassword step 2 |

---

## ◈ Redux Store Types

```typescript
// src/store/auth/auth.types.ts

export interface IUser {
  id: number;
  uid: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  role: 'admin' | 'user';
  language: string;
  timeZone: string | null;
  profilePicture: string | null;
  priceUnit: '$' | '€' | '£';
  perHourRate: number;
  loanAmount: number;
  isActive: boolean;
  isClockInClockOutEnabled: boolean;
  isInventoryEnabled: boolean;
  isPayoutEnabled: boolean;
  isContainerEnabled: boolean;
  isExpenseEnabled: boolean;
  isWalkInCustomerEnabled: boolean;
  isRingCustomerEnabled: boolean;
}

export interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  // Forgot password flow
  fpStep: 1 | 2 | 3;
  fpEmail: string | null;
  fpVerified: boolean;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IForgotPasswordOtpPayload {
  email: string;
}

export interface IVerifyOtpPayload {
  email: string;
  otp: string;
}

export interface IResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}
```

---

## ◈ Forgot Password Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  FORGOT PASSWORD FLOW                       │
│                                                             │
│  STEP 1                STEP 2               STEP 3          │
│  ──────                ──────               ──────          │
│  Enter Email   ──►    Enter OTP    ──►   New Password       │
│  POST send-otp        POST verify          POST reset        │
│                                                             │
│  On success:           On success:         On success:      │
│  fpStep → 2            fpStep → 3          redirect /login  │
└─────────────────────────────────────────────────────────────┘
```

---

## ◈ Theme Toggle Implementation

```typescript
// src/hooks/useTheme.ts
export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  return { theme, toggleTheme };
};
```

---

## ◈ Acceptance Criteria

- [ ] `npm run dev` starts cleanly at `localhost:5173` with zero console errors
- [ ] Login form submits to `POST /api/v1/auth/login` and stores `accessToken` in localStorage
- [ ] Invalid credentials show inline error message from API response
- [ ] Forgot Password 3-step flow completes end-to-end with the API
- [ ] Theme toggle switches dark ↔ light mode; preference persists on reload
- [ ] All form validation errors shown inline (Zod + React Hook Form)
- [ ] Axios interceptor attaches `Authorization: Bearer <token>` to protected requests
- [ ] `npm run build` succeeds with zero TypeScript errors (strict mode)
- [ ] All CSS tokens applied correctly in both dark and light mode
- [ ] `ROUTES` constants used everywhere — no hardcoded path strings

---

## ◈ Dependencies to Install

```bash
npm create vite@latest . -- --template react-ts
npm install @reduxjs/toolkit react-redux
npm install react-router-dom
npm install axios
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react
npm install date-fns
npm install sonner
npm install clsx tailwind-merge
npm install -D tailwindcss@4 @tailwindcss/vite
```

---

<div align="center">

`FE-01` &nbsp;→&nbsp; [`FE-02`](./FE-02_Auth_Integration_App_Shell.md)

*Management System · Frontend Phase Plans*

</div>
