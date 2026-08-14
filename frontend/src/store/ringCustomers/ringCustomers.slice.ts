// ============================================================================
// IMPORTS
// ============================================================================
import { createSlice } from '@reduxjs/toolkit';
import { RingCustomersState } from './ringCustomers.types';
import {
  fetchRingCustomersThunk,
  createRingCustomerThunk,
  updateRingCustomerThunk,
  deleteRingCustomerThunk,
  fetchRingCustomerNamesThunk,
} from './ringCustomers.thunk';

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: RingCustomersState = {
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

const ringCustomersSlice = createSlice({
  name: 'ringCustomers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetRingCustomersState: () => initialState,
  },
  extraReducers: (builder) => {
    // ── fetchRingCustomersThunk ──────────────────────────────────────────
    builder.addCase(fetchRingCustomersThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRingCustomersThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.records = action.payload.data?.ringCustomers ?? [];
      state.totalAmount = action.payload.data?.totalAmount ?? 0;
      if (action.payload.meta) {
        state.totalItems = action.payload.meta.totalItems;
        state.totalPages = action.payload.meta.totalPages;
        state.currentPage = action.payload.meta.currentCount ?? 1;
      }
    });
    builder.addCase(fetchRingCustomersThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ── createRingCustomerThunk ───────────────────────────────────────────
    builder.addCase(createRingCustomerThunk.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(createRingCustomerThunk.fulfilled, (state, action) => {
      state.submitting = false;
      state.records.unshift(action.payload);
      state.totalItems += 1;
    });
    builder.addCase(createRingCustomerThunk.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    // ── updateRingCustomerThunk ───────────────────────────────────────────
    builder.addCase(updateRingCustomerThunk.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(updateRingCustomerThunk.fulfilled, (state, action) => {
      state.submitting = false;
      const idx = state.records.findIndex((r) => r.rcId === action.payload.rcId);
      if (idx !== -1) {
        state.records[idx] = action.payload;
      }
    });
    builder.addCase(updateRingCustomerThunk.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    // ── deleteRingCustomerThunk ───────────────────────────────────────────
    builder.addCase(deleteRingCustomerThunk.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(deleteRingCustomerThunk.fulfilled, (state, action) => {
      state.submitting = false;
      state.records = state.records.filter((r) => r.rcId !== action.payload);
      state.totalItems = Math.max(0, state.totalItems - 1);
    });
    builder.addCase(deleteRingCustomerThunk.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    // ── fetchRingCustomerNamesThunk ───────────────────────────────────────
    builder.addCase(fetchRingCustomerNamesThunk.fulfilled, (state, action) => {
      state.customerNames = action.payload;
    });
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export const { clearError, resetRingCustomersState } = ringCustomersSlice.actions;
export default ringCustomersSlice.reducer;
