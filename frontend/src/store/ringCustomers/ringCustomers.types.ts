export enum RingCustomerStatus {
  PENDING = 'pending',
  PAID = 'paid',
}

export interface IRingCustomer {
  id: number;
  rcId: string;
  ringCustomerDate: number; // timestamp
  customerName: string;
  orderedRingCount: number;
  price: number;
  deliveryFee: number;
  totalAmount: number;
  status: RingCustomerStatus | string | null;
  createdAt: number;
  updatedAt: number;
}

export interface CreateRingCustomerPayload {
  ringCustomerDate: number;
  customerName: string;
  orderedRingCount: number;
  price: number;
  deliveryFee?: number;
  totalAmount: number;
  status: RingCustomerStatus | string;
}

export interface UpdateRingCustomerPayload extends Partial<Omit<CreateRingCustomerPayload, 'status'>> {
  rcId: string;
  status?: RingCustomerStatus | string;
}

export interface RingCustomersState {
  records: IRingCustomer[];
  totalAmount: number;
  customerNames: string[];
  
  // App state
  loading: boolean;
  submitting: boolean;
  error: string | null;
  
  // Pagination
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
