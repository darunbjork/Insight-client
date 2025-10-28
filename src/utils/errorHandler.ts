import axios from 'axios';

/**
 * 🚨 parseApiError: Utility to safely extract a readable error message 
 * from various API error responses (Axios or others).
 */
export const parseApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // 1. Backend error (4xx, 5xx with response body)
    if (error.response) {
      const data = error.response.data;
      
      // Check for a common structure (e.g., { message: '...' } or { error: '...' })
      if (data && typeof data === 'object') {
        // Priority 1: Check for a specific 'message' or 'error' field
        if (data.message && typeof data.message === 'string') {
          return data.message;
        }
        if (data.error && typeof data.error === 'string') {
          return data.error;
        }
        
        // Priority 2: Check for a status-specific message
        if (error.response.status === 401 || error.response.status === 403) {
          return "Unauthorized. Please log in again.";
        }
        if (error.response.status === 404) {
          return "Resource not found.";
        }
      }
      
      // Fallback: Use HTTP status text if no body message is available
      return error.response.statusText || `An API error occurred (Status: ${error.response.status}).`;

    } 
    // 2. Network error (No response received)
    else if (error.request) {
      return "Network Error: Could not reach the server. Check your connection.";
    } 
    // 3. Request setup error
    else {
      return error.message;
    }
  } 
  // 4. General JavaScript error (not an Axios error)
  else if (error instanceof Error) {
    return error.message;
  }
  
  // 5. Unknown error type
  return "An unexpected error occurred.";
};
