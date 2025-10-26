import { apiClient } from './client';
import type { Post } from '../types/models.types';
import type { PaginatedResponse, CreatePostPayload } from '../types/api.types';

// Concrete type for the paginated post feed response
export interface PostsFeedResponse extends PaginatedResponse<Post> {
  data: Post[];
  // Backend returns the array directly on the root, let's assume it's in a posts key
  // We'll define the Axios generic based on the actual JSON structure (which we define as a single array for simplicity)
}

/**
 * 💡 Posts API Module
 * Problem Solved: Centralized, type-safe data fetching for posts.
 */
export const postsApi = {
  // GET /api/v1/posts
  getAll: (page: number, limit: number = 10) => 
    apiClient.get<PaginatedResponse<Post>>('/posts', { 
      params: { page, limit } 
    }).then(res => res.data), // Return the PaginatedResponse object
  
  // POST /api/v1/posts (Handles both JSON and optional File upload)
  create: async (data: CreatePostPayload) => {
    // ⚠️ File Upload Pattern: Must use FormData for multipart/form-data
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    
    if (data.image) {
      formData.append('image', data.image); // Field name 'image' must match backend contract
    }
    
    // We explicitly set the content-type here, though Axios often handles it for FormData
    const response = await apiClient.post<{ post: Post }>('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    // Assuming backend returns { post: Post } on creation
    return response.data.post; 
  },
  
  // GET /api/v1/posts/:id
  getById: (id: string) => 
    apiClient.get<{ post: Post }>(`/posts/${id}`).then(res => res.data.post),
  
  // PUT /api/v1/posts/:id
  update: (id: string, payload: { title: string; content: string }) =>
    apiClient.put<{ post: Post }>(`/posts/${id}`, payload).then(res => res.data.post),
  
  // DELETE /api/v1/posts/:id
  delete: (id: string) =>
    apiClient.delete<void>(`/posts/${id}`).then(res => res.data),
};