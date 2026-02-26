// ============================================================================
// ROUTES CONSTANTS
// Uvin Tire Management System · FE-01
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
  DASHBOARD: {
    ADMIN: '/dashboard',
    HOME: '/',
  },
} as const;
