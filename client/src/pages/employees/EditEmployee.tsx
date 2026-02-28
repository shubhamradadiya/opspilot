// ============================================================================
// IMPORTS
// ============================================================================
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UserCog, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchEmployeesThunk, updateEmployeeThunk } from '@/store/employees/employees.thunk';
import {
  selectEmployeeList,
  selectEmployeesLoading,
  selectEmployeesSubmitting,
} from '@/store/employees/employees.slice';
import { APP_ROUTES } from '@/utils/routes';
import EmployeeForm from '@/components/employees/EmployeeForm';
import type { IUpdateEmployeePayload } from '@/store/employees/employees.types';

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const EditEmployee: React.FC = () => {
  // ── HOOKS ──────────────────────────────────────────────────────────────────
  const { uid } = useParams<{ uid: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const employees = useAppSelector(selectEmployeeList);
  const loading = useAppSelector(selectEmployeesLoading);
  const submitting = useAppSelector(selectEmployeesSubmitting);

  // ── FIND EMPLOYEE ──────────────────────────────────────────────────────────
  const employee = employees.find((e) => e.uid === uid);

  // ── EFFECT: load list if empty ─────────────────────────────────────────────
  useEffect(() => {
    if (employees.length === 0) {
      dispatch(fetchEmployeesThunk());
    }
  }, [dispatch, employees.length]);

  // ── HANDLERS ───────────────────────────────────────────────────────────────
  const handleSubmit = async (data: IUpdateEmployeePayload) => {
    if (!uid) return;
    const result = await dispatch(updateEmployeeThunk({ uid, dto: data }));
    if (updateEmployeeThunk.fulfilled.match(result)) {
      navigate(APP_ROUTES.EMPLOYEES.LIST);
    }
  };

  const handleCancel = () => navigate(APP_ROUTES.EMPLOYEES.LIST);

  // ── LOADING STATE ──────────────────────────────────────────────────────────
  if (loading && !employee) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-[#F5F0D0] dark:bg-[#252525] rounded animate-pulse" />
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E8E0B8] dark:border-[#2E2E2E] p-6 space-y-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 bg-[#F5F0D0] dark:bg-[#252525] rounded" />
          ))}
        </div>
      </div>
    );
  }

  // ── NOT FOUND STATE ────────────────────────────────────────────────────────
  if (!employee && !loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-[#FADADD] dark:bg-[rgba(192,57,43,0.15)] flex items-center justify-center">
          <AlertCircle size={32} className="text-[#C0392B] dark:text-[#E05A4A]" />
        </div>
        <h2 className="text-lg font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
          Employee Not Found
        </h2>
        <p className="text-sm text-[#9A9A9A] dark:text-[#666666]">
          The employee you're looking for doesn't exist.
        </p>
        <button
          type="button"
          onClick={handleCancel}
          className="text-sm text-[#D4AF37] underline hover:text-[#CE8946] cursor-pointer"
        >
          Back to Employees
        </button>
      </div>
    );
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* ── Page header ── */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleCancel}
          aria-label="Go back"
          className="p-2 rounded-lg border border-[#E8E0B8] dark:border-[#2E2E2E] text-[#5A5A5A] dark:text-[#AAAAAA] hover:bg-[#F5F0D0] dark:hover:bg-[#252525] transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5] flex items-center gap-2">
            <UserCog size={22} className="text-[#D4AF37]" />
            Edit Employee
          </h1>
          <p className="text-sm text-[#9A9A9A] dark:text-[#666666] mt-0.5">
            Updating: <span className="font-medium text-[#D4AF37]">{employee?.fullName}</span>
          </p>
        </div>
      </div>

      {/* ── Form card ── */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E8E0B8] dark:border-[#2E2E2E] shadow-sm p-6">
        <EmployeeForm
          mode="edit"
          initialValues={employee}
          submitting={submitting}
          onSubmit={(data) => handleSubmit(data as IUpdateEmployeePayload)}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default EditEmployee;
