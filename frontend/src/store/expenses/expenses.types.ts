// ============================================================================
// IMPORTS
// ============================================================================
import { IUser } from '../auth/auth.types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export enum ExpenseType {
  MANUAL = 'manual',
  PAYOUT = 'payout',
}

export interface IExpense {
  id: number;
  eId: string;
  expenseDate: number;
  vendorName: string;
  description: string | null;
  totalExpense: number;
  expenseType: ExpenseType | string | null;
  user?: IUser;
  vendor?: IUser;
  createdAt: number;
}

// ============================================================================
// PAYLOAD TYPES
// ============================================================================

export interface CreateExpensePayload {
  expenseDate: number;
  vendorName: string;
  totalExpense: number;
  description?: string;
  expenseType?: ExpenseType | string;
  vendorId?: string;
}

export interface UpdateExpensePayload extends Partial<CreateExpensePayload> {
  eId: string;
}

// ============================================================================
// STATE TYPE
// ============================================================================

export interface ExpensesState {
  records: IExpense[];
  totalExpense: number;
  vendorNames: string[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
