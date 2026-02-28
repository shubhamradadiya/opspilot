// ============================================================================
// IMPORTS
// ============================================================================
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, RefreshCw, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchEmployeesThunk } from '@/store/employees/employees.thunk';
import {
  selectEmployeeList,
  selectEmployeesLoading,
  selectEmployeesError,
  selectEmployeeFilters,
  setFilters,
  resetFilters,
} from '@/store/employees/employees.slice';
import { Button } from '@/components/ui';
import EmployeeTable from '@/components/employees/EmployeeTable';
import { APP_ROUTES } from '@/utils/routes';

// ============================================================================
// CONSTANTS
// ============================================================================
const ROLE_OPTIONS = [
  { value: 'all', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const EmployeeList: React.FC = () => {
  // ── HOOKS ──────────────────────────────────────────────────────────────────
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const employees = useAppSelector(selectEmployeeList);
  const loading = useAppSelector(selectEmployeesLoading);
  const error = useAppSelector(selectEmployeesError);
  const filters = useAppSelector(selectEmployeeFilters);

  // ── LOCAL STATE ────────────────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState(filters.search);

  // ── EFFECTS ────────────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchEmployeesThunk());
  }, [dispatch]);

  // Debounce search input → filter (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchInput }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  // ── HANDLERS ───────────────────────────────────────────────────────────────
  const handleRefresh = () => {
    dispatch(fetchEmployeesThunk());
  };

  const handleReset = () => {
    setSearchInput('');
    dispatch(resetFilters());
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5] flex items-center gap-2">
            <Users size={24} className="text-[#D4AF37]" />
            Employees
          </h1>
          <p className="text-sm text-[#9A9A9A] dark:text-[#666666] mt-1">
            Manage your team — {employees.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            aria-label="Refresh employees"
            className="p-2 rounded-lg border border-[#E8E0B8] dark:border-[#2E2E2E] text-[#5A5A5A] dark:text-[#AAAAAA] hover:bg-[#F5F0D0] dark:hover:bg-[#252525] transition-colors cursor-pointer"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(APP_ROUTES.EMPLOYEES.CREATE)}
          >
            <UserPlus size={16} className="mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] dark:text-[#666666]"
          />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-md text-sm border border-[#E8E0B8] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] placeholder-[#9A9A9A] dark:placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
          />
        </div>

        {/* Role filter */}
        <select
          value={filters.role}
          onChange={(e) =>
            dispatch(setFilters({ role: e.target.value as 'all' | 'admin' | 'user' }))
          }
          className="h-9 px-3 rounded-md text-sm border border-[#E8E0B8] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all min-w-[130px]"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={filters.isActive}
          onChange={(e) =>
            dispatch(
              setFilters({ isActive: e.target.value as 'all' | 'active' | 'inactive' }),
            )
          }
          className="h-9 px-3 rounded-md text-sm border border-[#E8E0B8] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all min-w-[130px]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Reset filters */}
        {(filters.search || filters.role !== 'all' || filters.isActive !== 'all') && (
          <button
            type="button"
            onClick={handleReset}
            className="h-9 px-3 rounded-md text-sm text-[#D4AF37] border border-[#D4AF37] hover:bg-[#F0DFA0]/30 transition-colors cursor-pointer whitespace-nowrap"
          >
            Reset
          </button>
        )}
      </div>

      {/* ── Error state ── */}
      {error && (
        <div className="rounded-xl border border-[#C0392B]/30 bg-[#FFF5F5] dark:bg-[rgba(192,57,43,0.08)] p-4">
          <p className="text-sm text-[#C0392B] dark:text-[#E05A4A]">{error}</p>
        </div>
      )}

      {/* ── Table ── */}
      <EmployeeTable employees={employees} loading={loading} />
    </div>
  );
};

export default EmployeeList;
