import React from 'react';
import type { Comment } from '../../types/models.types';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/dateFormatter';

interface CommentCardProps {
  comment: Comment;
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  return (
    <div className="flex space-x-3 p-3 border-b border-gray-100 last:border-b-0">
      <img
        src={comment.author.avatar || '/default-avatar.png'}
        alt={comment.author.username}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline space-x-2 text-sm">
          <Link to={`/user/${comment.author.id}`} className="font-semibold text-gray-800 hover:text-blue-600">
            {comment.author.username}
          </Link>
          <span className="text-gray-500">•</span>
          <span className="text-gray-500">{formatDate(comment.createdAt)}</span>
        </div>
        <p className="text-gray-700 mt-1 break-words">
          {comment.content}
        </p>
      </div>
    </div>
  );
};
