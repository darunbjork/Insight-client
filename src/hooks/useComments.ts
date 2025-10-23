import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../api/comments.api';
import type { Comment } from '../types/models.types';
import type { CreateCommentPayload, PaginatedResponse } from '../types/api.types';
import toast from 'react-hot-toast';

// Custom function to create the query key array for comments on a specific post
const getCommentsQueryKey = (postId: string, page: number) => ['comments', postId, page];

/**
 * 💬 usePostComments: Handles fetching the paginated list of comments for a single post.
 */
export const usePostComments = (postId: string, page: number, limit: number = 10) => {
  return useQuery<PaginatedResponse<Comment>>({
    queryKey: getCommentsQueryKey(postId, page), 
    queryFn: () => commentsApi.getPostComments(postId, page, limit),
    enabled: !!postId, // Only fetch if postId is available
    staleTime: 1000 * 60 * 1, // Comments can change frequently, 1 minute stale time
  });
};

/**
 * 📝 useCreateComment: Handles the creation of a new comment.
 */
export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => commentsApi.create(payload),
    onSuccess: () => {
      toast.success('Comment posted!');
      
      // CRITICAL: Immediately invalidate the first page of comments to show the new one.
      // This forces a refetch for the list visible to the user.
      queryClient.invalidateQueries({ 
        queryKey: getCommentsQueryKey(postId, 1), 
        refetchType: 'active' // Only refetch if a component is actively using this key
      }); 
      
      // OPTIMIZATION: If we were using an infinite query, we would use setQueryData 
      // to optimistically add the comment, but invalidation is simpler for now.
    },
  });
};
