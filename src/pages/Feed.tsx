import React from 'react';
import { Layout } from '../components/layout/Layout';
// ... existing imports ...
import { PostFeed } from '../components/posts/PostFeed';
import { CreatePostForm } from '../components/posts/CreatePostForm';

export const Feed: React.FC = () => {
  // ... loading check ...

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
        {/* Left Column (Create Post Form) */}
        <div className="lg:col-span-1 lg:order-1 order-2">
          <CreatePostForm />
        </div>
        
        {/* Main Column (Global Post Feed) */}
        <div className="lg:col-span-2 lg:order-2 order-1">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">Global Feed</h1>
          <PostFeed /> {/* Pass no userId, defaults to global feed */}
        </div>
      </div>
    </Layout>
  );
};
