// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { createEmployeeThunk } from '@/store/employees/employees.thunk';
import { selectEmployeesSubmitting } from '@/store/employees/employees.slice';
import { APP_ROUTES } from '@/utils/routes';
import EmployeeForm from '@/components/employees/EmployeeForm';
import type { ICreateEmployeePayload } from '@/store/employees/employees.types';

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const CreateEmployee: React.FC = () => {
  // ── HOOKS ──────────────────────────────────────────────────────────────────
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const submitting = useAppSelector(selectEmployeesSubmitting);

  // ── HANDLERS ───────────────────────────────────────────────────────────────
  const handleSubmit = async (data: ICreateEmployeePayload) => {
    const result = await dispatch(createEmployeeThunk(data));
    if (createEmployeeThunk.fulfilled.match(result)) {
      navigate(APP_ROUTES.EMPLOYEES.LIST);
    }
  };

  const handleCancel = () => navigate(APP_ROUTES.EMPLOYEES.LIST);

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
            <UserPlus size={22} className="text-[#D4AF37]" />
            Create Employee
          </h1>
          <p className="text-sm text-[#9A9A9A] dark:text-[#666666] mt-0.5">
            Fill in the details to add a new team member.
          </p>
        </div>
      </div>

      {/* ── Form card ── */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E8E0B8] dark:border-[#2E2E2E] shadow-sm p-6">
        <EmployeeForm
          mode="create"
          submitting={submitting}
          onSubmit={(data) => handleSubmit(data as ICreateEmployeePayload)}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default CreateEmployee;
