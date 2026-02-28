// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
export interface IFeatureFlags {
  isClockInClockOutEnabled: boolean;
  isInventoryEnabled: boolean;
  isPayoutEnabled: boolean;
  isContainerEnabled: boolean;
  isExpenseEnabled: boolean;
  isWalkInCustomerEnabled: boolean;
  isRingCustomerEnabled: boolean;
}

interface FeatureFlagsToggleProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: FieldErrors<any>;
  disabled?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const FLAGS: { key: keyof IFeatureFlags; label: string; description: string }[] = [
  {
    key: 'isClockInClockOutEnabled',
    label: 'Clock In / Clock Out',
    description: 'Allow employee to log attendance',
  },
  {
    key: 'isInventoryEnabled',
    label: 'Inventory',
    description: 'Access to inventory management',
  },
  {
    key: 'isPayoutEnabled',
    label: 'Payouts',
    description: 'Access to payout records',
  },
  {
    key: 'isContainerEnabled',
    label: 'Containers',
    description: 'Access to container tracking',
  },
  {
    key: 'isExpenseEnabled',
    label: 'Expenses',
    description: 'Access to expense entries',
  },
  {
    key: 'isWalkInCustomerEnabled',
    label: 'Walk-In Customers',
    description: 'Access to walk-in customer records',
  },
  {
    key: 'isRingCustomerEnabled',
    label: 'Ring Customers',
    description: 'Access to ring customer records',
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Checkbox grid for all 7 employee feature flags.
 * Controlled via react-hook-form's Controller.
 */
const FeatureFlagsToggle: React.FC<FeatureFlagsToggleProps> = ({
  control,
  disabled = false,
}) => (
  <div className="space-y-3">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {FLAGS.map(({ key, label, description }) => (
        <Controller
          key={key}
          name={key}
          control={control}
          render={({ field }) => (
            <label
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors duration-150 ${
                field.value
                  ? 'border-[#D4AF37] bg-[#F0DFA0]/30 dark:bg-[rgba(212,175,55,0.08)]'
                  : 'border-[#E8E0B8] dark:border-[#2E2E2E] hover:border-[#D4C88A] dark:hover:border-[#3A3A3A]'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Gold checkbox */}
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={!!field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    field.value
                      ? 'bg-[#D4AF37] border-[#D4AF37]'
                      : 'bg-white dark:bg-[#1E1E1E] border-[#E8E0B8] dark:border-[#2E2E2E]'
                  }`}
                >
                  {field.value && (
                    <svg
                      className="w-2.5 h-2.5 text-[#2A2A2A]"
                      viewBox="0 0 10 8"
                      fill="none"
                    >
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Label */}
              <div>
                <p className="text-sm font-medium text-[#2A2A2A] dark:text-[#F5F5F5]">
                  {label}
                </p>
                <p className="text-xs text-[#9A9A9A] dark:text-[#666666] mt-0.5">
                  {description}
                </p>
              </div>
            </label>
          )}
        />
      ))}
    </div>
  </div>
);

export default FeatureFlagsToggle;
