import React from 'react';
import type { Post } from '../../types/models.types';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/dateFormatter';

interface PostCardProps {
  post: Post;
}

/**
 * 📰 PostCard: Displays a single post item in the feed.
 */
export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 space-y-4">
      
      {post.imageUrl && (
        <div className="mb-4">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      )}
      
      <div className="flex items-center space-x-3 text-sm text-gray-500">
        <img 
          src={post.author.avatar || '/default-avatar.png'} 
          alt={post.author.username} 
          className="w-8 h-8 rounded-full object-cover"
        />
        <Link to={`/user/${post.author._id}`} className="font-semibold text-blue-600 hover:text-blue-700">
          @{post.author.username}
        </Link>
        <span>•</span>
        <span>{formatDate(post.createdAt)}</span>
      </div>

      <Link to={`/posts/${post._id}`}>
        <h3 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-150">
          {post.title}
        </h3>
      </Link>
      
      <p className="text-gray-700 line-clamp-3">
        {post.content}
      </p>
      
      <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
        {/* NEW: Post Actions Component */}
        <PostActions post={post} /> 
      </div>
    </div>
  );
};