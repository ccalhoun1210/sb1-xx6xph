import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import { renderWithProviders } from './utils';

describe('Authentication Flow', () => {
  describe('Login', () => {
    it('renders login form', () => {
      renderWithProviders(Login);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('handles successful login', async () => {
      const user = userEvent.setup();
      renderWithProviders(Login);
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(window.location.pathname).toBe('/');
      });
    });
  });

  describe('Registration', () => {
    it('renders registration form', () => {
      renderWithProviders(Register);
      expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('validates form fields', async () => {
      const user = userEvent.setup();
      renderWithProviders(Register);
      
      await user.click(screen.getByRole('button', { name: /create account/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/required/i)).toBeInTheDocument();
      });
    });
  });
});