import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import { ProfileForm } from '../components/profile/ProfileForm'; // New import
import { AvatarUpload } from '../components/profile/AvatarUpload'; // New import
import { Button } from '../components/ui/Button';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    // Should be caught by ProtectedRoute, but good fallback
    return null;
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-gray-900 border-b pb-4">Account Settings</h1>
        
        {/* AVATAR UPLOAD SECTION */}
        <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Profile Picture</h2>
          <AvatarUpload />
        </section>

        {/* PROFILE DETAILS SECTION */}
        <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Details</h2>
          <ProfileForm />
        </section>
        
        {/* LOGOUT SECTION */}
        <section className="flex justify-end p-4 border-t pt-6">
          <Button variant="danger" onClick={logout}>
            Logout of Insight
          </Button>
        </section>
      </div>
    </Layout>
  );
};
