// ============================================================================
// IMPORTS
// ============================================================================
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { ringCustomersApi } from '@/api/ringCustomers.api';
import {
  CreateRingCustomerPayload,
  UpdateRingCustomerPayload,
} from './ringCustomers.types';

// ============================================================================
// THUNKS
// ============================================================================

export const fetchRingCustomersThunk = createAsyncThunk(
  'ringCustomers/fetchAll',
  async (
    params: {
      calenderSlotType?: string;
      count?: number;
      limit?: number;
      startTimestamp?: number;
      endTimestamp?: number;
      search?: string;
    } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await ringCustomersApi.getRingCustomers(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch ring customers'
      );
    }
  }
);

export const createRingCustomerThunk = createAsyncThunk(
  'ringCustomers/create',
  async (payload: CreateRingCustomerPayload, { rejectWithValue }) => {
    try {
      const ringCustomer = await ringCustomersApi.createRingCustomer(payload);
      toast.success('Ring customer created successfully');
      return ringCustomer;
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to create ring customer';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateRingCustomerThunk = createAsyncThunk(
  'ringCustomers/update',
  async (payload: UpdateRingCustomerPayload, { rejectWithValue }) => {
    try {
      const ringCustomer = await ringCustomersApi.updateRingCustomer(payload);
      toast.success('Ring customer updated successfully');
      return ringCustomer;
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to update ring customer';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deleteRingCustomerThunk = createAsyncThunk(
  'ringCustomers/delete',
  async (rcId: string, { rejectWithValue }) => {
    try {
      await ringCustomersApi.deleteRingCustomer(rcId);
      toast.success('Ring customer deleted successfully');
      return rcId;
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to delete ring customer';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const fetchRingCustomerNamesThunk = createAsyncThunk(
  'ringCustomers/fetchCustomerNames',
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      const response = await ringCustomersApi.getCustomerNames({ search, limit: 20 });
      return response.data as string[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch customer names'
      );
    }
  }
);
