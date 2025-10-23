import React, { useState } from 'react';
import { PostCard } from './PostCard';
import { usePosts } from '../../hooks/usePosts';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';

/**
 * 🧱 PostFeed: Manages pagination state and renders the list of posts.
 */
export const PostFeed: React.FC = () => {
  // We manage the current page state locally in this component
  const [page, setPage] = useState(1);
  const limit = 10; // Posts per page

  // Fetch the data for the current page
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    isPlaceholderData // From keepPreviousData: true setting in hook
  } = usePosts(page, limit);

  // Destructure the actual array of posts and pagination metadata
  const posts = data?.data || [];
  const totalPages = data?.totalPages || 1;

  // Compute pagination controls
  const canGoNext = page < totalPages;
  const canGoPrev = page > 1;



  if (isError) {
    return (
      <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">
        <h2 className="font-bold text-xl">Error Loading Feed</h2>
        <p>There was an issue fetching posts. ({error.message})</p>
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

  // Show message if no posts are available
  if (posts.length === 0) {
    return (
      <div className="text-center p-10 text-gray-600 bg-gray-50 rounded-lg">
        <h2 className="font-bold text-xl">No Posts Found</h2>
        <p>Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {/* Render the posts */}
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center border-t pt-4">
        <Button
          onClick={() => setPage(p => p - 1)}
          disabled={!canGoPrev || isFetching}
          variant="secondary"
          isLoading={isFetching && page - 1 === page - 1}
        >
          Previous Page
        </Button>

        <span className="text-gray-600">
          Page {page} of {totalPages} {isFetching && isPlaceholderData && <Spinner />}
        </span>

        <Button
          onClick={() => setPage(p => p + 1)}
          disabled={!canGoNext || isFetching}
          isLoading={isFetching && page + 1 === page + 1}
        >
          Next Page
        </Button>
      </div>
    </div>
  );
};