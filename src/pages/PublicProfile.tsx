import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { usePublicProfile } from '../hooks/usePublicUser';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/dateFormatter';

/**
 * 👤 PublicProfile: Displays the profile of any user.
 */
export const PublicProfile: React.FC = () => {
  const { id: userId } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  
  const { 
    data: publicUser, 
    isLoading, 
    isError, 
  } = usePublicProfile(userId!);

  // Redirect to own profile page if viewing self
  if (currentUser?.id === userId) {
    return <Navigate to="/profile" replace />;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center p-10 h-64 items-center"><Spinner /></div>
      </Layout>
    );
  }

  if (isError || !publicUser) {
    // Note: error.response?.status === 404 would be better here for non-existent users
    return (
      <Layout>
        <div className="text-center p-10 text-red-600">
          Error: User not found or profile access failed.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-6 border-b pb-6 mb-6">
          <img
            src={publicUser.avatar || '/default-avatar.png'}
            alt={publicUser.username}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {publicUser.username}
            </h1>
            <p className="text-lg text-gray-500">
              Member since {formatDate(publicUser.createdAt, true)}
            </p>
          </div>
        </div>
        
        {/* Placeholder for future user's posts/feed */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {publicUser.username}'s Posts
          </h2>
          <div className="p-8 bg-gray-50 rounded-lg text-center text-gray-600">
            Posts by this user coming soon (Day 9 feature extension).
          </div>
        </div>
      </div>
    </Layout>
  );
};