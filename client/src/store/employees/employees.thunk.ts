// ============================================================================
// IMPORTS
// ============================================================================
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import * as employeesApi from '@/api/employees.api';
import { optimisticToggleStatus, revertToggleStatus } from './employees.slice';
import type { ICreateEmployeePayload, IUpdateEmployeePayload, IEmployee, IPaginationMeta } from './employees.types';
import type { AppDispatch } from '@/store/store';

// ============================================================================
// THUNKS
// ============================================================================

/**
 * Fetch all employees from the backend with optional filters.
 */
export const fetchEmployeesThunk = createAsyncThunk<
  { users: IEmployee[]; meta: IPaginationMeta; summary: { totalUsers: number; activeUsers: number; inactiveUsers: number } },
  employeesApi.IGetEmployeesParams | undefined,
  { rejectValue: string }
>('employees/fetchAll', async (params, { rejectWithValue }) => {
  try {
    return await employeesApi.getAllEmployees(params);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to load employees';
    return rejectWithValue(msg);
  }
});

/**
 * Create a new employee.
 */
export const createEmployeeThunk = createAsyncThunk<
  IEmployee,
  ICreateEmployeePayload,
  { rejectValue: string }
>('employees/create', async (dto, { rejectWithValue }) => {
  try {
    const employee = await employeesApi.createEmployee(dto);
    toast.success('Employee created successfully');
    return employee;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to create employee';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

/**
 * Update an existing employee.
 */
export const updateEmployeeThunk = createAsyncThunk<
  IEmployee,
  { uid: string; dto: IUpdateEmployeePayload },
  { rejectValue: string }
>('employees/update', async ({ uid, dto }, { rejectWithValue }) => {
  try {
    const employee = await employeesApi.updateEmployee(uid, dto);
    toast.success('Employee updated successfully');
    return employee;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update employee';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

/**
 * Toggle employee active/inactive status with optimistic update.
 * UI is updated immediately; reverted if the API call fails.
 */
export const toggleEmployeeStatusThunk = createAsyncThunk<
  void,
  string,
  { dispatch: AppDispatch; rejectValue: string }
>('employees/toggleStatus', async (uid, { dispatch, rejectWithValue }) => {
  // ── Optimistic: flip immediately ─────────────────────────────────────────
  dispatch(optimisticToggleStatus(uid));
  try {
    await employeesApi.toggleEmployeeStatus(uid);
    toast.success('Status updated');
  } catch (error: unknown) {
    // ── Revert on failure ──────────────────────────────────────────────────
    dispatch(revertToggleStatus(uid));
    const msg = error instanceof Error ? error.message : 'Failed to update status';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

/**
 * Soft-delete an employee by uid.
 */
export const deleteEmployeeThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('employees/delete', async (uid, { rejectWithValue }) => {
  try {
    await employeesApi.deleteEmployee(uid);
    toast.success('Employee deleted');
    return uid;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to delete employee';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});
