import React, { useState } from 'react';
import { PostCard } from './PostCard';
import { usePosts } from '../../hooks/usePosts';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';


interface PostFeedProps {
  userId?: string; // Optional prop to filter by user
}

/**
 * 🧱 PostFeed: Manages pagination state and renders the list of posts.
 * Now reusable for both global feed and user-specific feeds.
 */
export const PostFeed: React.FC<PostFeedProps> = ({ userId }) => {
  const [page, setPage] = useState(1);
  const limit = 10;

  // usePosts hook is now called unconditionally
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    isPlaceholderData,
  } = usePosts(page, limit, userId);

  const posts = data?.data || [];
  const totalPages = data?.totalPages || 1;

  if (isError) {
    return (
      <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">
        <h2 className="font-bold text-xl">Error Loading Feed</h2>
        <p>There was an issue fetching posts. ({error?.message})</p>
      </div>
    );
  }

  // Show a full spinner only on the initial load (isLoading is true)
  if (isLoading && !isPlaceholderData) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spinner />
      </div>
    );
  }
  // Show message if no posts are available (context-aware message)
  if (posts.length === 0) {
    return (
      <div className="text-center p-10 text-gray-600 bg-gray-50 rounded-lg">
        <h2 className="font-bold text-xl">
          {userId ? "This user hasn't shared any thoughts yet." : "No Posts Found"}
        </h2>
        <p>Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ... rendering posts and pagination controls remains identical ... */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center border-t pt-4">
        {/* ... (buttons remain the same) ... */}
        <Button
          onClick={() => setPage(p => p - 1)}
          disabled={page <= 1 || isFetching}
          variant="secondary"
        >
          Previous Page
        </Button>

        <span className="text-gray-600">
          Page {page} of {totalPages} {isFetching && isPlaceholderData && <Spinner />}
        </span>

        <Button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= totalPages || isFetching}
        >
          Next Page
        </Button>
      </div>
    </div>
  );
};