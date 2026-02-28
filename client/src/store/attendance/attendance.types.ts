// ============================================================================
// ATTENDANCE TYPE DEFINITIONS
// OpsPilot · FE-05
// ============================================================================

// ============================================================================
// CLOCK STATUS — response from POST /attendance/check-status
// ============================================================================
export interface IAttendanceStatus {
  isCheckedIn: boolean;
  checkedInAt: string | null; // ISO string
  ulId: string | null;        // current open UserLog id (needed for clock-out)
}

// ============================================================================
// USER LOG ENTRY — individual clock-in/out record
// ============================================================================
export interface IUserLog {
  ulId: string;
  uid: string;
  checkedInAt: string;        // ISO string
  checkedOutAt: string | null;
  duration?: string;          // computed or returned by API
}

// ============================================================================
// DATE-WISE GROUPED LOGS — API groups by date
// ============================================================================
export interface IDateWiseLog {
  date: string;               // "2026-02-28"
  logs: IUserLog[];
  totalHours?: number;        // decimal hours for the day
}

// ============================================================================
// ATTENDANCE SUMMARY — returned alongside logs
// ============================================================================
export interface IAttendanceSummary {
  todayHours: number;
  thisWeekHours: number;
  thisWeekPayout: number;
  lastWeekPayout: number;
}

// ============================================================================
// TODAY ATTENDANCE — admin all-users snapshot
// ============================================================================
export interface ITodayAttendanceEntry {
  uid: string;
  fullName: string;
  phone: string;
  isCheckedIn: boolean;
  checkedInAt: string | null;
  checkedOutAt: string | null;
  totalHours?: number;
}

// ============================================================================
// TIMESTAMP GRID ENTRY — admin weekly grid
// ============================================================================
export interface ITimestampSlot {
  startDate: number;
  endDate: number;
  dateTest: string;
  durationInHours: number | null;
  durationInMinutes: number | null;
  durationInSeconds: number | null;
}

export interface ITimestampEntry {
  userId: string;
  fullName: string;
  countryCode: string | null;
  phone: string | null;
  profilePicture: string | null;
  totalDurationInHours: number | null;
  totalDurationInMinutes: number | null;
  totalDurationInSeconds: number | null;
  attendance: ITimestampSlot[];
}

// ============================================================================
// FILTER STATE
// ============================================================================
export interface IAttendanceFilters {
  search: string;
  startTimestamp: number | null;
  endTimestamp: number | null;
  selectedUid: string | null;  // admin: view specific employee's logs
  calenderSlotType: 'DAY' | 'WEEK';
}

// ============================================================================
// REDUX STATE
// ============================================================================
export interface IAttendanceState {
  /** Current user's clock status */
  status: IAttendanceStatus | null;
  /** Date-wise grouped log entries */
  logs: IDateWiseLog[];
  /** Attendance summary (today, week) */
  summary: IAttendanceSummary | null;
  /** Admin: today all-users snapshot */
  todayLogs: ITodayAttendanceEntry[];
  /** Admin: timestamp grid */
  timestamps: ITimestampEntry[];
  /** UI filters */
  filters: IAttendanceFilters;
  /** Clock status check loading */
  statusLoading: boolean;
  /** Clock in/out in progress */
  clockLoading: boolean;
  /** Logs fetch loading */
  logsLoading: boolean;
  /** Timestamps fetch loading */
  timestampsLoading: boolean;
  /** Create/delete in progress */
  submitting: boolean;
  error: string | null;
}
