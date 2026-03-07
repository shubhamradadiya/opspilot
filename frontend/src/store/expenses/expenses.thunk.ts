// ============================================================================
// IMPORTS
// ============================================================================
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { expensesApi } from '@/api/expenses.api';
import { CreateExpensePayload, UpdateExpensePayload } from './expenses.types';

// ============================================================================
// THUNKS
// ============================================================================

export const fetchExpensesThunk = createAsyncThunk(
  'expenses/fetchAll',
  async (
    params: {
      count?: number;
      limit?: number;
      startTimestamp?: number;
      endTimestamp?: number;
      search?: string;
    } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await expensesApi.getExpenses(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch expenses'
      );
    }
  }
);

export const createExpenseThunk = createAsyncThunk(
  'expenses/create',
  async (payload: CreateExpensePayload, { rejectWithValue }) => {
    try {
      const expense = await expensesApi.createExpense(payload);
      toast.success('Expense created successfully');
      return expense;
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to create expense';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateExpenseThunk = createAsyncThunk(
  'expenses/update',
  async (payload: UpdateExpensePayload, { rejectWithValue }) => {
    try {
      const expense = await expensesApi.updateExpense(payload);
      toast.success('Expense updated successfully');
      return expense;
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to update expense';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deleteExpenseThunk = createAsyncThunk(
  'expenses/delete',
  async (eId: string, { rejectWithValue }) => {
    try {
      await expensesApi.deleteExpense(eId);
      toast.success('Expense deleted successfully');
      return eId;
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to delete expense';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const fetchVendorNamesThunk = createAsyncThunk(
  'expenses/fetchVendorNames',
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      const response = await expensesApi.getVendorNames({ search, limit: 20 });
      return response.data as string[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch vendor names'
      );
    }
  }
);

