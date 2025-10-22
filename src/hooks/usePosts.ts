import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/posts.api';
import { Post } from '../types/models.types';
import { CreatePostPayload, PaginatedResponse } from '../types/api.types';
import toast from 'react-hot-toast';

// The key for our posts list query
const POSTS_QUERY_KEY = 'posts';

/**
 * 🚀 usePosts: Handles fetching the paginated post feed.
 * Solves: Caching, loading/error states, and pagination state complexity.
 */
export const usePosts = (page: number, limit: number = 10) => {
  return useQuery<PaginatedResponse<Post>>({
    // QueryKey must be an array, and the page number must be included for independent caching
    queryKey: [POSTS_QUERY_KEY, page], 
    queryFn: () => postsApi.getAll(page, limit),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    keepPreviousData: true,   // Keeps old page visible while new page loads (better UX)
  });
};

/**
 * ✍️ useCreatePost: Handles creation of a new post.
 * Solves: State mutation, automatic cache invalidation.
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postsApi.create(payload),
    onSuccess: () => {
      // Invalidate the 'posts' key to force refetch of the feed (usually just the first page)
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] }); 
      toast.success('Post created successfully!');
    },
    // onError is handled globally in main.tsx QueryClient configuration
  });
};

/**
 * 🗑️ useDeletePost: Handles deleting a post.
 * Solves: State mutation, automatic cache invalidation.
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => postsApi.delete(id),
    onSuccess: () => {
      // Invalidate the posts feed to remove the deleted post and refetch list
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] });
      toast.success('Post deleted successfully!');
    },
  });
};