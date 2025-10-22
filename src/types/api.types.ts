// types/api.types.ts

import type { User } from "./models.types";

// Standardized structure for all non-2xx responses from the backend
export interface ApiError {
  status: 'fail';
  code: string; // e.g., 'USER_EXISTS', 'INVALID_CREDENTIALS'
  message: string;
}

// Generic interface for all paginated list responses
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  total: number;
}

// --- Payloads ---
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  image?: File; // For file uploads via FormData
}

export interface LikePayload {
  onModel: 'Post' | 'Comment';
  resourceId: string;
}

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
}

// --- Responses ---
// A typical successful response from an auth endpoint after login or refresh
export interface AuthSuccessResponse {
  status: 'success';
  user: User;
}