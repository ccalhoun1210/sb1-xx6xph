import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Inventory from '@/pages/Inventory';
import { renderWithProviders } from './utils';

describe('Inventory', () => {
  it('displays inventory items', async () => {
    renderWithProviders(Inventory);
    
    await waitFor(() => {
      expect(screen.getByText(/inventory/i)).toBeInTheDocument();
    });
  });

  it('filters items by search', async () => {
    const user = userEvent.setup();
    renderWithProviders(Inventory);
    
    await user.type(screen.getByPlaceholderText(/search/i), 'test');
    
    await waitFor(() => {
      expect(screen.getByText(/no items found/i)).toBeInTheDocument();
    });
  });
});