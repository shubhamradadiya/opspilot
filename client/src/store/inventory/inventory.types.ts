import { IUser } from '../auth/auth.types';

export enum ActivityLogType {
  ADDED = 'ADDED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

export interface IInventory {
  id: number;
  iId: string;
  inventoryDate: string;
  carTiresCount: number | null;
  truckTiresCount: number | null;
  mixedTiresCount: number | null;
  bales: number | null;
  user?: IUser;
  createdAt: string;
  updatedAt?: string;
}

export interface IInventoryLog {
  id: number;
  ilId: string;
  user: IUser;
  text: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateInventoryPayload {
  inventoryDate: number;
  carTiresCount?: number | null;
  truckTiresCount?: number | null;
  mixedTiresCount?: number | null;
  bales?: number | null;
}

export interface UpdateInventoryPayload extends Partial<CreateInventoryPayload> {
  iId: string;
}

export interface InventoryState {
  records: IInventory[];
  logs: IInventoryLog[];
  unreadLogCount: number;
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  logsTotalItems: number;
  logsTotalPages: number;
  logsCurrentPage: number;
}
