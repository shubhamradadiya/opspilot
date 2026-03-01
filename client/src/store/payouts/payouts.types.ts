// ============================================================================
// PAYOUT TYPE DEFINITIONS
// OpsPilot · FE-06
// ============================================================================

// ============================================================================
// PAYOUT ENTITY
// ============================================================================
export interface IPayout {
  uid: string;
  amount: number;
  loanAmount: number;
  paidAmount: number;           // amount - loanAmount
  isPaid: boolean;
  employeeSignature?: string | null;
  createdAt: string;            // ISO string
  startTimestamp?: number;
  endTimestamp?: number;
  user?: {
    uid: string;
    fullName: string;
    perHourRate: number;
  };
}

// ============================================================================
// SELF PAYOUT (user's own record)
// ============================================================================
export interface ISelfPayout {
  perHourRate: number;
  loanAmount: number;
  totalAmount: number;
  durationInHours: number;
  durationInMinutes: number;
  durationInSeconds: number;
  weekStartDate: number;
  weekEndDate: number;
  weekRange: string;
}

// ============================================================================
// ADMIN ALL PAYOUTS — user-wise grouped
// ============================================================================
export interface IUserWisePayout {
  userId: string;
  fullName: string;
  totalAmount: number;
  totalPaid: number;
  loanAmount: number;
  payouts: IPayout[];
}

// ============================================================================
// PAYLOADS
// ============================================================================
export interface ICreatePayoutPayload {
  uid: string;
  amount: number;
  loanAmount: number;
  employeeSignature?: File | null;
}

export interface IAddLoanPayload {
  uid: string;
  loanAmount: number;
}

// ============================================================================
// FILTERS
// ============================================================================
export interface IPayoutFilters {
  search: string;
  startTimestamp: number | null;
  endTimestamp: number | null;
  calenderSlotType: 'DAY' | 'WEEK';
}

import type { IPaginationMeta } from '../employees/employees.types';

// ============================================================================
// REDUX STATE
// ============================================================================
export interface IPayoutsState {
  /** Admin: user-wise grouped payout list */
  allPayouts: IUserWisePayout[];
  /** User: self payout list */
  selfPayouts: ISelfPayout[];
  filters: IPayoutFilters;
  meta: IPaginationMeta | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}
