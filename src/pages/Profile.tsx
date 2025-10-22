import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    // This case should ideally not be hit because the route is protected,
    // but a safety check is always good practice.
    return (
      <Layout>
        <div className="p-8 text-center text-red-500">Access Denied.</div>
      </Layout>
    );
  }
  
  const handleUpdate = async () => {
    // Placeholder for actual update logic in Day 5
    // For now, let's just log a message
    console.log('Update logic triggered (Day 5)');
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>
        
        <div className="space-y-4">
          <p className="text-lg">
            <span className="font-semibold text-gray-600">Username:</span> {user.username}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-600">Email:</span> {user.email}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-600">Member Since:</span> {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="mt-8 flex justify-end space-x-4">
          <Button variant="secondary" onClick={handleUpdate}>
            Edit Profile (Day 5)
          </Button>
          <Button variant="danger" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </Layout>
  );
};
