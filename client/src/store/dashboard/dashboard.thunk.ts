// ============================================================================
// IMPORTS
// ============================================================================
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDashboardData } from '@/api/dashboard.api';
import type { IDashboardData } from './dashboard.types';

// ============================================================================
// THUNK — fetchDashboardThunk
// ============================================================================

/**
 * Fetches all dashboard data by calling existing backend endpoints in parallel.
 * Rejects with a user-friendly error message on failure.
 */
export const fetchDashboardThunk = createAsyncThunk<
  IDashboardData,
  void,
  { rejectValue: string }
>('dashboard/fetchDashboardData', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchDashboardData();
    return data;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to load dashboard data';
    return rejectWithValue(message);
  }
});
