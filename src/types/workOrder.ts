export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredContact: 'phone' | 'email' | 'sms';
}

export interface Machine {
  model: string;
  serialNumber: string;
  purchaseDate: string;
  condition: 'good' | 'fair' | 'poor';
  attachments: {
    powerNozzle?: { attached: boolean; serialNumber?: string };
    aquaMate?: { attached: boolean; serialNumber?: string };
    miniJet?: { attached: boolean; serialNumber?: string };
  };
}

export interface Part {
  id: string;
  group: string;
  name: string;
  partNumber: string;
  description: string;
  price: number;
  quantity: number;
}

export interface ServicePhoto {
  name: string;
  url: string;
}

export interface ServiceDetails {
  reportedIssue: string;
  symptomsObserved: string;
  severityLevel: 'low' | 'medium' | 'high' | 'critical';
  assignedTechnician: string;
  selectedParts: Part[];
  laborTime: number;
  laborRate: number;
  technicianNotes: string;
  photos?: ServicePhoto[];
}

export interface BillingDetails {
  invoiceId: string;
  paymentStatus: 'unpaid' | 'paid' | 'partiallyPaid';
  customerSignature?: string;
  customerFeedback?: string;
  customerRating: number;
}

export interface WorkOrder {
  id: string;
  createdAt: string;
  dueDate: string;
  status: 'scheduled' | 'inProgress' | 'awaitingParts' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  serviceType: 'maintenance' | 'repair' | 'warranty';
  customer: Customer;
  machine: Machine;
  service: ServiceDetails;
  billing: BillingDetails;
}