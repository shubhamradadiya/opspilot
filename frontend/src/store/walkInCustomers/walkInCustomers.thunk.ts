// ============================================================================
// IMPORTS
// ============================================================================
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { walkInCustomersApi } from '@/api/walkInCustomers.api';
import {
  CreateWalkInCustomerPayload,
  UpdateWalkInCustomerPayload,
  WalkInCustomerStatus,
} from './walkInCustomers.types';

// ============================================================================
// THUNKS
// ============================================================================

export const fetchWalkInCustomersThunk = createAsyncThunk(
  'walkInCustomers/fetchAll',
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
      const response = await walkInCustomersApi.getWalkInCustomers(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch walk-in customers'
      );
    }
  }
);

export const createWalkInCustomerThunk = createAsyncThunk(
  'walkInCustomers/create',
  async (payload: CreateWalkInCustomerPayload, { rejectWithValue }) => {
    try {
      const walkInCustomer = await walkInCustomersApi.createWalkInCustomer(payload);
      toast.success('Walk-in customer created successfully');
      return walkInCustomer;
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to create walk-in customer';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateWalkInCustomerThunk = createAsyncThunk(
  'walkInCustomers/update',
  async (payload: UpdateWalkInCustomerPayload, { rejectWithValue }) => {
    try {
      const walkInCustomer = await walkInCustomersApi.updateWalkInCustomer(payload);
      toast.success('Walk-in customer updated successfully');
      return walkInCustomer;
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to update walk-in customer';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deleteWalkInCustomerThunk = createAsyncThunk(
  'walkInCustomers/delete',
  async (wcId: string, { rejectWithValue }) => {
    try {
      await walkInCustomersApi.deleteWalkInCustomer(wcId);
      toast.success('Walk-in customer deleted successfully');
      return wcId;
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to delete walk-in customer';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateWalkInCustomersStatusThunk = createAsyncThunk(
  'walkInCustomers/updateStatus',
  async (
    payload: {
      customerName: string;
      startTimestamp: number;
      endTimestamp: number;
      status: WalkInCustomerStatus;
    },
    { rejectWithValue }
  ) => {
    try {
      await walkInCustomersApi.updateWalkInCustomersStatus(payload);
      toast.success('Walk-in customers status updated successfully');
      return payload;
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to update statuses';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const fetchWalkInCustomerNamesThunk = createAsyncThunk(
  'walkInCustomers/fetchCustomerNames',
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      const response = await walkInCustomersApi.getCustomerNames({ search, limit: 20 });
      return response.data as string[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch customer names'
      );
    }
  }
);
