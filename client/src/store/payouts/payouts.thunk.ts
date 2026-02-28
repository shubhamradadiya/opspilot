// ============================================================================
// PAYOUTS THUNKS
// OpsPilot · FE-06
// ============================================================================
import { toast } from 'sonner';
import type { AppDispatch } from '@/store/store';
import {
  createPayout,
  addLoan,
  fetchSelfPayouts,
  fetchAllPayouts,
  downloadPayoutReceipt,
} from '@/api/payouts.api';
import {
  setLoading,
  setSubmitting,
  setError,
  setAllPayouts,
  setSelfPayouts,
} from './payouts.slice';
import type { ICreatePayoutPayload, IAddLoanPayload } from './payouts.types';

// ============================================================================
// THUNK: Fetch all payouts (admin)
// ============================================================================
export const fetchAllPayoutsThunk = (params: {
  calenderSlotType: 'DAY' | 'WEEK';
  startTimestamp: number;
  endTimestamp: number;
  search?: string;
  limit?: number;
}) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const { payouts } = await fetchAllPayouts(params);
    dispatch(setAllPayouts(payouts));
  } catch {
    dispatch(setError('Failed to load payouts'));
  } finally {
    dispatch(setLoading(false));
  }
};

// ============================================================================
// THUNK: Fetch self payouts (user)
// ============================================================================
export const fetchSelfPayoutsThunk = (params: {
  startTimestamp?: number | null;
  endTimestamp?: number | null;
  limit?: number;
}) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const { payouts } = await fetchSelfPayouts(params);
    dispatch(setSelfPayouts(payouts));
  } catch {
    dispatch(setError('Failed to load your payouts'));
  } finally {
    dispatch(setLoading(false));
  }
};

// ============================================================================
// THUNK: Create payout (admin)
// ============================================================================
export const createPayoutThunk = (
  payload: ICreatePayoutPayload,
  startTimestamp: number,
  endTimestamp: number,
  onSuccess?: () => void,
) => async (dispatch: AppDispatch) => {
  dispatch(setSubmitting(true));
  dispatch(setError(null));
  try {
    await createPayout(payload, startTimestamp, endTimestamp);
    toast.success('Payout created successfully');
    onSuccess?.();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create payout';
    toast.error(msg);
    dispatch(setError(msg));
  } finally {
    dispatch(setSubmitting(false));
  }
};

// ============================================================================
// THUNK: Add loan (admin)
// ============================================================================
export const addLoanThunk = (
  payload: IAddLoanPayload,
  onSuccess?: () => void,
) => async (dispatch: AppDispatch) => {
  dispatch(setSubmitting(true));
  dispatch(setError(null));
  try {
    await addLoan(payload);
    toast.success(`Loan of $${payload.loanAmount} added successfully`);
    onSuccess?.();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to add loan';
    toast.error(msg);
    dispatch(setError(msg));
  } finally {
    dispatch(setSubmitting(false));
  }
};

// ============================================================================
// THUNK: Download payout receipt
// ============================================================================
export const downloadReceiptThunk = (params: {
  uid: string;
  startTimestamp: number;
  endTimestamp: number;
}) => async (dispatch: AppDispatch) => {
  dispatch(setSubmitting(true));
  try {
    const data = await downloadPayoutReceipt(params);
    // Open receipt in new tab (data may be a URL or base64)
    if (data?.startsWith('http')) {
      window.open(data, '_blank', 'noopener,noreferrer');
    } else if (data) {
      // Treat as base64 PDF
      const byteChars = atob(data);
      const byteArr = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i);
      const blob = new Blob([byteArr], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    }
    toast.success('Receipt opened in new tab');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to download receipt';
    toast.error(msg);
  } finally {
    dispatch(setSubmitting(false));
  }
};
