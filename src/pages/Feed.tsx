import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/ui/Spinner';
import { PostFeed } from '../components/posts/PostFeed'; // New import
import { CreatePostForm } from '../components/posts/CreatePostForm'; // New import

export const Feed: React.FC = () => {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Layout>
        <div className="h-48 flex justify-center items-center">
          <Spinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
        {/* Left Column (Create Post Form) */}
        <div className="lg:col-span-1 lg:order-1 order-2">
          <CreatePostForm />
        </div>
        
        {/* Main Column (Post Feed) */}
        <div className="lg:col-span-2 lg:order-2 order-1">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">Global Feed</h1>
          <PostFeed />
        </div>
      </div>
    </Layout>
  );
};
