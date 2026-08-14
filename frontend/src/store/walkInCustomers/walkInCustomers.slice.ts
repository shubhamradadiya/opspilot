// ============================================================================
// IMPORTS
// ============================================================================
import { createSlice } from '@reduxjs/toolkit';
import { WalkInCustomersState } from './walkInCustomers.types';
import {
  fetchWalkInCustomersThunk,
  createWalkInCustomerThunk,
  updateWalkInCustomerThunk,
  deleteWalkInCustomerThunk,
  updateWalkInCustomersStatusThunk,
  fetchWalkInCustomerNamesThunk,
} from './walkInCustomers.thunk';

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: WalkInCustomersState = {
  records: [],
  totalAmount: 0,
  customerNames: [],
  loading: false,
  submitting: false,
  error: null,
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
};

// ============================================================================
// SLICE
// ============================================================================

const walkInCustomersSlice = createSlice({
  name: 'walkInCustomers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetWalkInCustomersState: () => initialState,
  },
  extraReducers: (builder) => {
    // ── fetchWalkInCustomersThunk ──────────────────────────────────────────
    builder.addCase(fetchWalkInCustomersThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWalkInCustomersThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.records = action.payload.data?.walkInCustomers ?? [];
      state.totalAmount = action.payload.data?.totalAmount ?? 0;
      if (action.payload.meta) {
        state.totalItems = action.payload.meta.totalItems;
        state.totalPages = action.payload.meta.totalPages;
        state.currentPage = action.payload.meta.currentCount ?? 1;
      }
    });
    builder.addCase(fetchWalkInCustomersThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ── createWalkInCustomerThunk ───────────────────────────────────────────
    builder.addCase(createWalkInCustomerThunk.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(createWalkInCustomerThunk.fulfilled, (state, action) => {
      state.submitting = false;
      state.records.unshift(action.payload);
      state.totalItems += 1;
    });
    builder.addCase(createWalkInCustomerThunk.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    // ── updateWalkInCustomerThunk ───────────────────────────────────────────
    builder.addCase(updateWalkInCustomerThunk.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(updateWalkInCustomerThunk.fulfilled, (state, action) => {
      state.submitting = false;
      const idx = state.records.findIndex((r) => r.wcId === action.payload.wcId);
      if (idx !== -1) {
        state.records[idx] = action.payload;
      }
    });
    builder.addCase(updateWalkInCustomerThunk.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    // ── deleteWalkInCustomerThunk ───────────────────────────────────────────
    builder.addCase(deleteWalkInCustomerThunk.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(deleteWalkInCustomerThunk.fulfilled, (state, action) => {
      state.submitting = false;
      state.records = state.records.filter((r) => r.wcId !== action.payload);
      state.totalItems = Math.max(0, state.totalItems - 1);
    });
    builder.addCase(deleteWalkInCustomerThunk.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    // ── updateWalkInCustomersStatusThunk ────────────────────────────────────
    builder.addCase(updateWalkInCustomersStatusThunk.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(updateWalkInCustomersStatusThunk.fulfilled, (state) => {
      state.submitting = false;
      // You may need to update the status of the local records based on the selection... 
      // but usually fetching data again is safer. 
      // This part could optionally update matching customer records dynamically.
    });
    builder.addCase(updateWalkInCustomersStatusThunk.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    // ── fetchWalkInCustomerNamesThunk ───────────────────────────────────────
    builder.addCase(fetchWalkInCustomerNamesThunk.fulfilled, (state, action) => {
      state.customerNames = action.payload;
    });
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export const { clearError, resetWalkInCustomersState } = walkInCustomersSlice.actions;
export default walkInCustomersSlice.reducer;
