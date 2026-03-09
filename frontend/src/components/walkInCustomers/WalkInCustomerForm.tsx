// ============================================================================
// IMPORTS
// ============================================================================
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, ChevronDown } from 'lucide-react';
import { IWalkInCustomer, WalkInCustomerStatus } from '@/store/walkInCustomers/walkInCustomers.types';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchWalkInCustomerNamesThunk } from '@/store/walkInCustomers/walkInCustomers.thunk';
import { RootState } from '@/store/store';
import { DatePicker } from '@/components/ui/DatePicker';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface WalkInCustomerFormData {
  walkInCustomerDate: string;
  customerName: string;
  carTiresCount?: number | null;
  carTiresPrice?: number | null;
  truckTiresCount?: number | null;
  truckTiresPrice?: number | null;
  rimsCount?: number | null;
  rimsPrice?: number | null;
  totalAmount: number;
  status: WalkInCustomerStatus | string;
}

interface WalkInCustomerFormProps {
  mode: 'create' | 'edit';
  initialData?: IWalkInCustomer;
  submitting?: boolean;
  onSubmit: (data: WalkInCustomerFormData) => void;
  onClose: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STATUS_OPTIONS = [
  { value: WalkInCustomerStatus.PENDING, label: 'Pending' },
  { value: WalkInCustomerStatus.PAID, label: 'Paid' },
  { value: WalkInCustomerStatus.CANCELLED, label: 'Cancelled' },
];

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const nullableNumber = z.any().transform((val) => {
  if (val === '' || val === null || val === undefined) return null;
  return Number(val);
}).pipe(z.number().min(0, 'Must be ≥ 0').nullable());

const walkInCustomerSchema = z.object({
  walkInCustomerDate: z.string().min(1, 'Date is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  carTiresCount: nullableNumber,
  carTiresPrice: nullableNumber,
  truckTiresCount: nullableNumber,
  truckTiresPrice: nullableNumber,
  rimsCount: nullableNumber,
  rimsPrice: nullableNumber,
  totalAmount: z.number().min(0, 'Total must be ≥ 0'),
  status: z.string().min(1, 'Status is required'),
});

type WalkInCustomerSchema = z.infer<typeof walkInCustomerSchema>;

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

const WalkInCustomerForm: React.FC<WalkInCustomerFormProps> = ({
  mode,
  initialData,
  submitting,
  onSubmit,
  onClose,
}) => {
  // ── HOOKS — Store ───────────────────────────────────────────────────────────
  const dispatch = useAppDispatch();
  const customerNames = useAppSelector((s: RootState) => s.walkInCustomers.customerNames);

  // ── STATE ────────────────────────────────────────────────────────────────────
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── FORM ─────────────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<WalkInCustomerSchema>({
    resolver: zodResolver(walkInCustomerSchema),
    defaultValues: {
      walkInCustomerDate: initialData ? toDateInputValue(initialData.walkInCustomerDate) : '',
      customerName: initialData?.customerName ?? '',
      carTiresCount: initialData?.carTiresCount ?? null,
      carTiresPrice: initialData?.carTiresPrice ?? null,
      truckTiresCount: initialData?.truckTiresCount ?? null,
      truckTiresPrice: initialData?.truckTiresPrice ?? null,
      rimsCount: initialData?.rimsCount ?? null,
      rimsPrice: initialData?.rimsPrice ?? null,
      totalAmount: initialData ? Number(initialData.totalAmount) : 0,
      status: initialData?.status ?? WalkInCustomerStatus.PENDING,
    },
  });

  const customerNameValue = watch('customerName');
  const carCount = watch('carTiresCount') || 0;
  const carPrice = watch('carTiresPrice') || 0;
  const truckCount = watch('truckTiresCount') || 0;
  const truckPrice = watch('truckTiresPrice') || 0;
  const rimsCount = watch('rimsCount') || 0;
  const rimsPrice = watch('rimsPrice') || 0;

  // ── EFFECTS — Load customer suggestions ─────────────────────────────────────
  useEffect(() => {
    if (customerNameValue) {
      dispatch(fetchWalkInCustomerNamesThunk(customerNameValue));
    }
  }, [customerNameValue, dispatch]);

  // ── EFFECTS — Auto Calculate Total Amount ──────────────────────────────────
  useEffect(() => {
    const total = (carCount * carPrice) + (truckCount * truckPrice) + (rimsCount * rimsPrice);
    setValue('totalAmount', Number(total.toFixed(2)), { shouldValidate: true });
  }, [carCount, carPrice, truckCount, truckPrice, rimsCount, rimsPrice, setValue]);

  // ── EFFECTS — Close dropdown on outside click ──────────────────────────────
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCustomerDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // ── FUNCTIONS — Handlers ─────────────────────────────────────────────────
  const handleCustomerSelect = useCallback(
    (name: string) => {
      setValue('customerName', name, { shouldValidate: true });
      setShowCustomerDropdown(false);
    },
    [setValue]
  );

  const handleFormSubmit: SubmitHandler<WalkInCustomerSchema> = useCallback(
    (data) => {
      onSubmit(data as WalkInCustomerFormData);
    },
    [onSubmit]
  );

  const filteredCustomers = customerNames.filter(
    (n: string) =>
      n.toLowerCase().includes((customerNameValue ?? '').toLowerCase()) && n !== customerNameValue
  );

  // Get the customerName register props (without ref so we can manage it separately)
  const customerRegister = register('customerName');

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
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl border border-[#2A2A2A] dark:border-[#2E2E2E]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A] dark:border-[#2E2E2E]">
          <h2 className="text-lg font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
            {mode === 'create' ? 'Add Walk-In Customer' : 'Edit Walk-In Customer'}
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
        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Row: Date + Status */}
          <div className="grid grid-cols-2 gap-4">
            {/* Walk In Date */}
            <div>
              <Controller
                control={control}
                name="walkInCustomerDate"
                render={({ field }) => (
                  <DatePicker
                    label={
                      <span>
                        Date <span className="text-[#C0392B]">*</span>
                      </span> as any
                    }
                    value={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                    error={errors.walkInCustomerDate?.message}
                    dateFormat="dd/MM/yyyy"
                    fullWidth
                  />
                )}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA] mb-1">
                Status <span className="text-[#C0392B]">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('status')}
                  className="w-full h-9 px-3 py-2 pr-8 rounded-md border border-[#2A2A2A] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-[#9A9A9A] pointer-events-none" />
              </div>
              {errors.status && (
                <p className="mt-1 text-xs text-[#C0392B] dark:text-[#E05A4A]">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          {/* Customer Name with Autocomplete */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA] mb-1">
              Customer Name <span className="text-[#C0392B]">*</span>
            </label>
            <input
              type="text"
              name={customerRegister.name}
              ref={customerRegister.ref}
              onChange={customerRegister.onChange}
              onBlur={customerRegister.onBlur}
              onFocus={() => setShowCustomerDropdown(true)}
              placeholder="Type customer name..."
              autoComplete="off"
              className="w-full h-9 px-3 py-2 rounded-md border border-[#2A2A2A] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] text-sm placeholder:text-[#9A9A9A] dark:placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
            />
            {/* Dropdown */}
            {showCustomerDropdown && filteredCustomers.length > 0 && (
              <div className="absolute z-20 top-full mt-1 w-full bg-white dark:bg-[#2A2A2A] border border-[#2A2A2A] dark:border-[#3A3A3A] rounded-lg shadow-md overflow-hidden">
                {filteredCustomers.slice(0, 8).map((name: string) => (
                  <button
                    key={name}
                    type="button"
                    onMouseDown={() => handleCustomerSelect(name)}
                    className="w-full px-4 py-2 text-sm text-left text-[#2A2A2A] dark:text-[#F5F5F5] hover:bg-[#F5F0D0] dark:hover:bg-[#252525] transition-colors duration-100"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
            {errors.customerName && (
              <p className="mt-1 text-xs text-[#C0392B] dark:text-[#E05A4A]">
                {errors.customerName.message}
              </p>
            )}
          </div>

          {/* Tires & Rims Fields */}
          <div className="pt-2 border-t border-[#2A2A2A] dark:border-[#2E2E2E]">
            <h3 className="text-sm font-medium text-[#2A2A2A] dark:text-[#F5F5F5] mb-4">
              Items
            </h3>

            {/* Car Tires */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-[#9A9A9A] dark:text-[#666666] text-xs uppercase tracking-wider mb-1">
                  Car Tires Count
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('carTiresCount')}
                  placeholder="0"
                  className="w-full h-9 px-3 py-2 rounded-md border border-[#2A2A2A] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] text-sm placeholder:text-[#9A9A9A] dark:placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-[#9A9A9A] dark:text-[#666666] text-xs uppercase tracking-wider mb-1">
                  Car Tires Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('carTiresPrice')}
                  placeholder="0.00"
                  className="w-full h-9 px-3 py-2 rounded-md border border-[#2A2A2A] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] text-sm placeholder:text-[#9A9A9A] dark:placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Truck Tires */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-[#9A9A9A] dark:text-[#666666] text-xs uppercase tracking-wider mb-1">
                  Truck Tires Count
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('truckTiresCount')}
                  placeholder="0"
                  className="w-full h-9 px-3 py-2 rounded-md border border-[#2A2A2A] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] text-sm placeholder:text-[#9A9A9A] dark:placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-[#9A9A9A] dark:text-[#666666] text-xs uppercase tracking-wider mb-1">
                  Truck Tires Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('truckTiresPrice')}
                  placeholder="0.00"
                  className="w-full h-9 px-3 py-2 rounded-md border border-[#2A2A2A] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] text-sm placeholder:text-[#9A9A9A] dark:placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Rims */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#9A9A9A] dark:text-[#666666] text-xs uppercase tracking-wider mb-1">
                  Rims Count
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('rimsCount')}
                  placeholder="0"
                  className="w-full h-9 px-3 py-2 rounded-md border border-[#2A2A2A] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] text-sm placeholder:text-[#9A9A9A] dark:placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-[#9A9A9A] dark:text-[#666666] text-xs uppercase tracking-wider mb-1">
                  Rims Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('rimsPrice')}
                  placeholder="0.00"
                  className="w-full h-9 px-3 py-2 rounded-md border border-[#2A2A2A] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] text-sm placeholder:text-[#9A9A9A] dark:placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Total Amount (Auto Formatted) */}
          <div className="pt-2 border-t border-[#2A2A2A] dark:border-[#2E2E2E]">
            <label className="block text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA] mb-1">
              Total Amount ($)
            </label>
            <input
              type="text"
              readOnly
              value={watch('totalAmount').toFixed(2)}
              className="w-full h-9 px-3 py-2 rounded-md border border-[#2A2A2A] dark:border-[#2E2E2E] bg-[#F5F5F5] dark:bg-[#252525] text-[#2A2A2A] dark:text-[#F5F5F5] font-semibold text-sm focus:outline-none transition-colors"
            />
            {errors.totalAmount && (
              <p className="mt-1 text-xs text-[#C0392B] dark:text-[#E05A4A]">
                {errors.totalAmount.message}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#2A2A2A] dark:border-[#2E2E2E] mt-4">
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
              {submitting ? 'Saving…' : mode === 'create' ? 'Add Record' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WalkInCustomerForm;
