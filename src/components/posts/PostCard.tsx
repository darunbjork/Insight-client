import React from 'react';
import type { Post } from '../../types/models.types';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/dateFormatter';
import './PostCard.scss'; // Import the SCSS file
import { PostActions } from './PostActions'; // Assuming PostActions is imported

interface PostCardProps {
  post: Post;
}

/**
 * 📰 PostCard: Displays a single post item in the feed.
 */
export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="post-card">
      
      {post.imageUrl && (
        <div className="post-image-container">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="post-image"
          />
        </div>
      )}
      
      <div className="post-author-info">
        <img 
          src={post.author.avatar || '/default-avatar.png'} 
          alt={post.author.username} 
          className="post-author-avatar"
        />
        <Link to={`/user/${post.author._id}`} className="post-author-username">
          @{post.author.username}
        </Link>
        <span>•</span>
        <span>{formatDate(post.createdAt)}</span>
      </div>

      <Link to={`/posts/${post._id}`}>
        <h3 className="post-title">
          {post.title}
        </h3>
      </Link>
      
      <p className="post-content">
        {post.content}
      </p>
      
      <div className="post-actions-container">
        {/* NEW: Post Actions Component */}
        <PostActions post={post} /> 
      </div>
    </div>
  );
};