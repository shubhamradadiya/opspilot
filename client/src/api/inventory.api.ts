import axiosInstance from '@/utils/axiosInstance';
import {
  CreateInventoryPayload,
  IInventory,
  UpdateInventoryPayload,
} from '../store/inventory/inventory.types';

export const inventoryApi = {
  // Inventory CRUD
  createInventory: async (data: CreateInventoryPayload): Promise<IInventory> => {
    const response = await axiosInstance.post('/api/v1/inventory', data);
    return response.data.data;
  },

  getInventories: async (params?: { page?: number; limit?: number }) => {
    const response = await axiosInstance.get('/api/v1/inventory', { params });
    return response.data;
  },

  updateInventory: async (data: UpdateInventoryPayload): Promise<IInventory> => {
    const { iId, ...updateData } = data;
    const response = await axiosInstance.put(`/api/v1/inventory/${iId}`, updateData);
    return response.data.data;
  },

  deleteInventory: async (iId: string): Promise<void> => {
    await axiosInstance.delete(`/api/v1/inventory/${iId}`);
  },

  // Activity Logs
  getActivityLogs: async (params?: { page?: number; limit?: number }) => {
    const response = await axiosInstance.get('/api/v1/inventory/activity-logs', { params });
    return response.data;
  },

  markLogsAsRead: async (logIds: number[]): Promise<void> => {
    await axiosInstance.put('/api/v1/inventory/activity-log/read', { logIds });
  },
};
