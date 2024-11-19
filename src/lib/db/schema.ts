// Collection schemas for TypeScript type safety

export interface CompanyDoc {
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

export interface UserDoc {
  email: string;
  name: string;
  role: 'ADMIN' | 'TECHNICIAN' | 'USER';
  companyId: string;
  active: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerDoc {
  companyId: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  preferredContact: 'PHONE' | 'EMAIL' | 'SMS';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MachineDoc {
  companyId: string;
  customerId: string;
  model: string;
  serialNumber: string;
  purchaseDate: Date;
  warrantyEnd?: Date;
  condition: 'GOOD' | 'FAIR' | 'POOR';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkOrderDoc {
  companyId: string;
  customerId: string;
  machineId: string;
  technicianId?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'AWAITING_PARTS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  serviceType: 'MAINTENANCE' | 'REPAIR' | 'WARRANTY';
  reportedIssue: string;
  resolution?: string;
  laborTime: number;
  laborRate: number;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartDoc {
  companyId: string;
  workOrderId: string;
  name: string;
  partNumber: string;
  description?: string;
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageDoc {
  companyId: string;
  workOrderId: string;
  senderId: string;
  text: string;
  createdAt: Date;
}