import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { authApi } from './auth.api'; // Import a circular dependency - resolved at runtime

// We use an empty interface for our typed Axios instance to allow us to attach 
// custom properties if needed in the future, while keeping the standard Axios methods.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TypedAxiosInstance extends AxiosInstance {}

export const apiClient: TypedAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // CRITICAL for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// A flag to prevent multiple token refresh requests simultaneously (Race condition avoidance)
let isRefreshing = false;
// A queue to hold requests that failed with 401 until the token is refreshed
let failedQueue: Array<{
    resolve: (value: AxiosResponse) => void; 
    reject: (reason?: AxiosError) => void; 
    config: AxiosRequestConfig<unknown> 
}> = [];

/**
 * Helper function to process the queue after a successful refresh
 */
const processQueue = (error: AxiosError | null) => {
    failedQueue.forEach(async prom => {
        if (error) {
            prom.reject(error);
        } else {
            // Retry the original request
            prom.resolve(await apiClient(prom.config));
        }
    });
    failedQueue = [];
};


// Add a custom property to track if a request is the original failed one
declare module 'axios' {
    export interface AxiosRequestConfig {
        _retry?: boolean;
    }
}

/**
 * 🔑 Token Refresh Interceptor - Final Implementation
 * Problem Solved: Token expiry race condition.
 * Tradeoffs: Increased complexity with queue management.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // CRITICAL FAILURE POINT: If refresh fails, forcefully reset
    if (originalRequest.url?.includes('/auth/refresh') && error.response?.status === 401) {
          console.error("Session irrecoverably lost. Refresh token is expired or invalid.");
          window.location.href = '/login'; // <-- This is the final, aggressive reset
          return Promise.reject(error);
    }
    
    // 1. Standard 401 Check: Unauthorized and not already retried
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      
      // 2. Set the retry flag and queue the request
      originalRequest._retry = true;
      
      // 3. Handle Race Condition: Only one refresh call at a time
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          // Attempt to refresh token
          await authApi.refresh(); 
          isRefreshing = false;
          // Process all queued requests with the new token
          processQueue(null);
          
          // Retry the original request (which triggered the refresh)
          return apiClient(originalRequest); 
        } catch (refreshError) {
          isRefreshing = false;
          // Force logout for all pending requests in the queue
          processQueue(refreshError as AxiosError);
          // If refresh fails, force immediate redirect
          window.location.href = '/login'; 
          return Promise.reject(refreshError);
        }
      } 
      
      // 4. Queue other concurrent 401 requests
      return new Promise((resolve, reject) => {
          failedQueue.push({ config: originalRequest, resolve, reject });
      });
    }
    
    // For all other errors (400, 403, 500, etc.), or if 401 and already retried, reject
    return Promise.reject(error);
  }
);