// ============================================================================
// IMPORTS
// ============================================================================
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/auth.slice';
import dashboardReducer from './dashboard/dashboard.slice';
import employeesReducer from './employees/employees.slice';

// ============================================================================
// ROOT REDUCER
// ============================================================================
export const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  employees: employeesReducer,
});

