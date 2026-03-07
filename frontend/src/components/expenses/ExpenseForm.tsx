// ============================================================================
// IMPORTS
// ============================================================================
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, ChevronDown } from 'lucide-react';
import { IExpense, ExpenseType } from '@/store/expenses/expenses.types';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchVendorNamesThunk } from '@/store/expenses/expenses.thunk';
import { RootState } from '@/store/store';
import { DatePicker } from '@/components/ui/DatePicker';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ExpenseFormData {
  expenseDate: string;
  vendorName: string;
  expenseType?: string;
  description?: string;
  totalExpense: number;
}

interface ExpenseFormProps {
  mode: 'create' | 'edit';
  initialData?: IExpense;
  submitting?: boolean;
  onSubmit: (data: ExpenseFormData) => void;
  onClose: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const EXPENSE_TYPE_OPTIONS = [
  { value: ExpenseType.MANUAL, label: 'Manual' },
  { value: ExpenseType.PAYOUT, label: 'Payout' },
];

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const expenseSchema = z.object({
  expenseDate: z.string().min(1, 'Date is required'),
  vendorName: z.string().min(1, 'Vendor name is required'),
  expenseType: z.string().optional(),
  description: z.string().optional(),
  totalExpense: z.number().min(0, 'Total must be ≥ 0'),
});

type ExpenseSchema = z.infer<typeof expenseSchema>;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const toDateInputValue = (timestamp?: number): string => {
  if (!timestamp) return '';
  return new Date(timestamp).toISOString().split('T')[0];
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  mode,
  initialData,
  submitting,
  onSubmit,
  onClose,
}) => {
  // ── HOOKS — Store ───────────────────────────────────────────────────────────
  const dispatch = useAppDispatch();
  const vendorNames = useAppSelector((s: RootState) => s.expenses.vendorNames);

  // ── STATE ────────────────────────────────────────────────────────────────────
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── FORM ─────────────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ExpenseSchema>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expenseDate: initialData ? toDateInputValue(initialData.expenseDate) : '',
      vendorName: initialData?.vendorName ?? '',
      expenseType: initialData?.expenseType ?? '',
      description: initialData?.description ?? '',
      totalExpense: initialData ? Number(initialData.totalExpense) : 0,
    },
  });

  const vendorNameValue = watch('vendorName');

  // ── EFFECTS — Load vendor suggestions ─────────────────────────────────────
  useEffect(() => {
    if (vendorNameValue) {
      dispatch(fetchVendorNamesThunk(vendorNameValue));
    }
  }, [vendorNameValue, dispatch]);

  // ── EFFECTS — Close dropdown on outside click ──────────────────────────────
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowVendorDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // ── FUNCTIONS — Handlers ─────────────────────────────────────────────────
  const handleVendorSelect = useCallback(
    (name: string) => {
      setValue('vendorName', name, { shouldValidate: true });
      setShowVendorDropdown(false);
    },
    [setValue]
  );

  const handleFormSubmit: SubmitHandler<ExpenseSchema> = useCallback(
    (data) => {
      onSubmit(data as ExpenseFormData);
    },
    [onSubmit]
  );

  const filteredVendors = vendorNames.filter(
    (n: string) =>
      n.toLowerCase().includes((vendorNameValue ?? '').toLowerCase()) && n !== vendorNameValue
  );

  // Get the vendorName register props (without ref so we can manage it separately)
  const vendorRegister = register('vendorName');

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl border border-[#2A2A2A] dark:border-[#2E2E2E]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A] dark:border-[#2E2E2E]">
          <h2 className="text-lg font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
            {mode === 'create' ? 'Add Expense' : 'Edit Expense'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[#9A9A9A] hover:text-[#2A2A2A] dark:hover:text-[#F5F5F5] hover:bg-[#F5F0D0] dark:hover:bg-[#252525] transition-colors duration-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-5 space-y-4">
          {/* Row: Date + Type */}
          <div className="grid grid-cols-2 gap-4">
            {/* Expense Date */}
            <div>
              <Controller
                control={control}
                name="expenseDate"
                render={({ field }) => (
                  <DatePicker
                    label={
                      <span>
                        Expense Date <span className="text-[#C0392B]">*</span>
                      </span> as any
                    }
                    value={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                    error={errors.expenseDate?.message}
                    dateFormat="dd/MM/yyyy"
                    fullWidth
                  />
                )}
              />
            </div>

            {/* Expense Type */}
            <div>
              <label className="block text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA] mb-1">
                Expense Type
              </label>
              <div className="relative">
                <select
                  {...register('expenseType')}
                  className="w-full h-9 px-3 py-2 pr-8 rounded-md border border-[#2A2A2A] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                >
                  <option value="">Select type</option>
                  {EXPENSE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-[#9A9A9A] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Vendor Name with Autocomplete */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA] mb-1">
              Vendor Name <span className="text-[#C0392B]">*</span>
            </label>
            <input
              type="text"
              name={vendorRegister.name}
              ref={vendorRegister.ref}
              onChange={vendorRegister.onChange}
              onBlur={vendorRegister.onBlur}
              onFocus={() => setShowVendorDropdown(true)}
              placeholder="Type vendor name..."
              autoComplete="off"
              className="w-full h-9 px-3 py-2 rounded-md border border-[#2A2A2A] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] text-sm placeholder:text-[#9A9A9A] dark:placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
            />
            {/* Dropdown */}
            {showVendorDropdown && filteredVendors.length > 0 && (
              <div className="absolute z-20 top-full mt-1 w-full bg-white dark:bg-[#2A2A2A] border border-[#2A2A2A] dark:border-[#3A3A3A] rounded-lg shadow-md overflow-hidden">
                {filteredVendors.slice(0, 8).map((name: string) => (
                  <button
                    key={name}
                    type="button"
                    onMouseDown={() => handleVendorSelect(name)}
                    className="w-full px-4 py-2 text-sm text-left text-[#2A2A2A] dark:text-[#F5F5F5] hover:bg-[#F5F0D0] dark:hover:bg-[#252525] transition-colors duration-100"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
            {errors.vendorName && (
              <p className="mt-1 text-xs text-[#C0392B] dark:text-[#E05A4A]">
                {errors.vendorName.message}
              </p>
            )}
          </div>

          {/* Total Expense */}
          <div>
            <label className="block text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA] mb-1">
              Total Expense ($) <span className="text-[#C0392B]">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('totalExpense', { valueAsNumber: true })}
              placeholder="0.00"
              className="w-full h-9 px-3 py-2 rounded-md border border-[#2A2A2A] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] text-sm placeholder:text-[#9A9A9A] dark:placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
            />
            {errors.totalExpense && (
              <p className="mt-1 text-xs text-[#C0392B] dark:text-[#E05A4A]">
                {errors.totalExpense.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA] mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Optional notes..."
              className="w-full px-3 py-2 rounded-md border border-[#2A2A2A] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] text-sm placeholder:text-[#9A9A9A] dark:placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#2A2A2A] dark:border-[#2E2E2E] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-lg border border-[#D4AF37] text-[#D4AF37] bg-white dark:bg-[#1E1E1E] text-sm font-medium hover:bg-[#FDFBD4] dark:hover:bg-[#2A2A2A] transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-9 px-6 rounded-lg bg-[#D4AF37] hover:bg-[#CE8946] active:bg-[#A8892B] text-[#2A2A2A] dark:text-[#121212] text-sm font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving…' : mode === 'create' ? 'Add Expense' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
