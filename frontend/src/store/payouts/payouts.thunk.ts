// ============================================================================
// PAYOUTS THUNKS
// OpsPilot · FE-06
// ============================================================================
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';
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
  setMeta,
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
  page?: number;
}) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const { payouts, meta } = await fetchAllPayouts(params);
    dispatch(setAllPayouts(payouts));
    if (meta) dispatch(setMeta(meta));
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
  page?: number;
}) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const { payouts, meta } = await fetchSelfPayouts(params);
    dispatch(setSelfPayouts(payouts));
    if (meta) dispatch(setMeta(meta));
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
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      toast.error('No payouts found for this period');
      return;
    }

    if (Array.isArray(data)) {
      // Backend returns an array of HTML strings
      const htmlContent = data.join('');
      
      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      
      const opt = {
        margin:       1,
        filename:     `receipt_${params.uid}_${new Date().toISOString().split('T')[0]}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
      };

      toast.loading('Generating PDF...', { id: 'pdf-gen' });
      await html2pdf().set(opt).from(element).save();
      toast.success('Receipt downloaded successfully', { id: 'pdf-gen' });

      return;
    }

    // Open receipt in new tab (data may be a URL or base64)
    if (typeof data === 'string' && data.startsWith('http')) {
      window.open(data, '_blank', 'noopener,noreferrer');
      toast.success('Receipt opened in new tab');
    } else if (typeof data === 'string') {
      // Treat as base64 PDF
      const byteChars = atob(data);
      const byteArr = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i);
      const blob = new Blob([byteArr], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      toast.success('Receipt opened in new tab');
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to download receipt';
    toast.error(msg);
  } finally {
    dispatch(setSubmitting(false));
  }
};
