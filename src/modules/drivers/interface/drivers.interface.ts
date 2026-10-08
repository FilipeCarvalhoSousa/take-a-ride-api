export interface DriverInterface {
  id: string;
  userId: string;
  cnh: string;
  status?: 'PENDING_APPROVAL' | 'APPROVED' | 'SUSPENDED' | 'REJECTED';
}
