// ============================================================================
// IMPORTS
// ============================================================================
import { IRingCustomer, CreateRingCustomerPayload, UpdateRingCustomerPayload } from '@/store/ringCustomers/ringCustomers.types';
import axiosInstance from '@/utils/axiosInstance';

// ============================================================================
// CONSTANTS
// ============================================================================
const BASE_URL = '/api/v1/ring-customer';
const PLURAL_BASE_URL = '/api/v1/ring-customers';

export interface BaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentCount: number;
  };
}

// ============================================================================
// API SERVICE
// ============================================================================
export const ringCustomersApi = {
  /**
   * Create a new ring customer
   */
  createRingCustomer: async (payload: CreateRingCustomerPayload): Promise<IRingCustomer> => {
    const response = await axiosInstance.post<BaseResponse<IRingCustomer>>(BASE_URL, payload);
    return response.data.data;
  },

  /**
   * Get paginated list of ring customers
   */
  getRingCustomers: async (params?: {
    calenderSlotType?: string;
    count?: number;
    limit?: number;
    startTimestamp?: number;
    endTimestamp?: number;
    search?: string;
  }): Promise<
    PaginatedResponse<{
      ringCustomers: IRingCustomer[];
      totalAmount: number;
    }>
  > => {
    const response = await axiosInstance.get(PLURAL_BASE_URL, { params });
    return response.data;
  },

  /**
   * Update an existing ring customer
   */
  updateRingCustomer: async (payload: UpdateRingCustomerPayload): Promise<IRingCustomer> => {
    const { rcId, ...data } = payload;
    const response = await axiosInstance.put<BaseResponse<IRingCustomer>>(`${BASE_URL}/${rcId}`, data);
    return response.data.data;
  },

  /**
   * Delete a ring customer
   */
  deleteRingCustomer: async (rcId: string): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${rcId}`);
  },

  /**
   * Get suggestions for customer names
   */
  getCustomerNames: async (params?: {
    search?: string;
    limit?: number;
  }): Promise<PaginatedResponse<string[]>> => {
    const response = await axiosInstance.get(`${BASE_URL}/customer-names`, { params });
    return response.data;
  },
};
