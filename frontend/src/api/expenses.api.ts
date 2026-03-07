// ============================================================================
// IMPORTS
// ============================================================================
import axiosInstance from '@/utils/axiosInstance';
import { IExpense, CreateExpensePayload, UpdateExpensePayload } from '../store/expenses/expenses.types';

// ============================================================================
// EXPENSES API
// ============================================================================

export const expensesApi = {
  // -------------------------------------------------------------------
  // Create expense
  // -------------------------------------------------------------------
  createExpense: async (data: CreateExpensePayload): Promise<IExpense> => {
    const response = await axiosInstance.post('/api/v1/expense', data);
    return response.data.data;
  },

  // -------------------------------------------------------------------
  // Get all expenses (paginated + filtered)
  // -------------------------------------------------------------------
  getExpenses: async (params?: {
    count?: number;
    limit?: number;
    startTimestamp?: number;
    endTimestamp?: number;
    search?: string;
  }) => {
    const response = await axiosInstance.get('/api/v1/expenses', { params });
    return response.data;
  },

  // -------------------------------------------------------------------
  // Update expense
  // -------------------------------------------------------------------
  updateExpense: async (data: UpdateExpensePayload): Promise<IExpense> => {
    const { eId, ...updateData } = data;
    const response = await axiosInstance.put(`/api/v1/expense/${eId}`, updateData);
    return response.data.data;
  },

  // -------------------------------------------------------------------
  // Delete expense
  // -------------------------------------------------------------------
  deleteExpense: async (eId: string): Promise<void> => {
    await axiosInstance.delete(`/api/v1/expense/${eId}`);
  },

  // -------------------------------------------------------------------
  // Get vendor names (autocomplete)
  // -------------------------------------------------------------------
  getVendorNames: async (params?: { count?: number; limit?: number; search?: string }) => {
    const response = await axiosInstance.get('/api/v1/expense/vendor-names', { params });
    return response.data;
  },
};
