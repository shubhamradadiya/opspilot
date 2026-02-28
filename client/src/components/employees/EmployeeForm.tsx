// ============================================================================
// IMPORTS
// ============================================================================
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Lock, DollarSign, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import FeatureFlagsToggle from './FeatureFlagsToggle';
import { useCountries } from '@/hooks/useCountries';
import type {
  IEmployee,
  ICreateEmployeePayload,
  IUpdateEmployeePayload,
} from '@/store/employees/employees.types';

// ============================================================================
// ZOD VALIDATION SCHEMA — single unified schema, password optional
// Create makes it required; edit makes it absent from the submission
// ============================================================================
const employeeSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z
    .string()
    .min(6, 'Phone must be 6–15 digits')
    .max(15, 'Phone must be 6–15 digits')
    .regex(/^\d+$/, 'Digits only'),
  countryCode: z.string().min(1, 'Country code required'),
  isoCode: z.string().min(2, 'ISO code required'),
  password: z.string().optional(),
  perHourRate: z.preprocess(
    (v) => parseFloat(String(v)),
    z.number().min(1, 'Must be ≥ 1'),
  ),
  isClockInClockOutEnabled: z.boolean(),
  isInventoryEnabled: z.boolean(),
  isPayoutEnabled: z.boolean(),
  isContainerEnabled: z.boolean(),
  isExpenseEnabled: z.boolean(),
  isWalkInCustomerEnabled: z.boolean(),
  isRingCustomerEnabled: z.boolean(),
});

type FormValues = z.infer<typeof employeeSchema>;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface EmployeeFormProps {
  mode: 'create' | 'edit';
  initialValues?: IEmployee;
  submitting?: boolean;
  onSubmit: (data: ICreateEmployeePayload | IUpdateEmployeePayload) => void;
  onCancel: () => void;
}

// ============================================================================
// CONSTANTS — country codes
// ============================================================================
// (Country list loaded from API via useCountries hook)

// ============================================================================
// HELPER COMPONENTS
// ============================================================================
const FormField: React.FC<{
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ label, error, required, children }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA]">
      {label}
      {required && <span className="text-[#C0392B] ml-1">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs text-[#C0392B] dark:text-[#E05A4A]">{error}</p>
    )}
  </div>
);

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({
  icon,
  title,
}) => (
  <div className="flex items-center gap-2 pb-3 border-b border-[#2A2A2A] dark:border-[#2E2E2E]">
    <span className="text-[#D4AF37]">{icon}</span>
    <h3 className="text-sm font-semibold text-[#2A2A2A] dark:text-[#F5F5F5] uppercase tracking-wider">
      {title}
    </h3>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const EmployeeForm: React.FC<EmployeeFormProps> = ({
  mode,
  initialValues,
  submitting = false,
  onSubmit,
  onCancel,
}) => {
  const isEdit = mode === 'edit';

  // ── Load countries from API ──────────────────────────────────────────────
  const { countries, loading: countriesLoading } = useCountries();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(employeeSchema) as any,
    defaultValues: {
      fullName: initialValues?.fullName ?? '',
      email: initialValues?.email ?? '',
      phone: initialValues?.phone ?? '',
      countryCode: initialValues?.countryCode ?? '+91',
      isoCode: initialValues?.isoCode ?? 'IN',
      password: '',
      perHourRate: initialValues?.perHourRate ?? 0,
      isClockInClockOutEnabled: initialValues?.isClockInClockOutEnabled ?? false,
      isInventoryEnabled: initialValues?.isInventoryEnabled ?? false,
      isPayoutEnabled: initialValues?.isPayoutEnabled ?? false,
      isContainerEnabled: initialValues?.isContainerEnabled ?? false,
      isExpenseEnabled: initialValues?.isExpenseEnabled ?? false,
      isWalkInCustomerEnabled: initialValues?.isWalkInCustomerEnabled ?? false,
      isRingCustomerEnabled: initialValues?.isRingCustomerEnabled ?? false,
    },
  });

  // Sync countryCode ↔ isoCode automatically when user picks from dropdown
  const countryCode = watch('countryCode');
  useEffect(() => {
    const match = countries.find((c) => c.phoneCode === countryCode);
    if (match) setValue('isoCode', match.isoCode);
  }, [countryCode, countries, setValue]);

  // Form submit handler
  const handleFormSubmit = (data: FormValues) => {
    // Sanitize: remove empty email
    const payload: Record<string, unknown> = { ...data };
    if (!payload.email) delete payload.email;

    if (isEdit) {
      // Exclude password field from edit submissions
      delete payload.password;
      onSubmit(payload as IUpdateEmployeePayload);
    } else {
      onSubmit(payload as unknown as ICreateEmployeePayload);
    }
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-8">
      {/* ── Section 1: Basic Info ── */}
      <div className="space-y-4">
        <SectionHeader icon={<User size={16} />} title="Basic Information" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Full Name" required error={errors.fullName?.message}>
            <Input
              type="text"
              placeholder="John Doe"
              error={errors.fullName?.message}
              {...register('fullName')}
            />
          </FormField>
          <FormField label="Email" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="john@example.com"
              error={errors.email?.message}
              leftIcon={<Mail size={16} />}
              {...register('email')}
            />
          </FormField>
        </div>
      </div>

      {/* ── Section 2: Phone ── */}
      <div className="space-y-4">
        <SectionHeader icon={<Phone size={16} />} title="Contact" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Country Code" required error={errors.countryCode?.message}>
            <div className="relative">
              <select
                value={watch('countryCode')}
                onChange={(e) => setValue('countryCode', e.target.value)}
                disabled={countriesLoading}
                className={`w-full h-9 px-3 rounded-md text-sm border bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] transition-all duration-150 outline-none appearance-none
                  ${
                    errors.countryCode
                      ? 'border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]'
                      : 'border-[#E8E0B8] dark:border-[#2E2E2E] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent'
                  } ${countriesLoading ? 'opacity-50 cursor-wait' : ''}`}
              >
                <option value="" disabled>
                  {countriesLoading ? 'Loading…' : 'Select country'}
                </option>
                {countries.map((c) => (
                  <option key={c.id} value={c.phoneCode}>
                    {c.isoCode} ({c.phoneCode}) — {c.name}
                  </option>
                ))}
              </select>
              {countriesLoading && (
                <Loader2
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4AF37] animate-spin pointer-events-none"
                />
              )}
            </div>
          </FormField>
          <FormField label="ISO Code" required error={errors.isoCode?.message}>
            <Input
              type="text"
              placeholder="IN"
              maxLength={4}
              error={errors.isoCode?.message}
              {...register('isoCode')}
            />
          </FormField>
          <FormField label="Phone Number" required error={errors.phone?.message}>
            <Input
              type="tel"
              placeholder="9999999999"
              error={errors.phone?.message}
              leftIcon={<Phone size={16} />}
              {...register('phone')}
            />
          </FormField>
        </div>
      </div>

      {/* ── Section 3: Account & Pay ── */}
      <div className="space-y-4">
        <SectionHeader icon={<DollarSign size={16} />} title="Account & Pay" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!isEdit && (
            <FormField
              label="Password"
              required
              error={errors.password?.message}
            >
              <Input
                type="password"
                placeholder="Min. 6 characters"
                error={errors.password?.message}
                leftIcon={<Lock size={16} />}
                {...register('password')}
              />
            </FormField>
          )}
          <FormField label="Per Hour Rate ($)" required error={errors.perHourRate?.message}>
            <Input
              type="number"
              placeholder="25"
              min={1}
              step={0.01}
              error={errors.perHourRate?.message}
              leftIcon={<DollarSign size={16} />}
              {...register('perHourRate')}
            />
          </FormField>
        </div>
        {isEdit && (
          <p className="text-xs text-[#9A9A9A] dark:text-[#666666]">
            Password changes are handled separately from the employee's settings.
          </p>
        )}
      </div>

      {/* ── Section 4: Module Access ── */}
      <div className="space-y-4">
        <SectionHeader icon={<User size={16} />} title="Module Access" />
        <FeatureFlagsToggle control={control} errors={errors} />
      </div>

      {/* ── Form Actions ── */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E0B8] dark:border-[#2E2E2E]">
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={submitting}
        >
          {isEdit ? 'Save Changes' : 'Create Employee'}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
