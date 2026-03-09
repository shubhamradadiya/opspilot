// ============================================================================
// IMPORTS
// ============================================================================
import axiosInstance from '@/utils/axiosInstance';
import {
  IWalkInCustomer,
  CreateWalkInCustomerPayload,
  UpdateWalkInCustomerPayload,
  WalkInCustomerStatus,
} from '../store/walkInCustomers/walkInCustomers.types';

// ============================================================================
// WALK-IN CUSTOMERS API
// ============================================================================

export const walkInCustomersApi = {
  // -------------------------------------------------------------------
  // Create walk-in customer
  // -------------------------------------------------------------------
  createWalkInCustomer: async (data: CreateWalkInCustomerPayload): Promise<IWalkInCustomer> => {
    const response = await axiosInstance.post('/api/v1/walk-in-customer', data);
    return response.data.data;
  },

  // -------------------------------------------------------------------
  // Get all walk-in customers (paginated + filtered)
  // -------------------------------------------------------------------
  getWalkInCustomers: async (params?: {
    calenderSlotType?: string;
    count?: number;
    limit?: number;
    startTimestamp?: number;
    endTimestamp?: number;
    search?: string;
  }) => {
    const response = await axiosInstance.get('/api/v1/walk-in-customers', { params });
    return response.data;
  },

  // -------------------------------------------------------------------
  // Update walk-in customer
  // -------------------------------------------------------------------
  updateWalkInCustomer: async (data: UpdateWalkInCustomerPayload): Promise<IWalkInCustomer> => {
    const { wcId, ...updateData } = data;
    const response = await axiosInstance.put(`/api/v1/walk-in-customer/${wcId}`, updateData);
    return response.data.data;
  },

  // -------------------------------------------------------------------
  // Delete walk-in customer
  // -------------------------------------------------------------------
  deleteWalkInCustomer: async (wcId: string): Promise<void> => {
    await axiosInstance.delete(`/api/v1/walk-in-customer/${wcId}`);
  },

  // -------------------------------------------------------------------
  // Update multiple walk-in customers status
  // -------------------------------------------------------------------
  updateWalkInCustomersStatus: async (params: {
    customerName: string;
    startTimestamp: number;
    endTimestamp: number;
    status: WalkInCustomerStatus;
  }): Promise<void> => {
    await axiosInstance.put('/api/v1/walk-in-customers/status', null, { params });
  },

  // -------------------------------------------------------------------
  // Get customer names (autocomplete)
  // -------------------------------------------------------------------
  getCustomerNames: async (params?: { count?: number; limit?: number; search?: string }) => {
    const response = await axiosInstance.get('/api/v1/walk-in-customer/customer-names', { params });
    return response.data;
  },

  // -------------------------------------------------------------------
  // Download Invoice HTML
  // -------------------------------------------------------------------
  downloadInvoice: async (params: {
    customerName: string;
    startTimestamp: number;
    endTimestamp: number;
  }): Promise<string> => {
    const response = await axiosInstance.get('/api/v1/walk-in-customer/download-invoice', { params });
    return response.data.data;
  },
};
