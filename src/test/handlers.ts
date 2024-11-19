import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth handlers
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'test-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'test-refresh-token',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User',
          role: 'ADMIN',
          company_id: 'test-company-id',
        },
      },
    });
  }),

  // Work Orders handlers
  http.get('*/rest/v1/work_orders*', () => {
    return HttpResponse.json([
      {
        id: 'WO-2024-0001',
        status: 'in_progress',
        priority: 'high',
        customer: {
          id: 'cust-1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '(555) 123-4567',
        },
        machine: {
          id: 'machine-1',
          model: 'SRX',
          serialNumber: 'SRX123456',
        },
        service: {
          reportedIssue: 'Not working',
          laborTime: 1,
          laborRate: 85,
        },
        createdAt: new Date().toISOString(),
      },
    ]);
  }),

  // Customers handlers
  http.get('*/rest/v1/customers*', () => {
    return HttpResponse.json([
      {
        id: 'cust-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
      },
      {
        id: 'cust-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '(555) 987-6543',
      },
    ]);
  }),

  // Machines handlers
  http.get('*/rest/v1/machines*', () => {
    return HttpResponse.json([
      {
        id: 'machine-1',
        model: 'SRX',
        serialNumber: 'SRX123456',
        purchaseDate: '2024-01-01',
        condition: 'good',
        customer: {
          id: 'cust-1',
          name: 'John Doe',
        },
      },
    ]);
  }),
];