// ============================================================================
// IMPORTS
// ============================================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
  selectEmployeesSubmitting,
  selectEmployeeFilters,
} from '@/store/employees/employees.slice';
import { toggleEmployeeStatusThunk } from '@/store/employees/employees.thunk';
import { APP_ROUTES } from '@/utils/routes';
import EmployeeStatusBadge from './EmployeeStatusBadge';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';
import { deleteEmployeeThunk } from '@/store/employees/employees.thunk';
import type { IEmployee } from '@/store/employees/employees.types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface EmployeeTableProps {
  employees: IEmployee[];
  loading?: boolean;
}

// ============================================================================
// HELPERS
// ============================================================================
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
};

const formatPhone = (countryCode: string, phone: string): string =>
  `${countryCode} ${phone}`;

// ============================================================================
// SKELETON ROW
// ============================================================================
const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-[#F0EDD0] dark:border-[#222222]">
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-[#F5F0D0] dark:bg-[#252525] rounded" />
      </td>
    ))}
  </tr>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, loading = false }) => {
  // ── HOOKS ──────────────────────────────────────────────────────────────────
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const submitting = useAppSelector(selectEmployeesSubmitting);
  const filters = useAppSelector(selectEmployeeFilters);

  // ── LOCAL STATE ────────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] =
    useState<{ uid: string; name: string } | null>(null);

  // ── COMPUTED — client-side filtering ──────────────────────────────────────
  const filtered = employees.filter((emp) => {
    const search = filters.search.toLowerCase();
    const matchesSearch =
      !search ||
      emp.fullName.toLowerCase().includes(search) ||
      (emp.email ?? '').toLowerCase().includes(search);

    const matchesRole =
      filters.role === 'all' || emp.role === filters.role;

    const matchesStatus =
      filters.isActive === 'all' ||
      (filters.isActive === 'active' ? emp.isActive : !emp.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // ── HANDLERS ───────────────────────────────────────────────────────────────
  const handleToggleStatus = (uid: string) => {
    dispatch(toggleEmployeeStatusThunk(uid));
  };

  const handleEdit = (uid: string) => {
    navigate(APP_ROUTES.EMPLOYEES.EDIT.replace(':uid', uid));
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await dispatch(deleteEmployeeThunk(deleteTarget.uid));
    setDeleteTarget(null);
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* ── Table Head ── */}
            <thead>
              <tr className="bg-[#F5F0D0] dark:bg-[#252525] border-b border-[#2A2A2A] dark:border-[#2E2E2E]">
                {['Employee', 'Phone', 'Role', 'Rate/hr', 'Status', 'Toggle', 'Actions'].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#9A9A9A]"
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            {/* ── Table Body ── */}
            <tbody>
              {/* Loading skeletons */}
              {loading &&
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

              {/* Empty state */}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-16 text-center text-[#9A9A9A] dark:text-[#666666]"
                  >
                    <p className="text-base font-medium mb-1">No employees found</p>
                    <p className="text-sm">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!loading &&
                filtered.map((emp) => (
                  <tr
                    key={emp.uid}
                    className="border-b border-[#F0EDD0] dark:border-[#222222] hover:bg-[#FDFBD4] dark:hover:bg-[#252525] transition-colors even:bg-[#FEFDF0] dark:even:bg-[#1A1A1A]"
                  >
                    {/* Employee avatar + name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#F0DFA0] dark:bg-[rgba(212,175,55,0.15)] flex items-center justify-center">
                          <span className="text-xs font-bold text-[#D4AF37]">
                            {getInitials(emp.fullName)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-[#2A2A2A] dark:text-[#F5F5F5]">
                            {emp.fullName}
                          </p>
                          {emp.email && (
                            <p className="text-xs text-[#9A9A9A] dark:text-[#666666]">
                              {emp.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3 text-[#5A5A5A] dark:text-[#AAAAAA]">
                      {formatPhone(emp.countryCode, emp.phone)}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          emp.role === 'admin'
                            ? 'bg-[#EDD6F5] text-[#6A3A8A] dark:bg-[rgba(106,58,138,0.2)] dark:text-[#9A6ABA]'
                            : 'bg-[#F0EDD0] text-[#5A5A5A] dark:bg-[rgba(90,90,90,0.2)] dark:text-[#AAAAAA]'
                        }`}
                      >
                        {emp.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </span>
                    </td>

                    {/* Per-hour rate */}
                    <td className="px-4 py-3 text-[#5A5A5A] dark:text-[#AAAAAA] font-mono text-sm">
                      ${emp.perHourRate.toFixed(2)}
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3">
                      <EmployeeStatusBadge isActive={emp.isActive} size="sm" />
                    </td>

                    {/* Status toggle */}
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(emp.uid)}
                        disabled={submitting}
                        aria-label={`Toggle ${emp.fullName} status`}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 disabled:opacity-40 ${
                          emp.isActive ? 'bg-[#D4AF37]' : 'bg-[#E8E0B8] dark:bg-[#2E2E2E]'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                            emp.isActive ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(emp.uid)}
                          aria-label={`Edit ${emp.fullName}`}
                          className="p-1.5 rounded-lg text-[#5A5A5A] dark:text-[#AAAAAA] hover:bg-[#F0DFA0] dark:hover:bg-[rgba(212,175,55,0.1)] hover:text-[#D4AF37] transition-colors cursor-pointer"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({ uid: emp.uid, name: emp.fullName })
                          }
                          aria-label={`Delete ${emp.fullName}`}
                          className="p-1.5 rounded-lg text-[#5A5A5A] dark:text-[#AAAAAA] hover:bg-[#FADADD] dark:hover:bg-[rgba(192,57,43,0.1)] hover:text-[#C0392B] dark:hover:text-[#E05A4A] transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <DeleteConfirmModal
          entityName={deleteTarget.name}
          entityType="Employee"
          loading={submitting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
};

export default EmployeeTable;
