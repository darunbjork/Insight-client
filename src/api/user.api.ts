import { apiClient } from './client';
import { User } from '../types/models.types';

// We define a PublicUser type that is typically a subset of User,
// but for simplicity, we use the full User type here, assuming the backend
// filters out sensitive fields (like private email).

/**
 * 💡 User API Module (Public Data)
 * Problem Solved: Centralized, type-safe fetching for non-authenticated user data.
 */
export const userApi = {
  // GET /api/v1/users/:userId
  getPublicProfile: (userId: string) => 
    apiClient.get<{ user: User }>(`/users/${userId}`)
      .then(res => res.data.user),
};