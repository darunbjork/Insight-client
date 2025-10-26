import React from 'react';
import { Post } from '../../types/models.types';
import { useAuth } from '../../hooks/useAuth';
import { useLikePost, useDeletePost } from '../../hooks/usePosts';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { HeartIcon, TrashIcon } from '@heroicons/react/24/solid'; // Assumes Heroicons installed

interface PostActionsProps {
  post: Post;
  isDetailPage?: boolean;
}

/**
 * 💖 PostActions: Component containing Like and Delete buttons.
 */
export const PostActions: React.FC<PostActionsProps> = ({ post, isDetailPage = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Use post.id for mutation key
  const likeMutation = useLikePost(post.id);
  const deleteMutation = useDeletePost();

  const isAuthor = user?.id === post.author.id;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      try {
        await deleteMutation.mutateAsync(post.id);
        if (isDetailPage) {
          // Redirect to the main feed after deleting from the detail page
          navigate('/');
        }
      } catch {
        // Error handled globally
      }
    }
  };

  const handleLike = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    likeMutation.mutate();
  };
  
  const likeCountDisplay = post.likeCount > 0 ? `${post.likeCount} Likes` : 'Like';

  return (
    <div className="flex items-center space-x-4">
      {/* LIKE BUTTON */}
      <Button
        onClick={handleLike}
        disabled={likeMutation.isLoading}
        className={`flex items-center space-x-1 ${post.isLiked ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-gray-500 bg-gray-50 hover:bg-gray-100'}`}
        variant="secondary"
      >
        <HeartIcon className={`w-5 h-5 ${post.isLiked ? 'fill-current' : 'text-gray-400'}`} />
        <span className="text-sm font-medium">{likeCountDisplay}</span>
      </Button>
      
      {/* DELETE BUTTON (Only visible to author) */}
      {isAuthor && (
        <Button
          onClick={handleDelete}
          isLoading={deleteMutation.isLoading}
          variant="danger"
          className="flex items-center space-x-1"
        >
          <TrashIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Delete</span>
        </Button>
      )}
    </div>
  );
};