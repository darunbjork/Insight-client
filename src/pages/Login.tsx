import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { Layout } from '../components/layout/Layout';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Login: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Redirect authenticated users away from the login page
  if (!isLoading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Register now
          </Link>
        </p>
      </div>
    </Layout>
  );
};
