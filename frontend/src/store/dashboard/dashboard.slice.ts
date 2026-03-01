// ============================================================================
// IMPORTS
// ============================================================================
import { createSlice } from '@reduxjs/toolkit';
import type { IDashboardState } from './dashboard.types';
import { fetchDashboardThunk } from './dashboard.thunk';

// ============================================================================
// INITIAL STATE
// ============================================================================
const initialState: IDashboardState = {
  data: null,
  loading: false,
  error: null,
};

// ============================================================================
// SLICE
// ============================================================================
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetchDashboardThunk ─────────────────────────────────────────────
      .addCase(fetchDashboardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to load dashboard';
      });
  },
});

// ============================================================================
// EXPORTS
// ============================================================================
export const { clearDashboard } = dashboardSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────
export const selectDashboardData = (state: { dashboard: IDashboardState }) =>
  state.dashboard.data;
export const selectDashboardLoading = (state: { dashboard: IDashboardState }) =>
  state.dashboard.loading;
export const selectDashboardError = (state: { dashboard: IDashboardState }) =>
  state.dashboard.error;

export default dashboardSlice.reducer;
