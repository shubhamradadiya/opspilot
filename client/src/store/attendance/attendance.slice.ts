// ============================================================================
// ATTENDANCE REDUX SLICE
// OpsPilot · FE-05
// ============================================================================
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  IAttendanceState,
  IAttendanceStatus,
  IDateWiseLog,
  IAttendanceSummary,
  ITodayAttendanceEntry,
  ITimestampEntry,
  IAttendanceFilters,
} from './attendance.types';
import { getCurrentWeekRange } from '@/utils/formatters';

// ============================================================================
// INITIAL STATE
// ============================================================================
const { start, end } = getCurrentWeekRange();

const initialState: IAttendanceState = {
  status: null,
  logs: [],
  summary: null,
  todayLogs: [],
  timestamps: [],
  filters: {
    search: '',
    startTimestamp: start,
    endTimestamp: end,
    selectedUid: null,
    calenderSlotType: 'DAY',
  },
  statusLoading: false,
  clockLoading: false,
  logsLoading: false,
  timestampsLoading: false,
  submitting: false,
  error: null,
};

// ============================================================================
// SLICE
// ============================================================================
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    // ── Loading flags ─────────────────────────────────────────────────────────
    setStatusLoading: (state, action: PayloadAction<boolean>) => {
      state.statusLoading = action.payload;
    },
    setClockLoading: (state, action: PayloadAction<boolean>) => {
      state.clockLoading = action.payload;
    },
    setLogsLoading: (state, action: PayloadAction<boolean>) => {
      state.logsLoading = action.payload;
    },
    setTimestampsLoading: (state, action: PayloadAction<boolean>) => {
      state.timestampsLoading = action.payload;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.submitting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // ── Data setters ──────────────────────────────────────────────────────────
    setStatus: (state, action: PayloadAction<IAttendanceStatus>) => {
      state.status = action.payload;
    },
    setLogs: (state, action: PayloadAction<IDateWiseLog[]>) => {
      state.logs = action.payload;
    },
    setSummary: (state, action: PayloadAction<IAttendanceSummary>) => {
      state.summary = action.payload;
    },
    setTodayLogs: (state, action: PayloadAction<ITodayAttendanceEntry[]>) => {
      state.todayLogs = action.payload;
    },
    setTimestamps: (state, action: PayloadAction<ITimestampEntry[]>) => {
      state.timestamps = action.payload;
    },

    // ── Filters ───────────────────────────────────────────────────────────────
    setFilters: (state, action: PayloadAction<Partial<IAttendanceFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // ── Optimistic: remove log from list after delete ─────────────────────────
    removeLogById: (state, action: PayloadAction<string>) => {
      state.logs = state.logs
        .map((group) => ({
          ...group,
          logs: group.logs.filter((l) => l.ulId !== action.payload),
        }))
        .filter((group) => group.logs.length > 0);
    },
  },
});

export const {
  setStatusLoading,
  setClockLoading,
  setLogsLoading,
  setTimestampsLoading,
  setSubmitting,
  setError,
  setStatus,
  setLogs,
  setSummary,
  setTodayLogs,
  setTimestamps,
  setFilters,
  resetFilters,
  removeLogById,
} = attendanceSlice.actions;

export const attendanceReducer = attendanceSlice.reducer;
export default attendanceSlice.reducer;
