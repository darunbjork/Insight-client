import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { postsApi } from '../api/posts.api';
import type { Post } from '../types/models.types';
import type { CreatePostPayload, PaginatedResponse } from '../types/api.types';
import toast from 'react-hot-toast';

// The key for our posts list query
const POSTS_QUERY_KEY = 'posts';
const POST_DETAIL_QUERY_KEY = 'post';

/**
 * 🚀 usePosts: Handles fetching the paginated post feed for all users or a specific user.
 * Solves: Caching, loading/error states, and pagination state complexity.
 */
export const usePosts = (page: number, limit: number = 10, userId?: string) => {
  const queryKey = userId ? [POSTS_QUERY_KEY, 'user', userId, page] : [POSTS_QUERY_KEY, page];
  const queryFn = userId
    ? () => postsApi.getByUserId(userId, page, limit)
    : () => postsApi.getAll(page, limit);

  return useQuery<PaginatedResponse<Post>>({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    placeholderData: keepPreviousData,
    enabled: !userId || !!userId,
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
 * 💖 useLikePost: Handles the like/unlike toggle and UI refresh.
 */
export const useLikePost = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    // We assume the API endpoint handles the toggle logic
    mutationFn: () => postsApi.toggleLike(postId),
    
    // Optimistic Update: Assume success and update UI instantly
    onMutate: async () => {
      // 1. Cancel any outgoing refetches for the relevant queries
      await queryClient.cancelQueries({ queryKey: [POSTS_QUERY_KEY] });
      await queryClient.cancelQueries({ queryKey: [POST_DETAIL_QUERY_KEY, postId] });
      
      // 2. Snapshot the previous data for rollback
      const previousPosts = queryClient.getQueryData<PaginatedResponse<Post>>([POSTS_QUERY_KEY]);
      const previousDetail = queryClient.getQueryData<Post>([POST_DETAIL_QUERY_KEY, postId]);

      // 3. Optimistically update the feed list (find and toggle liked status)
      queryClient.setQueryData<PaginatedResponse<Post>>([POSTS_QUERY_KEY], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map(p => 
            p._id === postId ? { 
                ...p, 
                isLiked: !p.isLiked, // Toggle liked state
                likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1 
            } : p
          ),
        };
      });

      // 4. Optimistically update the detail view
      queryClient.setQueryData<Post>([POST_DETAIL_QUERY_KEY, postId], (old) => {
        if (!old) return old;
        return { 
          ...old, 
          isLiked: !old.isLiked,
          likeCount: old.isLiked ? old.likeCount - 1 : old.likeCount + 1
        };
      });
      
      // Return the rollback function (context)
      return { previousPosts, previousDetail };
    },
    
    // If the mutation fails, roll back the cache
    onError: (err, variables, context) => {
      toast.error("Failed to update like status.");
      if (context?.previousPosts) {
        queryClient.setQueryData([POSTS_QUERY_KEY], context.previousPosts);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData([POST_DETAIL_QUERY_KEY, postId], context.previousDetail);
      }
    },
    
    // Always revalidate to ensure the server state matches the client
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [POST_DETAIL_QUERY_KEY, postId] });
    },
  });
};


/**
 * 🗑️ useDeletePost: Handles deletion of a post.
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => postsApi.delete(id),
    onSuccess: () => {
      // Invalidate both the feed and the detail view
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] });
      // Note: Detail view of a deleted post will naturally lead to a 404/redirect
      toast.success('Post deleted successfully!');
    },
  });
};
