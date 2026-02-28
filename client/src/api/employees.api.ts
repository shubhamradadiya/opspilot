// ============================================================================
// IMPORTS
// ============================================================================
import axiosInstance from '@/utils/axiosInstance';
import { API_ROUTES } from '@/utils/routes';
import type {
  IEmployee,
  ICreateEmployeePayload,
  IUpdateEmployeePayload,
  IPaginationMeta,
} from '@/store/employees/employees.types';

// ============================================================================
// TYPE — API Response shapes
// ============================================================================
interface EmployeeSummary {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

interface GetEmployeesResponse {
  statusCode: number;
  message: string;
  data: {
    summary: EmployeeSummary;
    users: IEmployee[];
  };
  meta: IPaginationMeta;
}

interface EmployeeResponse {
  statusCode: number;
  message: string;
  data: IEmployee;
}

// ============================================================================
// QUERY PARAMS TYPE
// ============================================================================
export interface IGetEmployeesParams {
  search?: string;
  count?: number;
  limit?: number;
  isActive?: boolean;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * GET /api/v1/employee
 * Fetch paginated list of all employees with optional filters.
 */
export const getAllEmployees = async (
  params?: IGetEmployeesParams,
): Promise<{ users: IEmployee[]; meta: IPaginationMeta; summary: EmployeeSummary }> => {
  const response = await axiosInstance.get<GetEmployeesResponse>(
    API_ROUTES.ADMIN.EMPLOYEES,
    { params },
  );
  const { data } = response.data as unknown as GetEmployeesResponse;
  const meta = (response.data as unknown as GetEmployeesResponse).meta;
  return {
    users: data?.users ?? [],
    meta,
    summary: data?.summary ?? { totalUsers: 0, activeUsers: 0, inactiveUsers: 0 },
  };
};

/**
 * POST /api/v1/employee
 * Create a new employee.
 */
export const createEmployee = async (
  dto: ICreateEmployeePayload,
): Promise<IEmployee> => {
  const response = await axiosInstance.post<EmployeeResponse>(
    API_ROUTES.ADMIN.EMPLOYEES,
    dto,
  );
  return (response.data as unknown as EmployeeResponse).data;
};

/**
 * PUT /api/v1/employee/:uid
 * Update an existing employee.
 */
export const updateEmployee = async (
  uid: string,
  dto: IUpdateEmployeePayload,
): Promise<IEmployee> => {
  const response = await axiosInstance.put<EmployeeResponse>(
    `${API_ROUTES.ADMIN.EMPLOYEES}/${uid}`,
    dto,
  );
  return (response.data as unknown as EmployeeResponse).data;
};

/**
 * PATCH /api/v1/employee/:uid/status
 * Toggle employee active/inactive status.
 */
export const toggleEmployeeStatus = async (uid: string): Promise<void> => {
  await axiosInstance.patch(`${API_ROUTES.ADMIN.EMPLOYEES}/${uid}/status`);
};

/**
 * DELETE /api/v1/employee/:uid
 * Soft-delete an employee.
 */
export const deleteEmployee = async (uid: string): Promise<void> => {
  await axiosInstance.delete(`${API_ROUTES.ADMIN.EMPLOYEES}/${uid}`);
};
