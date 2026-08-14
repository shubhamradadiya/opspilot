// ============================================================================
// IMPORTS
// ============================================================================
import { IUser } from '../auth/auth.types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export enum WalkInCustomerStatus {
  PENDING = 'pending',
  PAID = 'paid',
}

export interface IWalkInCustomer {
  id: number;
  wcId: string;
  walkInCustomerDate: number;
  customerName: string;
  carTiresCount: number | null;
  carTiresPrice: number | null;
  truckTiresCount: number | null;
  truckTiresPrice: number | null;
  rimsCount: number | null;
  rimsPrice: number | null;
  totalAmount: number;
  status: WalkInCustomerStatus | string | null;
  user?: IUser;
  createdAt: number;
}

// ============================================================================
// PAYLOAD TYPES
// ============================================================================

export interface CreateWalkInCustomerPayload {
  walkInCustomerDate: number;
  customerName: string;
  carTiresCount?: number | null;
  carTiresPrice?: number | null;
  truckTiresCount?: number | null;
  truckTiresPrice?: number | null;
  rimsCount?: number | null;
  rimsPrice?: number | null;
  totalAmount: number;
  status?: WalkInCustomerStatus | string;
}

export interface UpdateWalkInCustomerPayload extends Partial<CreateWalkInCustomerPayload> {
  wcId: string;
}

// ============================================================================
// STATE TYPE
// ============================================================================

export interface WalkInCustomersState {
  records: IWalkInCustomer[];
  totalAmount: number;
  customerNames: string[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
