// ============================================================================
// IMPORTS
// ============================================================================
import axiosInstance from '@/utils/axiosInstance';
import { API_ROUTES } from '@/utils/routes';
import type {
  IDashboardData,
  IEmployeeSummary,
  ITodayAttendanceEntry,
  IInventoryRecord,
  IInventoryActivity,
  IExpenseRecord,
} from '@/store/dashboard/dashboard.types';

// ============================================================================
// TYPE — API Response shapes
// ============================================================================
interface EmployeeResponse {
  data: {
    summary: IEmployeeSummary;
    users: unknown[];
  };
}

interface AttendanceResponse {
  data: ITodayAttendanceEntry[];
}

interface InventoryResponse {
  data: IInventoryRecord[];
}

interface ActivityLogResponse {
  data: IInventoryActivity[];
}

interface ExpenseResponse {
  data: {
    expenses: IExpenseRecord[];
    totalExpense: number;
  };
}

// ============================================================================
// HELPERS
// ============================================================================

/** Safely extract data from a settled promise result */
function settled<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === 'fulfilled' ? result.value : null;
}

// ============================================================================
// API — fetchDashboardData
// ============================================================================

/**
 * Fetches dashboard data by calling existing backend endpoints in parallel.
 * Uses Promise.allSettled so a single failing endpoint won't crash the
 * entire dashboard — partial data is still displayed.
 */
export const fetchDashboardData = async (): Promise<IDashboardData> => {
  const results = await Promise.allSettled([
    axiosInstance.get<EmployeeResponse>(API_ROUTES.ADMIN.EMPLOYEES),
    axiosInstance.get<AttendanceResponse>(API_ROUTES.ADMIN.TODAY_ATTENDANCE),
    axiosInstance.get<InventoryResponse>(API_ROUTES.ADMIN.INVENTORY, {
      params: { limit: 10 },
    }),
    axiosInstance.get<ActivityLogResponse>(API_ROUTES.ADMIN.ACTIVITY_LOGS, {
      params: { limit: 5 },
    }),
    axiosInstance.get<ExpenseResponse>(API_ROUTES.ADMIN.EXPENSES, {
      params: { limit: 5 },
    }),
  ]);

  const employeeRes = settled(results[0]);
  const attendanceRes = settled(results[1]);
  const inventoryRes = settled(results[2]);
  const activityRes = settled(results[3]);
  const expenseRes = settled(results[4]);

  // ── Extract employee summary ────────────────────────────────────────────
  const empData = employeeRes?.data as unknown as EmployeeResponse | undefined;
  const employeeSummary: IEmployeeSummary = empData?.data?.summary ?? {
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  };

  // ── Extract today's attendance ──────────────────────────────────────────
  const attData = attendanceRes?.data as unknown as AttendanceResponse | undefined;
  const todayAttendance: ITodayAttendanceEntry[] = Array.isArray(attData?.data)
    ? attData.data
    : [];

  console.log("todayAttendance", todayAttendance);
  const todayClockedIn = todayAttendance.filter((e) => e.userLogs && e.userLogs.length > 0).length;
  const todayAbsent = Math.max(0, employeeSummary.activeUsers - todayClockedIn);

  // ── Extract inventory ───────────────────────────────────────────────────
  const invData = inventoryRes?.data as unknown as InventoryResponse | undefined;
  const recentInventory: IInventoryRecord[] = Array.isArray(invData?.data)
    ? invData.data
    : [];

  const inventoryTotals = recentInventory.reduce(
    (acc, rec) => ({
      carTires: acc.carTires + (rec.carTires || 0),
      truckTires: acc.truckTires + (rec.truckTires || 0),
      mixedTires: acc.mixedTires + (rec.mixedTires || 0),
      bales: acc.bales + (rec.bales || 0),
    }),
    { carTires: 0, truckTires: 0, mixedTires: 0, bales: 0 },
  );

  // ── Extract activity logs ───────────────────────────────────────────────
  const actData = activityRes?.data as unknown as ActivityLogResponse | undefined;
  const recentActivity: IInventoryActivity[] = Array.isArray(actData?.data)
    ? actData.data
    : [];

  // ── Extract expenses ────────────────────────────────────────────────────
  const expData = expenseRes?.data as unknown as ExpenseResponse | undefined;
  const recentExpenses: IExpenseRecord[] = Array.isArray(expData?.data?.expenses)
    ? expData.data.expenses
    : [];
  const totalMonthlyExpense = expData?.data?.totalExpense ?? 0;

  console.log("employeeSummary", employeeSummary);
  console.log("todayAttendance", todayAttendance);
  console.log("todayClockedIn", todayClockedIn);
  console.log("todayAbsent", todayAbsent);
  console.log("inventoryTotals", inventoryTotals);
  console.log("recentInventory", recentInventory);
  console.log("recentActivity", recentActivity);
  console.log("recentExpenses", recentExpenses);
  console.log("totalMonthlyExpense", totalMonthlyExpense);

  return {
    employeeSummary,
    todayAttendance,
    todayClockedIn,
    todayAbsent,
    inventoryTotals,
    recentInventory,
    recentActivity,
    recentExpenses,
    totalMonthlyExpense,
  };
};
