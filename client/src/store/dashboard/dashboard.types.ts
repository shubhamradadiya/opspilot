// ============================================================================
// DASHBOARD TYPE DEFINITIONS
// OpsPilot · FE-03
// ============================================================================

// ============================================================================
// API RESPONSE TYPES (from existing endpoints)
// ============================================================================

/** Employee summary from GET /api/v1/employee */
export interface IEmployeeSummary {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

/** Single attendance entry from GET /api/v1/attendance/today-logs */
export interface ITodayAttendanceEntry {
  userId: string;
  fullName: string;
  countryCode?: string;
  phone?: string;
  attendanceStatus: string;
  userLogs: {
    ulId: string;
    status: string;
    checkedInAt: number;
    checkedOutAt: number | null;
    createdAt: number;
  }[];
  totalHours: number;
}

/** Inventory record from GET /api/v1/inventory */
export interface IInventoryRecord {
  iId: string;
  type: string;
  carTires: number;
  truckTires: number;
  mixedTires: number;
  bales: number;
  createdAt: string;
  user?: { fullName: string };
}

export interface IInventoryActivity {
  ilId: string;
  text: string;
  createdAt: string;
  isRead: boolean;
  user?: { fullName: string; email?: string };
}

/** Expense record from GET /api/v1/expenses */
export interface IExpenseRecord {
  eId: string;
  vendorName: string;
  amount: number;
  type: string;
  createdAt: string;
}

// ============================================================================
// COMPOSED DASHBOARD DATA
// ============================================================================

export interface IDashboardData {
  /** Employee stats */
  employeeSummary: IEmployeeSummary;

  /** Today's attendance entries */
  todayAttendance: ITodayAttendanceEntry[];
  todayClockedIn: number;
  todayAbsent: number;

  /** Inventory totals */
  inventoryTotals: {
    carTires: number;
    truckTires: number;
    mixedTires: number;
    bales: number;
  };

  /** Recent inventory records */
  recentInventory: IInventoryRecord[];

  /** Recent inventory activity log */
  recentActivity: IInventoryActivity[];

  /** Expense data */
  recentExpenses: IExpenseRecord[];
  totalMonthlyExpense: number;
}

// ============================================================================
// STATS CARD TYPE
// ============================================================================

export interface IStatsCardData {
  id: string;
  title: string;
  value: number | string;
  subtitle: string;
  icon: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
}

// ============================================================================
// DASHBOARD STATE
// ============================================================================

export interface IDashboardState {
  data: IDashboardData | null;
  loading: boolean;
  error: string | null;
}
