// ============================================================================
// ROUTES CONSTANTS
// OpsPilot · FE-02
// ============================================================================

// ============================================================================
// API ROUTES — Backend endpoints (matches auth.controller.ts)
// ============================================================================
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    FORGOT_PASSWORD: {
      SEND_OTP: '/api/v1/auth/forgot-password/send-otp',
      VERIFY_OTP: '/api/v1/auth/forgot-password/verify-otp',
    },
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    CHANGE_PASSWORD: '/api/v1/auth/change-password',
  },
  USER: {
    GET_ME: '/api/v1/user',
  },
  ADMIN: {
    EMPLOYEES: '/api/v1/employee',
    TODAY_ATTENDANCE: '/api/v1/attendance/logs/today',
    INVENTORY: '/api/v1/inventory',
    ACTIVITY_LOGS: '/api/v1/inventory/activity-logs',
    EXPENSES: '/api/v1/expenses',
    COUNTRIES: '/api/v1/country',
  },
} as const;

// ============================================================================
// APP ROUTES — Frontend page paths
// ============================================================================
export const APP_ROUTES = {
  AUTH: {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    CHANGE_PASSWORD: '/change-password',
  },
  DASHBOARD: '/dashboard',
  EMPLOYEES: {
    LIST: '/employees',
    CREATE: '/employees/create',
    EDIT: '/employees/:uid/edit',
  },
  ATTENDANCE: '/attendance',
  PAYOUTS: '/payouts',
  INVENTORY: '/inventory',
  EXPENSES: '/expenses',
  WALK_IN_CUSTOMERS: '/walk-in-customers',
  RING_CUSTOMERS: '/ring-customers',
  CONTAINERS: '/containers',
  SETTINGS: '/settings',
  HOME: '/',
} as const;
