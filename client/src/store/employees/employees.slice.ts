// ============================================================================
// IMPORTS
// ============================================================================
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IEmployeesState, IEmployee, IEmployeeFilters } from './employees.types';
import {
  fetchEmployeesThunk,
  createEmployeeThunk,
  updateEmployeeThunk,
  toggleEmployeeStatusThunk,
  deleteEmployeeThunk,
} from './employees.thunk';

// ============================================================================
// INITIAL STATE
// ============================================================================
const initialState: IEmployeesState = {
  list: [],
  selected: null,
  loading: false,
  submitting: false,
  error: null,
  filters: {
    search: '',
    isActive: 'all',
    role: 'all',
  },
  meta: null,
};

// ============================================================================
// SLICE
// ============================================================================
const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    // ── Filter management ────────────────────────────────────────────────────
    setFilters: (state, action: PayloadAction<Partial<IEmployeeFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // ── Selection ────────────────────────────────────────────────────────────
    setSelected: (state, action: PayloadAction<IEmployee | null>) => {
      state.selected = action.payload;
    },
    clearSelected: (state) => {
      state.selected = null;
    },

    // ── Optimistic status toggle ─────────────────────────────────────────────
    optimisticToggleStatus: (state, action: PayloadAction<string>) => {
      const uid = action.payload;
      const emp = state.list.find((e) => e.uid === uid);
      if (emp) emp.isActive = !emp.isActive;
    },
    revertToggleStatus: (state, action: PayloadAction<string>) => {
      const uid = action.payload;
      const emp = state.list.find((e) => e.uid === uid);
      if (emp) emp.isActive = !emp.isActive;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetchEmployeesThunk ────────────────────────────────────────────────
      .addCase(fetchEmployeesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.users;
        state.meta = action.payload.meta;
      })
      .addCase(fetchEmployeesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to load employees';
      })

      // ── createEmployeeThunk ────────────────────────────────────────────────
      .addCase(createEmployeeThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createEmployeeThunk.fulfilled, (state, action) => {
        state.submitting = false;
        // Prepend the new employee to the list
        state.list = [action.payload, ...state.list];
      })
      .addCase(createEmployeeThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) ?? 'Failed to create employee';
      })

      // ── updateEmployeeThunk ────────────────────────────────────────────────
      .addCase(updateEmployeeThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateEmployeeThunk.fulfilled, (state, action) => {
        state.submitting = false;
        const idx = state.list.findIndex((e) => e.uid === action.payload.uid);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.selected?.uid === action.payload.uid) {
          state.selected = action.payload;
        }
      })
      .addCase(updateEmployeeThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) ?? 'Failed to update employee';
      })

      // ── toggleEmployeeStatusThunk ──────────────────────────────────────────
      // Optimistic update is dispatched separately; thunk just handles revert on error
      .addCase(toggleEmployeeStatusThunk.rejected, (state, action) => {
        // Revert is done in thunk using revertToggleStatus action
        state.error = (action.payload as string) ?? 'Failed to update status';
      })

      // ── deleteEmployeeThunk ────────────────────────────────────────────────
      .addCase(deleteEmployeeThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(deleteEmployeeThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.list = state.list.filter((e) => e.uid !== action.payload);
      })
      .addCase(deleteEmployeeThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) ?? 'Failed to delete employee';
      });
  },
});

// ============================================================================
// EXPORTS
// ============================================================================
export const {
  setFilters,
  resetFilters,
  setSelected,
  clearSelected,
  optimisticToggleStatus,
  revertToggleStatus,
  clearError,
} = employeesSlice.actions;

// ── Selectors ──────────────────────────────────────────────────────────────
export const selectEmployeeList = (state: { employees: IEmployeesState }) =>
  state.employees.list;
export const selectSelectedEmployee = (state: { employees: IEmployeesState }) =>
  state.employees.selected;
export const selectEmployeesLoading = (state: { employees: IEmployeesState }) =>
  state.employees.loading;
export const selectEmployeesSubmitting = (state: { employees: IEmployeesState }) =>
  state.employees.submitting;
export const selectEmployeesError = (state: { employees: IEmployeesState }) =>
  state.employees.error;
export const selectEmployeeFilters = (state: { employees: IEmployeesState }) =>
  state.employees.filters;
export const selectEmployeesMeta = (state: { employees: IEmployeesState }) =>
  state.employees.meta;

export default employeesSlice.reducer;
