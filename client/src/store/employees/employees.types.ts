// ============================================================================
// EMPLOYEE TYPE DEFINITIONS
// OpsPilot · FE-04
// ============================================================================

// ============================================================================
// EMPLOYEE ENTITY — matches backend User entity (Expose fields)
// ============================================================================
export interface IEmployee {
  uid: string;
  fullName: string;
  email: string | null;
  phone: string;
  countryCode: string;
  isoCode: string;
  role: 'admin' | 'user';
  isActive: boolean;
  perHourRate: number;
  loanAmount: number;
  // ── Feature flags ──────────────────────────────────────────────────────────
  isClockInClockOutEnabled: boolean;
  isInventoryEnabled: boolean;
  isPayoutEnabled: boolean;
  isContainerEnabled: boolean;
  isExpenseEnabled: boolean;
  isWalkInCustomerEnabled: boolean;
  isRingCustomerEnabled: boolean;
  // ── Timestamps ─────────────────────────────────────────────────────────────
  createdAt: string;
  updatedAt?: string;
}

// ============================================================================
// CREATE PAYLOAD — matches backend CreateEmployeeDto exactly
// ============================================================================
export interface ICreateEmployeePayload {
  fullName: string;
  phone: string;
  countryCode: string;
  isoCode: string;
  email?: string;
  password: string;
  perHourRate: number;
  isClockInClockOutEnabled: boolean;
  isInventoryEnabled: boolean;
  isPayoutEnabled: boolean;
  isContainerEnabled: boolean;
  isExpenseEnabled: boolean;
  isWalkInCustomerEnabled: boolean;
  isRingCustomerEnabled: boolean;
}

// ============================================================================
// UPDATE PAYLOAD — matches backend UpdateEmployeeDto (all optional, no password)
// ============================================================================
export type IUpdateEmployeePayload = Omit<Partial<ICreateEmployeePayload>, 'password'>;

// ============================================================================
// FILTERS
// ============================================================================
export interface IEmployeeFilters {
  search: string;
  isActive: 'all' | 'active' | 'inactive';
  role: 'all' | 'admin' | 'user';
}

// ============================================================================
// PAGINATION META
// ============================================================================
export interface IPaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentCount: number;
}

// ============================================================================
// REDUX STATE
// ============================================================================
export interface IEmployeesState {
  /** Full list from server */
  list: IEmployee[];
  /** Employee being viewed/edited */
  selected: IEmployee | null;
  /** List fetch in progress */
  loading: boolean;
  /** Create / Update / Delete in progress */
  submitting: boolean;
  error: string | null;
  filters: IEmployeeFilters;
  meta: IPaginationMeta | null;
}
