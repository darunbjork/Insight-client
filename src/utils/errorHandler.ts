import axios from 'axios';
import type { ApiError } from '../types/api.types';

// A mapping of backend error codes to user-facing, friendly messages
const ERROR_MESSAGES: Record<string, string> = {
  'USER_EXISTS': 'This email is already registered. Try logging in.',
  'INVALID_CREDENTIALS': 'Invalid email or password. Please try again.',
  'UNAUTHORIZED': 'You must be logged in to perform this action.',
  'NOT_FOUND': 'The requested resource was not found.',
  'TOKEN_EXPIRED': 'Your session has expired. Please log in again.',
  'VALIDATION_ERROR': 'One or more fields are invalid. Please check your input.',
  // Use a catch-all for unexpected codes
  'SERVER_ERROR': 'An unexpected server error occurred. Please try again later.',
};

/**
 * Parses an unknown error object into a user-friendly string message.
 * This function centralizes all error display logic.
 */
export const parseApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Attempt to cast the response data to our standardized ApiError interface
    const responseData = error.response?.data as ApiError;
    const apiCode = responseData?.code;
    
    if (apiCode) {
        // Use our custom mapping for specific error codes
        return ERROR_MESSAGES[apiCode] || responseData.message || ERROR_MESSAGES['SERVER_ERROR'];
    }

    // Fallback for general HTTP errors (like 404, 500 without a body)
    if (error.response?.status) {
        return `Request failed with status ${error.response.status}.`;
    }
  }
  
  // Handle native JavaScript errors (e.g., network errors, code-level exceptions)
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'A mysterious network error occurred. Check your connection.';
};