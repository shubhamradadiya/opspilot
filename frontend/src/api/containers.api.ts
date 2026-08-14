import axiosInstance from '@/utils/axiosInstance';
import { IContainer } from '@/store/containers/containers.types';

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

export const containersApi = {
  // GET all containers (with pagination & search)
  getAll: (params?: {
    count?: number;
    limit?: number;
    search?: string;
    startTimestamp?: number;
    endTimestamp?: number;
  }) => {
    return axiosInstance.get<PaginatedResponse<IContainer[]>>('/api/v1/containers', { params });
  },

  getBookingNumbers: (params?: { count?: number; limit?: number; search?: string }) => {
    return axiosInstance.get<PaginatedResponse<string[]>>('/api/v1/container/booking-numbers', { params });
  },

  // GET single container by ID
  getById: (cId: string) => {
    return axiosInstance.get<BaseResponse<IContainer>>(`/api/v1/container/${cId}`);
  },

  // POST create a new container
  create: (data: FormData) => {
    return axiosInstance.post<BaseResponse<IContainer>>('/api/v1/container', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // PUT update an existing container
  update: (cId: string, data: FormData) => {
    return axiosInstance.put<BaseResponse<IContainer>>(`/api/v1/container/${cId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // DELETE a container
  delete: (cId: string) => {
    return axiosInstance.delete<BaseResponse<null>>(`/api/v1/container/${cId}`);
  },
};
