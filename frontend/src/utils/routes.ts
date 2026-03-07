// ============================================================================
// ROUTES CONSTANTS
// OpsPilot · FE-02 → FE-06
// ============================================================================

// ============================================================================
// API ROUTES — Backend endpoints
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
  EXPENSES: {
    LIST: '/api/v1/expenses',
    CREATE: '/api/v1/expense',
    UPDATE: (eId: string) => `/api/v1/expense/${eId}`,
    DELETE: (eId: string) => `/api/v1/expense/${eId}`,
    VENDOR_NAMES: '/api/v1/expense/vendor-names',
  },
  ATTENDANCE: {
    CHECK_STATUS: '/api/v1/attendance/check-status',
    CLOCK: '/api/v1/attendance/clock-in-clock-out',
    LOGS: '/api/v1/attendance/logs',
    TODAY_LOGS: '/api/v1/attendance/logs/today',
    TIMESTAMPS: '/api/v1/attendance/timestamps',
    MANUAL_LOG: '/api/v1/attendance/log',
  },
  PAYOUTS: {
    CREATE: '/api/v1/payout',
    ADD_LOAN: '/api/v1/payout/add-loan',
    SELF: '/api/v1/payouts/self-payouts',
    ALL: '/api/v1/payouts/all-payouts',
    RECEIPT: '/api/v1/payout/download-payout-receipt',
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
  ATTENDANCE: {
    DASHBOARD: '/attendance',
    LOGS: '/attendance/logs',
    TIMESTAMPS: '/attendance/timestamps',
  },
  PAYOUTS: {
    LIST: '/payouts',
    CREATE: '/payouts/create',
  },
  INVENTORY: {
    LIST: '/inventory',
    ACTIVITY_LOGS: '/inventory/activity-logs',
  },
  EXPENSES: '/expenses',
  WALK_IN_CUSTOMERS: '/walk-in-customers',
  RING_CUSTOMERS: '/ring-customers',
  CONTAINERS: '/containers',
  SETTINGS: '/settings',
  HOME: '/',
} as const;

