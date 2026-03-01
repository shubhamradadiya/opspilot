export enum UserRoles {
  SUPER_ADMIN = 'superAdmin',
  ADMIN = 'admin',
  USER = 'user',
  DEVELOPER = 'developer',
}

export enum PriceUnit {
  USD = '$',
}

export const DEFAULT_TIME_ZONE = 'Asia/Kolkata';

export enum AttendanceStatus {
  CLOCKED_IN = 'clockedIn',
  CLOCKED_OUT = 'clockedOut',
}

export enum ActivityLogType {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
}

export enum ContainerStatus {
  LOADING = 'loading',
  COMPLETED = 'completed',
  VGM = 'vgm',
  SHIPPED = 'shipped',
}

export enum RingCustomerStatus {
  PENDING = 'pending',
  PAID = 'paid',
}

export enum WalkInCustomerStatus {
  PENDING = 'pending',
  PAID = 'paid',
}
