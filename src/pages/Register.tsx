import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Layout } from '../components/layout/Layout';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Register: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Redirect authenticated users away from the register page
  if (!isLoading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </Layout>
  );
};
