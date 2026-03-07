// ============================================================================
// IMPORTS
// ============================================================================
import { createSlice } from '@reduxjs/toolkit';
import { ExpensesState } from './expenses.types';
import {
  fetchExpensesThunk,
  createExpenseThunk,
  updateExpenseThunk,
  deleteExpenseThunk,
  fetchVendorNamesThunk,
} from './expenses.thunk';

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: ExpensesState = {
  records: [],
  totalExpense: 0,
  vendorNames: [],
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

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetExpensesState: () => initialState,
  },
  extraReducers: (builder) => {
    // ── fetchExpensesThunk ──────────────────────────────────────────────────
    builder.addCase(fetchExpensesThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchExpensesThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.records = action.payload.data?.expenses ?? [];
      state.totalExpense = action.payload.data?.totalExpense ?? 0;
      if (action.payload.meta) {
        state.totalItems = action.payload.meta.totalItems;
        state.totalPages = action.payload.meta.totalPages;
        state.currentPage = action.payload.meta.currentCount ?? 1;
      }
    });
    builder.addCase(fetchExpensesThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ── createExpenseThunk ─────────────────────────────────────────────────
    builder.addCase(createExpenseThunk.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(createExpenseThunk.fulfilled, (state, action) => {
      state.submitting = false;
      state.records.unshift(action.payload);
      state.totalItems += 1;
    });
    builder.addCase(createExpenseThunk.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    // ── updateExpenseThunk ─────────────────────────────────────────────────
    builder.addCase(updateExpenseThunk.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(updateExpenseThunk.fulfilled, (state, action) => {
      state.submitting = false;
      const idx = state.records.findIndex((r) => r.eId === action.payload.eId);
      if (idx !== -1) {
        state.records[idx] = action.payload;
      }
    });
    builder.addCase(updateExpenseThunk.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    // ── deleteExpenseThunk ─────────────────────────────────────────────────
    builder.addCase(deleteExpenseThunk.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(deleteExpenseThunk.fulfilled, (state, action) => {
      state.submitting = false;
      state.records = state.records.filter((r) => r.eId !== action.payload);
      state.totalItems = Math.max(0, state.totalItems - 1);
    });
    builder.addCase(deleteExpenseThunk.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    // ── fetchVendorNamesThunk ──────────────────────────────────────────────
    builder.addCase(fetchVendorNamesThunk.fulfilled, (state, action) => {
      state.vendorNames = action.payload;
    });
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export const { clearError, resetExpensesState } = expensesSlice.actions;
export default expensesSlice.reducer;
