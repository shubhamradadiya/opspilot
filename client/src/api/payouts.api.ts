// ============================================================================
// PAYOUTS API LAYER
// OpsPilot · FE-06
// ============================================================================
import axiosInstance from '@/utils/axiosInstance';
import { API_ROUTES } from '@/utils/routes';
import type {
  IPayout,
  ISelfPayout,
  IUserWisePayout,
  ICreatePayoutPayload,
  IAddLoanPayload,
} from '@/store/payouts/payouts.types';

import type { IPaginationMeta } from '@/store/employees/employees.types';

// ============================================================================
// RESPONSE SHAPES
// ============================================================================
interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: IPaginationMeta;
}

interface AllPayoutsData {
  calenderSlotType: string;
  payouts: IUserWisePayout[];
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * POST /payout  (Admin, multipart/form-data)
 * Creates a new payout. Optionally includes employee signature file.
 * Query params: startTimestamp, endTimestamp
 */
export const createPayout = async (
  payload: ICreatePayoutPayload,
  startTimestamp: number,
  endTimestamp: number,
): Promise<IPayout> => {
  const formData = new FormData();
  formData.append('uid', payload.uid);
  formData.append('amount', String(payload.amount));
  formData.append('loanAmount', String(payload.loanAmount));
  if (payload.employeeSignature) {
    formData.append('employeeSignature', payload.employeeSignature);
  }

  const url = `${API_ROUTES.PAYOUTS.CREATE}?startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}`;
  const res = await axiosInstance.post<ApiResponse<IPayout>>(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return (res.data as unknown as ApiResponse<IPayout>).data;
};

/**
 * POST /payout/add-loan  (Admin)
 * Adds a loan amount to an employee's record.
 */
export const addLoan = async (payload: IAddLoanPayload): Promise<void> => {
  await axiosInstance.post(API_ROUTES.PAYOUTS.ADD_LOAN, payload);
};

/**
 * GET /payouts/self-payouts  (User)
 * Returns the authenticated user's own payout history.
 */
export const fetchSelfPayouts = async (params: {
  count?: number;
  limit?: number;
  page?: number;
  startTimestamp?: number | null;
  endTimestamp?: number | null;
}): Promise<{ payouts: ISelfPayout[]; meta?: IPaginationMeta }> => {
  const query = new URLSearchParams();
  if (params.count) query.set('count', String(params.count));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.page) {
    const calculatedCount = (params.page - 1) * (params.limit || 20);
    query.set('count', String(calculatedCount));
  }
  if (params.startTimestamp) query.set('startTimestamp', String(params.startTimestamp));
  if (params.endTimestamp) query.set('endTimestamp', String(params.endTimestamp));

  const url = `${API_ROUTES.PAYOUTS.SELF}?${query.toString()}`;
  const res = await axiosInstance.get<ApiResponse<ISelfPayout[]>>(url);
  const d = res.data as unknown as ApiResponse<ISelfPayout[]>;
  return { payouts: d.data ?? [], meta: d.meta };
};

/**
 * GET /payouts/all-payouts  (Admin)
 * Returns all employees' payouts grouped by user.
 */
export const fetchAllPayouts = async (params: {
  calenderSlotType: 'DAY' | 'WEEK';
  startTimestamp: number;
  endTimestamp: number;
  count?: number;
  limit?: number;
  page?: number;
  search?: string;
}): Promise<{ payouts: IUserWisePayout[]; meta?: IPaginationMeta }> => {
  const query = new URLSearchParams({
    calenderSlotType: params.calenderSlotType,
    startTimestamp: String(params.startTimestamp),
    endTimestamp: String(params.endTimestamp),
  });
  if (params.count) query.set('count', String(params.count));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.page) {
    const calculatedCount = (params.page - 1) * (params.limit || 20);
    query.set('count', String(calculatedCount));
  }
  if (params.search) query.set('search', params.search);

  const url = `${API_ROUTES.PAYOUTS.ALL}?${query.toString()}`;
  const res = await axiosInstance.get<ApiResponse<AllPayoutsData>>(url);
  const d = res.data as unknown as ApiResponse<AllPayoutsData>;
  return { payouts: d.data.payouts ?? [], meta: d.meta };
};

/**
 * GET /payout/download-payout-receipt  (Admin + User)
 * Returns receipt data — open in new browser tab.
 */
export const downloadPayoutReceipt = async (params: {
  uid: string;
  startTimestamp: number;
  endTimestamp: number;
}): Promise<string> => {
  const query = new URLSearchParams({
    uid: params.uid,
    startTimestamp: String(params.startTimestamp),
    endTimestamp: String(params.endTimestamp),
  });
  const url = `${API_ROUTES.PAYOUTS.RECEIPT}?${query.toString()}`;
  const res = await axiosInstance.get<ApiResponse<string>>(url);
  return (res.data as unknown as ApiResponse<string>).data;
};
