export interface DriverInterface {
  id: string;
  userId: string;
  cnh: string;
  role?: 'DRIVER';
  status?: 'PENDING_APPROVAL' | 'APPROVED' | 'SUSPENDED' | 'REJECTED';
}
