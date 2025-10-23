import apiClient from './client';
import { Comment } from '../types/models.types';
import { PaginatedResponse, CreateCommentPayload } from '../types/api.types';

/**
 * 💡 Comments API Module
 * Problem Solved: Centralized, type-safe data fetching/mutation for comments.
 */
export const commentsApi = {
  // GET /api/v1/posts/:postId/comments
  getPostComments: (postId: string, page: number, limit: number = 10) =>
    apiClient.get<PaginatedResponse<Comment>>(`/posts/${postId}/comments`, { 
      params: { page, limit } 
    }).then(res => res.data),

  // POST /api/v1/comments (assuming a flat route for creation)
  // The postId is included in the payload, but the backend may also infer it from a nested route. 
  // We'll use a flat route here for simplicity, matching the payload.
  create: (payload: CreateCommentPayload) => 
    apiClient.post<{ comment: Comment }>('/comments', payload)
      .then(res => res.data.comment),
};
