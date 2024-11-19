import { WorkOrder } from '@/types/workOrder';

// Mock data store
const mockWorkOrders: WorkOrder[] = [
  {
    id: "WO-2024-0001",
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "inProgress",
    priority: "high",
    serviceType: "repair",
    customer: {
      id: "CUST-001",
      name: "John Smith",
      email: "john@example.com",
      phone: "(555) 123-4567",
      preferredContact: "phone"
    },
    machine: {
      model: "SRX",
      serialNumber: "SRX123456",
      purchaseDate: "2023-12-01",
      condition: "fair",
      attachments: {
        powerNozzle: { attached: true, serialNumber: "PN789" },
        aquaMate: { attached: false },
        miniJet: { attached: false }
      }
    },
    service: {
      reportedIssue: "Unit not powering on",
      symptomsObserved: "No response when plugged in",
      severityLevel: "high",
      assignedTechnician: "TECH-001",
      selectedParts: [],
      laborTime: 1.5,
      laborRate: 85,
      technicianNotes: "Investigating power supply",
      photos: []
    },
    billing: {
      invoiceId: "INV-001",
      paymentStatus: "unpaid",
      customerRating: 0
    }
  },
  {
    id: "WO-2024-0002",
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "scheduled",
    priority: "medium",
    serviceType: "maintenance",
    customer: {
      id: "CUST-002",
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "(555) 987-6543",
      preferredContact: "email"
    },
    machine: {
      model: "E2 Black",
      serialNumber: "E2B789012",
      purchaseDate: "2024-01-15",
      condition: "good",
      attachments: {
        powerNozzle: { attached: true, serialNumber: "PN456" },
        aquaMate: { attached: true, serialNumber: "AM123" },
        miniJet: { attached: false }
      }
    },
    service: {
      reportedIssue: "Annual maintenance",
      symptomsObserved: "Regular checkup",
      severityLevel: "low",
      assignedTechnician: "TECH-002",
      selectedParts: [],
      laborTime: 1,
      laborRate: 85,
      technicianNotes: "",
      photos: []
    },
    billing: {
      invoiceId: "INV-002",
      paymentStatus: "unpaid",
      customerRating: 0
    }
  }
];

export const mockApi = {
  getWorkOrders: async (): Promise<WorkOrder[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [...mockWorkOrders];
  },

  getWorkOrder: async (id: string): Promise<WorkOrder | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const workOrder = mockWorkOrders.find(wo => wo.id === id);
    return workOrder ? { ...workOrder } : null;
  },

  createWorkOrder: async (data: WorkOrder): Promise<WorkOrder> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newWorkOrder = { ...data };
    mockWorkOrders.push(newWorkOrder);
    return newWorkOrder;
  },

  updateWorkOrder: async (id: string, data: Partial<WorkOrder>): Promise<WorkOrder> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockWorkOrders.findIndex(wo => wo.id === id);
    if (index === -1) throw new Error('Work order not found');
    
    mockWorkOrders[index] = { ...mockWorkOrders[index], ...data };
    return { ...mockWorkOrders[index] };
  },

  deleteWorkOrder: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockWorkOrders.findIndex(wo => wo.id === id);
    if (index !== -1) {
      mockWorkOrders.splice(index, 1);
    }
  }
};