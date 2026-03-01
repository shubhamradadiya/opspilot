// ============================================================================
// IMPORTS
// ============================================================================
import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  ILoginPayload,
  IUser,
  IForgotPasswordOtpPayload,
  IVerifyOtpPayload,
  IResetPasswordPayload,
  IChangePasswordPayload,
} from './auth.types';
import {
  apiLogin,
  apiSendOtp,
  apiVerifyOtp,
  apiResetPassword,
  apiChangePassword,
  apiLogout,
  apiGetMe,
} from '@/api/auth.api';

// ============================================================================
// CONSTANTS
// ============================================================================
const THUNK_PREFIX = 'auth';
const ACCESS_TOKEN_KEY = 'accessToken';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message ?? 'An unexpected error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// ============================================================================
// THUNKS
// ============================================================================

/**
 * Session restore — GET /api/v1/user
 * Called on app mount when a stored token exists.
 */
export const getMeThunk = createAsyncThunk<
  { user: IUser },
  void,
  { rejectValue: string }
>(`${THUNK_PREFIX}/getMe`, async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      return rejectWithValue('No token');
    }
    const response = await apiGetMe();
    const user = response.data.data!;
    return { user };
  } catch (error) {
    // Clear stale token on 401
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    return rejectWithValue(extractErrorMessage(error));
  }
});

/**
 * Login thunk — POST /api/v1/auth/login
 */
export const loginThunk = createAsyncThunk<
  { user: IUser; accessToken: string },
  ILoginPayload,
  { rejectValue: string }
>(`${THUNK_PREFIX}/login`, async (payload, { rejectWithValue }) => {
  try {
    const response = await apiLogin(payload);
    const user = response.data.data!;
    const accessToken = user.authentication?.accessToken ?? '';
    return { user, accessToken };
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

/**
 * Logout thunk — POST /api/v1/auth/logout
 */
export const logoutThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  `${THUNK_PREFIX}/logout`,
  async (_, { rejectWithValue }) => {
    try {
      await apiLogout();
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

/**
 * Send OTP thunk — POST /api/v1/auth/forgot-password/send-otp
 */
export const sendOtpThunk = createAsyncThunk<
  { email: string },
  IForgotPasswordOtpPayload,
  { rejectValue: string }
>(`${THUNK_PREFIX}/sendOtp`, async (payload, { rejectWithValue }) => {
  try {
    await apiSendOtp(payload);
    return { email: payload.email };
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

/**
 * Verify OTP thunk — POST /api/v1/auth/forgot-password/verify-otp
 */
export const verifyOtpThunk = createAsyncThunk<
  void,
  IVerifyOtpPayload,
  { rejectValue: string }
>(`${THUNK_PREFIX}/verifyOtp`, async (payload, { rejectWithValue }) => {
  try {
    await apiVerifyOtp(payload);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

/**
 * Reset Password thunk — POST /api/v1/auth/reset-password
 */
export const resetPasswordThunk = createAsyncThunk<
  void,
  IResetPasswordPayload,
  { rejectValue: string }
>(`${THUNK_PREFIX}/resetPassword`, async (payload, { rejectWithValue }) => {
  try {
    await apiResetPassword(payload);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

/**
 * Change Password thunk — POST /api/v1/auth/change-password (authenticated)
 */
export const changePasswordThunk = createAsyncThunk<
  void,
  IChangePasswordPayload,
  { rejectValue: string }
>(`${THUNK_PREFIX}/changePassword`, async (payload, { rejectWithValue }) => {
  try {
    await apiChangePassword(payload);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});
