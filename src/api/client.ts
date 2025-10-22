import axios, { AxiosInstance } from 'axios';
import { AuthSuccessResponse, ApiError } from '../types/api.types';
import { authApi } from './auth.api'; // Import a circular dependency - resolved at runtime

// We use an empty interface for our typed Axios instance to allow us to attach 
// custom properties if needed in the future, while keeping the standard Axios methods.
export interface TypedAxiosInstance extends AxiosInstance {}

// ⚠️ CRITICAL: Must be set globally in Axios for HttpOnly cookies to be sent
const apiClient: TypedAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // This tells the browser to include cookies in cross-origin requests
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 🔑 Token Refresh Interceptor
 * Problem Solved: Prevents unexpected user logouts when the access token expires.
 * Tradeoffs: Adds complexity (state management for retries, error handling).
 * Breaks at Scale: If not carefully implemented, can lead to race conditions 
 * (multiple simultaneous 401s triggering multiple refresh requests). 
 * For this initial version, we handle single 401s.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if it's a 401 Unauthorized error and hasn't been retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true; // Mark request as retried
      
      try {
        // Attempt to refresh the token. The backend sends new HttpOnly cookies.
        // We use the authApi module here for the refresh call.
        await authApi.refresh(); 
        
        // Retry the original failed request with the new (implicitly set) cookie
        return apiClient(originalRequest); 
      } catch (refreshError) {
        console.error("Token Refresh Failed:", refreshError);
        // If refresh fails (e.g., refresh token expired), redirect to login
        // Use a direct window location change to force a full app reload and cleanup
        // We must ensure this doesn't happen during a refresh call itself, which is handled
        // by the fact that the refresh call is not called via apiClient here.
        window.location.href = '/login'; 
        
        // Reject the promise to stop propagation of the original request failure
        return Promise.reject(refreshError);
      }
    }
    
    // For all other errors (400, 403, 500, etc.), reject the promise
    return Promise.reject(error);
  }
);

export default apiClient;