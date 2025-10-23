import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '../api/posts.api';
import { Layout } from '../components/layout/Layout';
import { Spinner } from '../components/ui/Spinner';
import { CommentList } from '../components/comments/CommentList'; // New
import { CommentForm } from '../components/comments/CommentForm'; // New
import { formatDate } from '../utils/dateFormatter';

/**
 * 📰 PostDetail: Fetches and displays a single post and its comments.
 */
export const PostDetail: React.FC = () => {
  // Get the ID from the URL parameter defined in router.tsx
  const { id: postId } = useParams<{ id: string }>();

  // Use React Query to fetch the single post
  const { 
    data: post, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['post', postId], // Cache key for a single post
    queryFn: () => postsApi.getById(postId!),
    enabled: !!postId, // Only run the query if postId exists
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center p-10 h-64 items-center">
          <Spinner />
        </div>
      </Layout>
    );
  }

  if (isError) {
    // If the post is not found (404), redirect to the feed
    if ((error as AxiosError).response?.status === 404) {
        return <Navigate to="/" replace state={{ error: "Post not found." }} />;
    }
    return (
      <Layout>
        <div className="text-center p-10 text-red-600">
          Error loading post. ({(error as AxiosError).message})
        </div>
      </Layout>
    );
  }
  
  if (!post) return <Navigate to="/" replace />; // Safety redirect

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            
          {/* Post Content Header (Reusing some PostCard elements manually for full control) */}
          <div className="pb-4 border-b">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{post.title}</h1>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
                <img 
                    src={post.author.avatar || '/default-avatar.png'} 
                    alt={post.author.username} 
                    className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-semibold text-blue-600">@{post.author.username}</span>
                <span>•</span>
                <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
          
          {/* Post Image and Content */}
          <div className="py-6 space-y-6">
            {post.imageUrl && (
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full max-h-[500px] object-cover rounded-lg"
              />
            )}
            <p className="text-lg text-gray-800 whitespace-pre-wrap">{post.content}</p>
          </div>
          
          <div className="flex justify-end pt-4 border-t text-sm text-gray-500">
            <span>{post.commentCount || 0} Comments</span>
          </div>
        </div>

        {/* Comment Section */}
        <CommentForm postId={postId!} />
        <CommentList />

      </div>
    </Layout>
  );
};
