import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import './index.css';
import { parseApiError } from './utils/errorHandler.ts';
import axios from 'axios';

// 5-minute cache time for queries by default
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Do not retry on 401/403 (Authentication/Authorization errors)
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (status === 401 || status === 403) return false;
        }
        return failureCount < 3; // Retry other errors up to 3 times
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      onError: (error) => {
        // Centralized error handling for all mutations
        const message = parseApiError(error);
        console.error('Mutation Error:', error);
        // Using react-hot-toast for user-facing notifications
        // We configure this globally so components don't need to manually implement toast
        if (message) {
            toast.error(message);
        }
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        {/* Global Toast notifications container */}
        <Toaster position="top-right" />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);