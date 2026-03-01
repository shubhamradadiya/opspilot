// ============================================================================
// ATTENDANCE THUNKS
// OpsPilot · FE-05
// Async operations with toast feedback and Redux state updates.
// ============================================================================
import { toast } from 'sonner';
import type { AppDispatch } from '@/store/store';
import {
  checkAttendanceStatus,
  clockInClockOut,
  fetchAttendanceLogs,
  fetchTodayAttendanceLogs,
  fetchAttendanceTimestamps,
  addManualAttendanceLog,
  deleteAttendanceLogs,
} from '@/api/attendance.api';
import {
  setStatus,
  setLogs,
  setSummary,
  setTodayLogs,
  setTimestamps,
  setStatusLoading,
  setClockLoading,
  setLogsLoading,
  setTimestampsLoading,
  setSubmitting,
  setError,
  removeLogById,
  setMeta,
} from './attendance.slice';

// ============================================================================
// THUNK: Check clock status
// ============================================================================
export const checkStatusThunk = (params: {
  isoCode: string;
  countryCode: string;
  phoneNumber: string;
}) => async (dispatch: AppDispatch) => {
  dispatch(setStatusLoading(true));
  dispatch(setError(null));
  try {
    const status = await checkAttendanceStatus(params);
    dispatch(setStatus(status));
  } catch {
    dispatch(setError('Failed to check attendance status'));
  } finally {
    dispatch(setStatusLoading(false));
  }
};

// ============================================================================
// THUNK: Clock in / Clock out
// ============================================================================
export const clockThunk = (params: {
  uid: string;
  ulId?: string | null;
  isCheckedIn: boolean;
}) => async (dispatch: AppDispatch) => {
  dispatch(setClockLoading(true));
  dispatch(setError(null));
  try {
    await clockInClockOut({ uid: params.uid, ulId: params.ulId });
    // Re-fetch status after toggling
    toast.success(params.isCheckedIn ? '🕐 Clocked out successfully' : '✅ Clocked in successfully');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Clock action failed';
    toast.error(msg);
    dispatch(setError(msg));
  } finally {
    dispatch(setClockLoading(false));
  }
};

// ============================================================================
// THUNK: Fetch attendance logs
// ============================================================================
export const fetchLogsThunk = (params: {
  count?: number;
  limit?: number;
  startTimestamp?: number | null;
  endTimestamp?: number | null;
  uid?: string | null;
}) => async (dispatch: AppDispatch) => {
  dispatch(setLogsLoading(true));
  dispatch(setError(null));
  try {
    const { logs, summary, meta } = await fetchAttendanceLogs(params);
    dispatch(setLogs(logs));
    dispatch(setSummary(summary));
    dispatch(setMeta(meta ?? null));
  } catch {
    dispatch(setError('Failed to load attendance logs'));
  } finally {
    dispatch(setLogsLoading(false));
  }
};

// ============================================================================
// THUNK: Fetch today's logs (admin)
// ============================================================================
export const fetchTodayLogsThunk = (params: {
  count?: number;
  limit?: number;
  search?: string;
}) => async (dispatch: AppDispatch) => {
  dispatch(setLogsLoading(true));
  dispatch(setError(null));
  try {
    const { entries } = await fetchTodayAttendanceLogs(params);
    dispatch(setTodayLogs(entries));
  } catch {
    dispatch(setError("Failed to load today's logs"));
  } finally {
    dispatch(setLogsLoading(false));
  }
};

// ============================================================================
// THUNK: Fetch timestamps grid (admin)
// ============================================================================
export const fetchTimestampsThunk = (params: {
  startTimestamp: number;
  endTimestamp: number;
  calenderSlotType: 'DAY' | 'WEEK';
  count?: number;
  limit?: number;
  search?: string;
}) => async (dispatch: AppDispatch) => {
  dispatch(setTimestampsLoading(true));
  dispatch(setError(null));
  try {
    const { entries } = await fetchAttendanceTimestamps(params);
    dispatch(setTimestamps(entries));
  } catch {
    dispatch(setError('Failed to load attendance timestamps'));
  } finally {
    dispatch(setTimestampsLoading(false));
  }
};

// ============================================================================
// THUNK: Add manual log (admin)
// ============================================================================
export const addManualLogThunk = (
  params: { uid: string; checkedInAt: number; checkedOutAt: number },
  onSuccess?: () => void,
) => async (dispatch: AppDispatch) => {
  dispatch(setSubmitting(true));
  dispatch(setError(null));
  try {
    await addManualAttendanceLog(params);
    toast.success('Manual log added successfully');
    onSuccess?.();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to add manual log';
    toast.error(msg);
    dispatch(setError(msg));
  } finally {
    dispatch(setSubmitting(false));
  }
};

// ============================================================================
// THUNK: Delete log(s) (admin)
// ============================================================================
export const deleteLogThunk = (
  userLogIds: string[],
  onSuccess?: () => void,
) => async (dispatch: AppDispatch) => {
  dispatch(setSubmitting(true));
  dispatch(setError(null));
  try {
    // Optimistic: remove from UI before API responds
    userLogIds.forEach((id) => dispatch(removeLogById(id)));
    await deleteAttendanceLogs(userLogIds);
    toast.success('Log deleted');
    onSuccess?.();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete log';
    toast.error(msg);
    dispatch(setError(msg));
  } finally {
    dispatch(setSubmitting(false));
  }
};
