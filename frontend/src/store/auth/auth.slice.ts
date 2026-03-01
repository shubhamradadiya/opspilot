// ============================================================================
// IMPORTS
// ============================================================================
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { IUser, IAuthState } from './auth.types';
import {
  loginThunk,
  logoutThunk,
  sendOtpThunk,
  verifyOtpThunk,
  resetPasswordThunk,
  changePasswordThunk,
  getMeThunk,
} from './auth.thunk';

// ============================================================================
// CONSTANTS
// ============================================================================
const ACCESS_TOKEN_KEY = 'accessToken';

// ============================================================================
// INITIAL STATE
// ============================================================================
const initialState: IAuthState = {
  user: null,
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY) ?? null,
  isAuthenticated: !!localStorage.getItem(ACCESS_TOKEN_KEY),
  sessionRestored: !localStorage.getItem(ACCESS_TOKEN_KEY),
  loading: false,
  error: null,
  fpStep: 1,
  fpEmail: null,
  fpVerified: false,
};

// ============================================================================
// SLICE
// ============================================================================
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    },
    resetFpFlow(state) {
      state.fpStep = 1;
      state.fpEmail = null;
      state.fpVerified = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Login ───────────────────────────────────────────────────────────────
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem(ACCESS_TOKEN_KEY, action.payload.accessToken);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Login failed';
      });

    // ── Logout ──────────────────────────────────────────────────────────────
    builder
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      });

    // ── Send OTP ────────────────────────────────────────────────────────────
    builder
      .addCase(sendOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.fpEmail = action.payload.email;
        state.fpStep = 2;
      })
      .addCase(sendOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to send OTP';
      });

    // ── Verify OTP ──────────────────────────────────────────────────────────
    builder
      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state) => {
        state.loading = false;
        state.fpVerified = true;
        state.fpStep = 3;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'OTP verification failed';
      });

    // ── Reset Password ──────────────────────────────────────────────────────
    builder
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.fpStep = 1;
        state.fpEmail = null;
        state.fpVerified = false;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Password reset failed';
      });

    // ── Change Password ─────────────────────────────────────────────────────
    builder
      .addCase(changePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Password change failed';
      });

    // ── Get Me (session restore) ─────────────────────────────────────────────
    builder
      .addCase(getMeThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.sessionRestored = true;
      })
      .addCase(getMeThunk.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.sessionRestored = true;
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      });
  },
});

// ============================================================================
// ACTIONS
// ============================================================================
export const { clearError, setUser, clearAuth, resetFpFlow } = authSlice.actions;

// ============================================================================
// SELECTORS
// ============================================================================
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectSessionRestored = (state: RootState) => state.auth.sessionRestored;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectFpStep = (state: RootState) => state.auth.fpStep;
export const selectFpEmail = (state: RootState) => state.auth.fpEmail;

// ============================================================================
// EXPORT
// ============================================================================
export default authSlice.reducer;
