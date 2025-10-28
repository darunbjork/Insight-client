import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import toast, { Toaster } from 'react-hot-toast';
import { AuthProviderWithRouter } from './contexts/AuthProviderWithRouter';
import Router from './router';
import './index.css';
import { parseApiError } from './utils/errorHandler';

// 1. Global React Query Configuration
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      const message = parseApiError(error);
      toast.error(message, {
        id: 'query-error', // Prevent multiple identical toasts
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      const message = parseApiError(error);
      toast.error(message, {
        id: 'mutation-error',
      });
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed queries once
      staleTime: 1000 * 10, // Default 10 seconds stale time
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProviderWithRouter>
          <Router />
        </AuthProviderWithRouter>
      </BrowserRouter>
      {/* Toaster for all toast messages */}
      <Toaster position="top-right" reverseOrder={false} />
      {/* Devtools (Production check recommended) */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </React.StrictMode>,
);
