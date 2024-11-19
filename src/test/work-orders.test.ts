import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './utils';
import WorkOrders from '@/pages/WorkOrders';
import WorkOrder from '@/components/WorkOrder';
import { http, HttpResponse } from 'msw';
import { server } from './setup';

describe('Work Orders', () => {
  beforeEach(() => {
    localStorage.setItem('companyId', 'test-company-id');
  });

  describe('Work Orders List', () => {
    it('should display work orders', async () => {
      renderWithProviders(<WorkOrders />);

      await waitFor(() => {
        expect(screen.getByText('WO-2024-0001')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('should filter work orders by search', async () => {
      const user = userEvent.setup();
      renderWithProviders(<WorkOrders />);

      await user.type(screen.getByPlaceholderText(/search/i), 'John');

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      });
    });
  });

  describe('Work Order Creation', () => {
    it('should create a new work order', async () => {
      const user = userEvent.setup();
      renderWithProviders(<WorkOrder />);

      // Fill basic info
      await user.click(screen.getByRole('tab', { name: /basic info/i }));
      await user.selectOption(screen.getByLabelText(/service type/i), 'maintenance');
      await user.selectOption(screen.getByLabelText(/priority/i), 'medium');

      // Fill customer info
      await user.click(screen.getByRole('tab', { name: /customer/i }));
      await user.type(screen.getByLabelText(/customer name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '(555) 123-4567');

      // Fill machine info
      await user.click(screen.getByRole('tab', { name: /machine/i }));
      await user.type(screen.getByLabelText(/model/i), 'SRX');
      await user.type(screen.getByLabelText(/serial number/i), 'SRX123456');

      await user.click(screen.getByRole('button', { name: /save work order/i }));

      await waitFor(() => {
        expect(screen.getByText(/work order created successfully/i)).toBeInTheDocument();
      });
    });

    it('should validate required fields', async () => {
      const user = userEvent.setup();
      renderWithProviders(<WorkOrder />);

      await user.click(screen.getByRole('button', { name: /save work order/i }));

      await waitFor(() => {
        expect(screen.getByText(/customer name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/service type is required/i)).toBeInTheDocument();
      });
    });
  });
});