// ============================================================================
// IMPORTS
// ============================================================================
import axiosInstance from '@/utils/axiosInstance';
import { API_ROUTES } from '@/utils/routes';
import type {
  ILoginPayload,
  ILoginResponse,
  IForgotPasswordOtpPayload,
  IVerifyOtpPayload,
  IResetPasswordPayload,
  IChangePasswordPayload,
  IApiResponse,
  IUser,
} from '@/store/auth/auth.types';
import type { AxiosResponse } from 'axios';

// ============================================================================
// AUTH API FUNCTIONS
// ============================================================================

/**
 * Login — POST /api/v1/auth/login
 */
export const apiLogin = (
  payload: ILoginPayload,
): Promise<AxiosResponse<ILoginResponse>> => {
  return axiosInstance.post(API_ROUTES.AUTH.LOGIN, payload);
};

/**
 * Send forgot-password OTP — POST /api/v1/auth/forgot-password/send-otp
 */
export const apiSendOtp = (
  payload: IForgotPasswordOtpPayload,
): Promise<AxiosResponse<IApiResponse>> => {
  return axiosInstance.post(API_ROUTES.AUTH.FORGOT_PASSWORD.SEND_OTP, payload);
};

/**
 * Verify forgot-password OTP — POST /api/v1/auth/forgot-password/verify-otp
 */
export const apiVerifyOtp = (
  payload: IVerifyOtpPayload,
): Promise<AxiosResponse<IApiResponse>> => {
  return axiosInstance.post(API_ROUTES.AUTH.FORGOT_PASSWORD.VERIFY_OTP, payload);
};

/**
 * Reset password — POST /api/v1/auth/reset-password
 */
export const apiResetPassword = (
  payload: IResetPasswordPayload,
): Promise<AxiosResponse<IApiResponse>> => {
  return axiosInstance.post(API_ROUTES.AUTH.RESET_PASSWORD, payload);
};

/**
 * Change password (authenticated) — POST /api/v1/auth/change-password
 */
export const apiChangePassword = (
  payload: IChangePasswordPayload,
): Promise<AxiosResponse<IApiResponse>> => {
  return axiosInstance.post(API_ROUTES.AUTH.CHANGE_PASSWORD, payload);
};

/**
 * Get current user — GET /api/v1/user (session restore)
 */
export const apiGetMe = (): Promise<AxiosResponse<IApiResponse<IUser>>> => {
  return axiosInstance.get(API_ROUTES.USER.GET_ME);
};

/**
 * Logout (authenticated) — POST /api/v1/auth/logout
 */
export const apiLogout = (): Promise<AxiosResponse<IApiResponse>> => {
  return axiosInstance.post(API_ROUTES.AUTH.LOGOUT);
};
