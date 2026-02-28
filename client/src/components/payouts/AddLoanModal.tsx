// ============================================================================
// ADD LOAN MODAL COMPONENT
// OpsPilot · FE-06 · Admin Only
// Adds a loan deduction amount to an employee's record.
// ============================================================================
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, DollarSign, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import type { IEmployee } from '@/store/employees/employees.types';

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================
const addLoanSchema = z.object({
  uid: z.string().min(1, 'Please select an employee'),
  loanAmount: z
    .number()
    .min(1, 'Loan amount must be at least $1'),
});

type AddLoanFormValues = z.infer<typeof addLoanSchema>;

// ============================================================================
// TYPES
// ============================================================================
interface AddLoanModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (params: { uid: string; loanAmount: number }) => void;
  submitting?: boolean;
  employees: Pick<IEmployee, 'uid' | 'fullName' | 'loanAmount'>[];
}

// ============================================================================
// COMPONENT
// ============================================================================
const AddLoanModal: React.FC<AddLoanModalProps> = ({
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
    watch,
    formState: { errors },
  } = useForm<AddLoanFormValues>({
    resolver: zodResolver(addLoanSchema),
    defaultValues: { uid: '', loanAmount: 0 },
  });

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => { if (open) reset(); }, [open, reset]);

  const selectedUid = watch('uid');
  const selectedEmployee = employees.find((e) => e.uid === selectedUid);

  const handleFormSubmit = (data: AddLoanFormValues) => {
    onSubmit({ uid: data.uid, loanAmount: data.loanAmount });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-loan-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] dark:border-[#2E2E2E] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#2A2A2A] dark:border-[#2E2E2E]">
          <div className="flex items-center gap-2.5">
            <span className="text-[#D4AF37]"><DollarSign size={18} /></span>
            <h2 id="add-loan-title" className="text-base font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">Add Loan</h2>
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
            {errors.uid && <p className="text-xs text-[#C0392B]">{errors.uid.message}</p>}
          </div>

          {/* Current loan info */}
          {selectedEmployee && selectedEmployee.loanAmount > 0 && (
            <div className="rounded-lg bg-[#FAF7E8] dark:bg-[#1E1E1E] border border-[#2A2A2A] dark:border-[#2E2E2E] px-4 py-2.5">
              <p className="text-xs text-[#9A9A9A] dark:text-[#666666]">
                Current loan: <span className="text-[#C0392B] font-semibold">${selectedEmployee.loanAmount}</span>
              </p>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA]">
              Loan Amount <span className="text-[#C0392B] ml-0.5">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] text-sm">$</span>
              <input
                type="number"
                step="0.01"
                min="1"
                {...register('loanAmount', { valueAsNumber: true })}
                className={`w-full h-9 pl-7 pr-3 rounded-md text-sm border bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] outline-none transition-all
                  ${errors.loanAmount
                    ? 'border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]'
                    : 'border-[#E8E0B8] dark:border-[#2E2E2E] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent'
                  }`}
                placeholder="0.00"
              />
            </div>
            {errors.loanAmount && <p className="text-xs text-[#C0392B]">{errors.loanAmount.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" size="md" onClick={onClose} disabled={submitting}>Cancel</Button>
            <Button type="submit" variant="primary" size="md" loading={submitting}>
              {submitting ? <><Loader2 size={14} className="animate-spin mr-1.5" />Adding…</> : 'Add Loan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLoanModal;
