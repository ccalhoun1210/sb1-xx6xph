import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Toaster } from '@/components/ui/toaster';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
      staleTime: 0,
    },
  },
});

export function renderWithProviders(Component: React.ComponentType) {
  const testQueryClient = createTestQueryClient();
  
  return {
    ...render(
      <BrowserRouter>
        <QueryClientProvider client={testQueryClient}>
          <AuthProvider>
            <Component />
            <Toaster />
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    ),
    testQueryClient,
  };
}