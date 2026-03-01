import { createAsyncThunk } from '@reduxjs/toolkit';
import { inventoryApi } from '../../api/inventory.api';
import { CreateInventoryPayload, UpdateInventoryPayload } from './inventory.types';

export const createInventory = createAsyncThunk(
  'inventory/create',
  async (payload: CreateInventoryPayload, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.createInventory(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create inventory'
      );
    }
  }
);

export const getInventories = createAsyncThunk(
  'inventory/getAll',
  async (params: { page?: number; limit?: number } | undefined, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getInventories(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch inventory records'
      );
    }
  }
);

export const updateInventory = createAsyncThunk(
  'inventory/update',
  async (payload: UpdateInventoryPayload, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.updateInventory(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update inventory'
      );
    }
  }
);

export const deleteInventory = createAsyncThunk(
  'inventory/delete',
  async (iId: string, { rejectWithValue }) => {
    try {
      await inventoryApi.deleteInventory(iId);
      return iId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete inventory'
      );
    }
  }
);

export const getActivityLogs = createAsyncThunk(
  'inventory/getActivityLogs',
  async (params: { page?: number; limit?: number } | undefined, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getActivityLogs(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch activity logs'
      );
    }
  }
);

export const markLogsAsRead = createAsyncThunk(
  'inventory/markLogsAsRead',
  async (logIds: number[], { rejectWithValue }) => {
    try {
      await inventoryApi.markLogsAsRead(logIds);
      return logIds;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to mark logs as read'
      );
    }
  }
);
