// ============================================================================
// AUTH TYPE DEFINITIONS
// ApexTrack · FE-02
// ============================================================================

// ============================================================================
// USER TYPES
// ============================================================================

export interface IUser {
  id: number;
  uid: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  countryCode: string | null;
  isoCode: string | null;
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
  authentication?: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };
}

// ============================================================================
// AUTH STATE TYPES
// ============================================================================

export interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  sessionRestored: boolean;
  loading: boolean;
  error: string | null;
  // Forgot password flow
  fpStep: 1 | 2 | 3;
  fpEmail: string | null;
  fpVerified: boolean;
}

// ============================================================================
// PAYLOAD TYPES
// ============================================================================

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

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface IApiResponse<T = undefined> {
  statusCode: number;
  message: string;
  data?: T;
}

export interface ILoginResponse extends IApiResponse<IUser> {
  data: IUser;
}
