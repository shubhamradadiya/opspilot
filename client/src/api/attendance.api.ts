// ============================================================================
// ATTENDANCE API LAYER
// OpsPilot · FE-05
// All HTTP calls for the attendance module.
// ============================================================================
import axiosInstance from '@/utils/axiosInstance';
import { API_ROUTES } from '@/utils/routes';
import type {
  IAttendanceStatus,
  IDateWiseLog,
  IAttendanceSummary,
  ITodayAttendanceEntry,
  ITimestampEntry,
  IUserLog,
} from '@/store/attendance/attendance.types';

// ============================================================================
// RESPONSE SHAPES
// ============================================================================
interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentCount: number;
  };
}

interface LogsResponseData {
  userLogs: IDateWiseLog[];
  attendanceSummary: IAttendanceSummary;
}

interface TimestampsResponseData {
  calenderSlotType: string;
  attendanceData: ITimestampEntry[];
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * POST /attendance/check-status
 * Checks if a user is currently clocked in.
 * Body: { isoCode, countryCode, phoneNumber }
 */
export const checkAttendanceStatus = async (params: {
  isoCode: string;
  countryCode: string;
  phoneNumber: string;
}): Promise<IAttendanceStatus> => {
  const res = await axiosInstance.post<ApiResponse<IAttendanceStatus>>(
    API_ROUTES.ATTENDANCE.CHECK_STATUS,
    params,
  );
  return (res.data as unknown as ApiResponse<IAttendanceStatus>).data;
};

/**
 * POST /attendance/clock-in-clock-out
 * Toggles clock state for the authenticated user.
 * Body: { uid, ulId? }
 */
export const clockInClockOut = async (params: {
  uid: string;
  ulId?: string | null;
}): Promise<IUserLog> => {
  const body: Record<string, string> = { uid: params.uid };
  if (params.ulId) body.ulId = params.ulId;

  const res = await axiosInstance.post<ApiResponse<IUserLog>>(
    API_ROUTES.ATTENDANCE.CLOCK,
    body,
  );
  return (res.data as unknown as ApiResponse<IUserLog>).data;
};

/**
 * GET /attendance/logs
 * Returns date-wise grouped logs + summary.
 * Auth: jwt (user sees own logs; admin can pass uid to see others).
 */
export const fetchAttendanceLogs = async (params: {
  count?: number;
  limit?: number;
  startTimestamp?: number | null;
  endTimestamp?: number | null;
  uid?: string | null;
}): Promise<{ logs: IDateWiseLog[]; summary: IAttendanceSummary; total: number }> => {
  const query = new URLSearchParams();
  if (params.count) query.set('count', String(params.count));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.startTimestamp) query.set('startTimestamp', String(params.startTimestamp));
  if (params.endTimestamp) query.set('endTimestamp', String(params.endTimestamp));
  if (params.uid) query.set('uid', params.uid);

  const url = `${API_ROUTES.ATTENDANCE.LOGS}?${query.toString()}`;
  const res = await axiosInstance.get<ApiResponse<LogsResponseData>>(url);
  const d = (res.data as unknown as ApiResponse<LogsResponseData>);
  return {
    logs: d.data.userLogs ?? [],
    summary: d.data.attendanceSummary,
    total: d.meta?.totalItems ?? 0,
  };
};

/**
 * GET /attendance/logs/today  (Admin only)
 * Returns today's clock-in/out snapshot for all employees.
 */
export const fetchTodayAttendanceLogs = async (params: {
  count?: number;
  limit?: number;
  search?: string;
}): Promise<{ entries: ITodayAttendanceEntry[]; total: number }> => {
  const query = new URLSearchParams();
  if (params.count) query.set('count', String(params.count));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);

  const url = `${API_ROUTES.ATTENDANCE.TODAY_LOGS}?${query.toString()}`;
  const res = await axiosInstance.get<ApiResponse<ITodayAttendanceEntry[]>>(url);
  const d = (res.data as unknown as ApiResponse<ITodayAttendanceEntry[]>);
  return { entries: d.data ?? [], total: d.meta?.totalItems ?? 0 };
};

/**
 * GET /attendance/timestamps  (Admin only)
 * Returns per-user, per-day/week hours grid.
 */
export const fetchAttendanceTimestamps = async (params: {
  startTimestamp: number;
  endTimestamp: number;
  calenderSlotType: 'DAY' | 'WEEK';
  count?: number;
  limit?: number;
  search?: string;
}): Promise<{ entries: ITimestampEntry[]; total: number; slotType: string }> => {
  const query = new URLSearchParams({
    startTimestamp: String(params.startTimestamp),
    endTimestamp: String(params.endTimestamp),
    calenderSlotType: params.calenderSlotType,
  });
  if (params.count) query.set('count', String(params.count));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);

  const url = `${API_ROUTES.ATTENDANCE.TIMESTAMPS}?${query.toString()}`;
  const res = await axiosInstance.get<ApiResponse<TimestampsResponseData>>(url);
  const d = (res.data as unknown as ApiResponse<TimestampsResponseData>);
  return {
    entries: d.data.attendanceData ?? [],
    total: d.meta?.totalItems ?? 0,
    slotType: d.data.calenderSlotType,
  };
};

/**
 * POST /attendance/log  (Admin only)
 * Adds a manual attendance log for an employee.
 * Body: { uid, checkedInAt, checkedOutAt } — epoch ms.
 */
export const addManualAttendanceLog = async (params: {
  uid: string;
  checkedInAt: number;
  checkedOutAt: number;
}): Promise<IUserLog> => {
  const res = await axiosInstance.post<ApiResponse<IUserLog>>(
    API_ROUTES.ATTENDANCE.MANUAL_LOG,
    params,
  );
  return (res.data as unknown as ApiResponse<IUserLog>).data;
};

/**
 * DELETE /attendance/logs  (Admin only)
 * Deletes specified log entries by their IDs.
 * Body: { userLogIds: string[] }
 */
export const deleteAttendanceLogs = async (userLogIds: string[]): Promise<void> => {
  await axiosInstance.delete(API_ROUTES.ATTENDANCE.LOGS, {
    data: { userLogIds },
  });
};
