import { createAsyncThunk } from '@reduxjs/toolkit';
import { containersApi } from '@/api/containers.api';
import { AddContainerPayload, UpdateContainerPayload } from './containers.types';
import { toast } from 'sonner';

// ============================================================================
// HELPER
// ============================================================================
const buildFormData = (payload: any): FormData => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    if (key === 'containerDocuments' && Array.isArray(value)) {
      value.forEach((file: File) => {
        formData.append('containerDocuments', file);
      });
    } else {
      formData.append(key, value as string | Blob);
    }
  });
  return formData;
};

// ============================================================================
// THUNKS
// ============================================================================

export const fetchContainersThunk = createAsyncThunk(
  'containers/fetchAll',
  async (
    params: { count?: number; limit?: number; search?: string; startTimestamp?: number; endTimestamp?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await containersApi.getAll(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch containers');
    }
  }
);

export const fetchBookingNumbersThunk = createAsyncThunk(
  'containers/fetchBookingNumbers',
  async (params: { count?: number; limit?: number; search?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await containersApi.getBookingNumbers(params);
      return response.data; // paginated strings
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch booking numbers');
    }
  }
);

export const createContainerThunk = createAsyncThunk(
  'containers/create',
  async (payload: AddContainerPayload, { rejectWithValue }) => {
    try {
      const formData = buildFormData(payload);
      const response = await containersApi.create(formData);
      toast.success(response.data.message || 'Container created successfully');
      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to create container';
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const updateContainerThunk = createAsyncThunk(
  'containers/update',
  async ({ cId, payload }: { cId: string; payload: UpdateContainerPayload }, { rejectWithValue }) => {
    try {
      const formData = buildFormData(payload);
      const response = await containersApi.update(cId, formData);
      toast.success(response.data.message || 'Container updated successfully');
      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to update container';
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteContainerThunk = createAsyncThunk(
  'containers/delete',
  async (cId: string, { rejectWithValue }) => {
    try {
      const response = await containersApi.delete(cId);
      toast.success(response.data.message || 'Container deleted successfully');
      return cId;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to delete container';
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);
