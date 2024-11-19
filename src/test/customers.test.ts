import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './utils';
import Customers from '@/pages/Customers';
import { http, HttpResponse } from 'msw';
import { server } from './setup';

describe('Customers', () => {
  beforeEach(() => {
    localStorage.setItem('companyId', 'test-company-id');
  });

  it('should display customers list', async () => {
    renderWithProviders(<Customers />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  it('should filter customers by search', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Customers />);

    await user.type(screen.getByPlaceholderText(/search customers/i), 'John');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    server.use(
      http.get('*/rest/v1/customers*', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderWithProviders(<Customers />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch customers/i)).toBeInTheDocument();
    });
  });
});