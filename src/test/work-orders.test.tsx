import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkOrders from '@/pages/WorkOrders';
import WorkOrder from '@/components/WorkOrder';
import { renderWithProviders } from './utils';

describe('Work Orders', () => {
  describe('Work Orders List', () => {
    it('displays work orders', async () => {
      renderWithProviders(WorkOrders);
      
      await waitFor(() => {
        expect(screen.getByText(/work orders/i)).toBeInTheDocument();
      });
    });

    it('filters work orders by search', async () => {
      const user = userEvent.setup();
      renderWithProviders(WorkOrders);
      
      await user.type(screen.getByPlaceholderText(/search/i), 'test');
      
      await waitFor(() => {
        expect(screen.getByText(/no work orders found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Work Order Form', () => {
    it('creates new work order', async () => {
      const user = userEvent.setup();
      renderWithProviders(WorkOrder);
      
      await user.click(screen.getByRole('button', { name: /save/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/required fields/i)).toBeInTheDocument();
      });
    });
  });
});