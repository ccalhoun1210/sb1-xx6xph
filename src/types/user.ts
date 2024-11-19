export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'TECHNICIAN' | 'USER';
  companyId: string;
}

export interface Company {
  id: string;
  name: string;
  subdomain: string;
  plan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
  maxUsers: number;
  maxStorage: number;
  storageUsed: number;
  settings?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}