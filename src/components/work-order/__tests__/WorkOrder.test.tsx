import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkOrder from '@/components/WorkOrder';
import { renderWithProviders } from '@/test/utils';

describe('WorkOrder', () => {
  it('renders work order form', async () => {
    renderWithProviders(<WorkOrder />);
    
    await waitFor(() => {
      expect(screen.getByText(/basic info/i)).toBeInTheDocument();
      expect(screen.getByText(/customer/i)).toBeInTheDocument();
      expect(screen.getByText(/rainbow/i)).toBeInTheDocument();
      expect(screen.getByText(/service/i)).toBeInTheDocument();
      expect(screen.getByText(/billing/i)).toBeInTheDocument();
    });
  });

  it('handles form submission', async () => {
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
    
    // Save work order
    await user.click(screen.getByRole('button', { name: /save work order/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/work order saved successfully/i)).toBeInTheDocument();
    });
  });
});