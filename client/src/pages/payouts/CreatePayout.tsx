// ============================================================================
// CREATE PAYOUT PAGE
// OpsPilot · FE-06 · Admin Only
// Admin form to create a payout for an employee with optional signature upload.
// ============================================================================
import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { fetchAttendanceLogs } from '@/api/attendance.api';
import { createPayoutThunk } from '@/store/payouts/payouts.thunk';
import { fetchEmployeesThunk } from '@/store/employees/employees.thunk';
import { getCurrentWeekRange } from '@/utils/formatters';
import { APP_ROUTES } from '@/utils/routes';
import { Button } from '@/components/ui';
import { DatePicker } from '@/components/ui/DatePicker';
import type { AppDispatch, RootState } from '@/store/store';

// ============================================================================
// VALIDATION
// ============================================================================
const createPayoutSchema = z.object({
  uid: z.string().min(1, 'Please select an employee'),
  amount: z.number().min(0, 'Amount must be positive'),
  loanAmount: z.number().min(0, 'Loan must be ≥ 0'),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().min(1, 'End date required'),
});

type CreatePayoutFormValues = z.infer<typeof createPayoutSchema>;

// ============================================================================
// COMPONENT
// ============================================================================
const CreatePayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { submitting } = useSelector((s: RootState) => s.payouts);
  const employees = useSelector((s: RootState) => s.employees.list);

  const [signatureFile, setSignatureFile] = React.useState<File | null>(null);
  const [estimatedAmount, setEstimatedAmount] = React.useState<number | null>(null);
  const [fetchingAmount, setFetchingAmount] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreatePayoutFormValues>({
    resolver: zodResolver(createPayoutSchema),
    defaultValues: {
      uid: '',
      amount: 0,
      loanAmount: 0,
      ...(() => {
        const { start, end } = getCurrentWeekRange();
        return {
          startDate: new Date(start).toISOString().split('T')[0],
          endDate: new Date(end).toISOString().split('T')[0],
        };
      })(),
    },
  });

  const selectedUid = watch('uid');
  const selectedEmployee = employees.find((e) => e.uid === selectedUid);
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // Auto-populate loanAmount from employee's existing loan
  useEffect(() => {
    if (selectedEmployee) {
      setValue('loanAmount', selectedEmployee.loanAmount ?? 0);
    }
  }, [selectedEmployee, setValue]);

  useEffect(() => {
    dispatch(fetchEmployeesThunk());
  }, [dispatch]);

  // Estimate amount from attendance logs for that employee
  const fetchEstimate = useCallback(async () => {
    if (!selectedUid || !startDate || !endDate) return;
    setFetchingAmount(true);
    try {
      const start = new Date(startDate).setHours(0, 0, 0, 0);
      const end = new Date(endDate).setHours(23, 59, 59, 999);
      const { summary } = await fetchAttendanceLogs({
        uid: selectedUid,
        startTimestamp: start,
        endTimestamp: end,
      });
      if (summary && selectedEmployee) {
        const estimated = summary.thisWeekPayout;
        setEstimatedAmount(estimated);
        setValue('amount', estimated);
      }
    } catch {
      // Silently fail — user can still enter amount manually
    } finally {
      setFetchingAmount(false);
    }
  }, [selectedUid, startDate, endDate, selectedEmployee, setValue]);

  // ── Form submit ───────────────────────────────────────────────────────────────
  const onSubmit = (data: CreatePayoutFormValues) => {
    const start = new Date(data.startDate).setHours(0, 0, 0, 0);
    const end = new Date(data.endDate).setHours(23, 59, 59, 999);
    dispatch(
      createPayoutThunk(
        {
          uid: data.uid,
          amount: data.amount,
          loanAmount: data.loanAmount,
          employeeSignature: signatureFile,
        },
        start,
        end,
        () => navigate(APP_ROUTES.PAYOUTS.LIST),
      ),
    );
  };

  // ── RENDER ────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-[#9A9A9A] hover:text-[#D4AF37] transition-colors"
      >
        <ArrowLeft size={16} /> Back to Payouts
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5]">Create Payout</h1>
        <p className="text-sm text-[#9A9A9A] dark:text-[#666666] mt-0.5">Issue a payment for an employee</p>
      </div>

      {/* Form card */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E8E0B8] dark:border-[#2E2E2E] p-6 space-y-6"
      >
        {/* Employee */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA]">
            Employee <span className="text-[#C0392B] ml-0.5">*</span>
          </label>
          <select
            {...register('uid')}
            className={`w-full h-9 px-3 rounded-md text-sm border bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] outline-none transition-all
              ${errors.uid
                ? 'border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]'
                : 'border-[#E8E0B8] dark:border-[#2E2E2E] focus:ring-2 focus:ring-[#D4AF37]'
              }`}
          >
            <option value="">Select employee…</option>
            {employees.map((e) => (
              <option key={e.uid} value={e.uid}>{e.fullName}</option>
            ))}
          </select>
          {errors.uid && <p className="text-xs text-[#C0392B]">{errors.uid.message}</p>}
        </div>

        {/* Employee info card */}
        {selectedEmployee && (
          <div className="rounded-xl bg-[#FAF7E8] dark:bg-[#1E1E1E] border border-[#E8E0B8] dark:border-[#2E2E2E] p-4">
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <p className="text-[#9A9A9A] dark:text-[#666666] mb-0.5">Per Hour Rate</p>
                <p className="font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
                  ${selectedEmployee.perHourRate}/hr
                </p>
              </div>
              <div>
                <p className="text-[#9A9A9A] dark:text-[#666666] mb-0.5">Current Loan</p>
                <p className="font-semibold text-[#C0392B]">${selectedEmployee.loanAmount}</p>
              </div>
            </div>
          </div>
        )}

        {/* Date range + estimate */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 pt-0.5">
            <DatePicker
              label="From *"
              value={startDate ? new Date(startDate) : null}
              onChange={(date) => {
                setValue('startDate', date ? new Date(date.setHours(0, 0, 0, 0)).toISOString().split('T')[0] : '');
              }}
              error={errors.startDate?.message}
              placeholderText="Select start date"
              dateFormat="MMM d, yyyy"
              maxDate={endDate ? new Date(endDate) : undefined}
            />
          </div>
          <div className="space-y-1.5 pt-0.5">
            <DatePicker
              label="To *"
              value={endDate ? new Date(endDate) : null}
              onChange={(date) => {
                setValue('endDate', date ? new Date(date.setHours(23, 59, 59, 999)).toISOString().split('T')[0] : '');
              }}
              error={errors.endDate?.message}
              placeholderText="Select end date"
              dateFormat="MMM d, yyyy"
              minDate={startDate ? new Date(startDate) : undefined}
            />
          </div>
        </div>
        {selectedUid && (
          <button
            type="button"
            onClick={fetchEstimate}
            disabled={fetchingAmount}
            className="flex items-center gap-2 text-xs text-[#D4AF37] hover:text-[#B8960E] font-medium transition-colors disabled:opacity-60"
          >
            {fetchingAmount ? <Loader2 size={12} className="animate-spin" /> : null}
            Auto-calculate from attendance logs
          </button>
        )}
        {estimatedAmount !== null && (
          <p className="text-xs text-[#9A9A9A]">
            Estimated payout: <span className="font-semibold text-[#D4AF37]">${estimatedAmount.toFixed(2)}</span>
          </p>
        )}

        {/* Amounts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA]">
              Gross Amount <span className="text-[#C0392B] ml-0.5">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] text-sm">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('amount', { valueAsNumber: true })}
                className={`w-full h-9 pl-7 pr-3 rounded-md text-sm border bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] outline-none transition-all
                  ${errors.amount ? 'border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]' : 'border-[#E8E0B8] dark:border-[#2E2E2E] focus:ring-2 focus:ring-[#D4AF37]'}`}
              />
            </div>
            {errors.amount && <p className="text-xs text-[#C0392B]">{errors.amount.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA]">Loan Deduction</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] text-sm">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('loanAmount', { valueAsNumber: true })}
                className="w-full h-9 pl-7 pr-3 rounded-md text-sm border border-[#E8E0B8] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Signature upload */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA]">
            Employee Signature <span className="text-xs text-[#9A9A9A]">(optional)</span>
          </label>
          <label className="flex flex-col items-center justify-center gap-2 h-20 rounded-xl border-2 border-dashed border-[#E8E0B8] dark:border-[#2E2E2E] cursor-pointer hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all">
            <input
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={(e) => setSignatureFile(e.target.files?.[0] ?? null)}
            />
            {signatureFile ? (
              <p className="text-xs text-[#2A2A2A] dark:text-[#F5F5F5]">{signatureFile.name}</p>
            ) : (
              <>
                <Upload size={18} className="text-[#D4AF37]" />
                <p className="text-xs text-[#9A9A9A]">Click to upload signature image</p>
              </>
            )}
          </label>
        </div>

        {/* Net pay preview */}
        <div className="rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-[#5A5A5A] dark:text-[#AAAAAA]">Net Pay</span>
          <span className="text-lg font-bold text-[#D4AF37]">
            ${Math.max(0, (watch('amount') || 0) - (watch('loanAmount') || 0)).toFixed(2)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-[#E8E0B8] dark:border-[#2E2E2E]">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => navigate(APP_ROUTES.PAYOUTS.LIST)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" loading={submitting}>
            {submitting
              ? <><Loader2 size={14} className="animate-spin mr-1.5" />Creating…</>
              : 'Create Payout'
            }
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePayout;
