import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePostComments } from '../../hooks/useComments';
import { CommentCard } from './CommentCard';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';

/**
 * 📜 CommentList: Fetches and renders the paginated list of comments.
 */
export const CommentList: React.FC = () => {
  const { id: postId } = useParams<{ id: string }>(); // Get post ID from URL
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Fetch comments for the current post ID and page
  const { 
    data, 
    isLoading, 
    isFetching, 
    isError, 
    error, 
    isPlaceholderData 
  } = usePostComments(postId!, page, limit); // `postId` is guaranteed by the router structure

  const comments = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalComments = data?.total || 0;

  if (isLoading && !isPlaceholderData) {
    return (
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-600">
        Error loading comments. ({error.message})
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">
        Comments ({totalComments})
      </h3>
      
      {comments.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No comments yet. Be the first!</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {comments.map(comment => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 mt-4 border-t">
          <Button 
            onClick={() => setPage(p => p - 1)} 
            disabled={page <= 1 || isFetching}
            variant="secondary"
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          
          <Button 
            onClick={() => setPage(p => p + 1)} 
            disabled={page >= totalPages || isFetching}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
