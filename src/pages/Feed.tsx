import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/ui/Spinner';

export const Feed: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    // If AuthContext is still initializing, show a loading state
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
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        Welcome{user ? `, ${user.username}` : ''}!
      </h1>
      <p className="text-lg text-gray-600">
        This is the main Feed. You are currently {user ? 'logged in.' : 'logged out. The Feed is visible but interactions will be restricted on Day 4.'}
      </p>
      {/* Post feed component will go here on Day 6 */}
    </Layout>
  );
};
