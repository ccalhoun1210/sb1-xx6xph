import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Customers from '@/pages/Customers';
import { renderWithProviders } from './utils';

describe('Customers', () => {
  it('displays customers list', async () => {
    renderWithProviders(Customers);
    
    await waitFor(() => {
      expect(screen.getByText(/customers/i)).toBeInTheDocument();
    });
  });

  it('filters customers by search', async () => {
    const user = userEvent.setup();
    renderWithProviders(Customers);
    
    await user.type(screen.getByPlaceholderText(/search/i), 'test');
    
    await waitFor(() => {
      expect(screen.getByText(/no customers found/i)).toBeInTheDocument();
    });
  });
});