// ============================================================================
// MANUAL LOG MODAL COMPONENT
// OpsPilot · FE-05 · Admin Only
// Allows admins to add a manual clock-in/out entry for any employee.
// ============================================================================
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Clock, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import type { IEmployee } from '@/store/employees/employees.types';

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================
const manualLogSchema = z
  .object({
    uid: z.string().min(1, 'Please select an employee'),
    checkedInAt: z.string().min(1, 'Clock-in time required'),
    checkedOutAt: z.string().min(1, 'Clock-out time required'),
  })
  .refine(
    (data) => new Date(data.checkedInAt).getTime() < new Date(data.checkedOutAt).getTime(),
    { message: 'Clock-out must be after clock-in', path: ['checkedOutAt'] },
  );

type ManualLogFormValues = z.infer<typeof manualLogSchema>;

// ============================================================================
// TYPES
// ============================================================================
interface ManualLogModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (params: { uid: string; checkedInAt: number; checkedOutAt: number }) => void;
  submitting?: boolean;
  employees: Pick<IEmployee, 'uid' | 'fullName'>[];
}

// ============================================================================
// COMPONENT
// ============================================================================
const ManualLogModal: React.FC<ManualLogModalProps> = ({
  open,
  onClose,
  onSubmit,
  submitting = false,
  employees,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualLogFormValues>({
    resolver: zodResolver(manualLogSchema),
  });

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Reset on open
  useEffect(() => { if (open) reset(); }, [open, reset]);

  const handleFormSubmit = (data: ManualLogFormValues) => {
    onSubmit({
      uid: data.uid,
      checkedInAt: new Date(data.checkedInAt).getTime(),
      checkedOutAt: new Date(data.checkedOutAt).getTime(),
    });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="manual-log-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E8E0B8] dark:border-[#2E2E2E] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E8E0B8] dark:border-[#2E2E2E]">
          <div className="flex items-center gap-2.5">
            <span className="text-[#D4AF37]"><Clock size={18} /></span>
            <h2 id="manual-log-title" className="text-base font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
              Add Manual Log
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9A9A9A] hover:text-[#2A2A2A] dark:hover:text-[#F5F5F5] hover:bg-[#E8E0B8]/40 dark:hover:bg-[#2E2E2E] transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="px-6 py-5 space-y-4">
          {/* Employee select */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA]">
              Employee <span className="text-[#C0392B] ml-0.5">*</span>
            </label>
            <select
              {...register('uid')}
              className={`w-full h-9 px-3 rounded-md text-sm border bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] outline-none transition-all
                ${errors.uid
                  ? 'border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]'
                  : 'border-[#E8E0B8] dark:border-[#2E2E2E] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent'
                }`}
            >
              <option value="">Select employee…</option>
              {employees.map((e) => (
                <option key={e.uid} value={e.uid}>{e.fullName}</option>
              ))}
            </select>
            {errors.uid && (
              <p className="text-xs text-[#C0392B]">{errors.uid.message}</p>
            )}
          </div>

          {/* Clock In */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA]">
              Clock In <span className="text-[#C0392B] ml-0.5">*</span>
            </label>
            <Input
              type="datetime-local"
              error={errors.checkedInAt?.message}
              {...register('checkedInAt')}
            />
          </div>

          {/* Clock Out */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA]">
              Clock Out <span className="text-[#C0392B] ml-0.5">*</span>
            </label>
            <Input
              type="datetime-local"
              error={errors.checkedOutAt?.message}
              {...register('checkedOutAt')}
            />
            {errors.checkedOutAt && (
              <p className="text-xs text-[#C0392B]">{errors.checkedOutAt.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" size="md" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={submitting}>
              {submitting ? <><Loader2 size={14} className="animate-spin mr-1.5" />Adding…</> : 'Add Log'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualLogModal;
