import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './utils';
import Inventory from '@/pages/Inventory';

describe('Inventory', () => {
  beforeEach(() => {
    localStorage.setItem('companyId', 'test-company-id');
  });

  it('should display inventory items', async () => {
    renderWithProviders(<Inventory />);

    await waitFor(() => {
      expect(screen.getByText('Power Nozzle')).toBeInTheDocument();
      expect(screen.getByText('Main Housing Assembly')).toBeInTheDocument();
    });
  });

  it('should show low stock alerts', async () => {
    renderWithProviders(<Inventory />);

    await waitFor(() => {
      const lowStockItems = screen.getAllByText(/low stock/i);
      expect(lowStockItems.length).toBeGreaterThan(0);
    });
  });

  it('should calculate total value correctly', async () => {
    renderWithProviders(<Inventory />);

    await waitFor(() => {
      const totalValue = screen.getByText(/total value/i).nextElementSibling;
      expect(totalValue).toHaveTextContent(/\$\d+\.\d{2}/);
    });
  });

  it('should filter items by search', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Inventory />);

    await user.type(screen.getByPlaceholderText(/search items/i), 'Power Nozzle');

    await waitFor(() => {
      expect(screen.getByText('Power Nozzle')).toBeInTheDocument();
      expect(screen.queryByText('Main Housing Assembly')).not.toBeInTheDocument();
    });
  });
});