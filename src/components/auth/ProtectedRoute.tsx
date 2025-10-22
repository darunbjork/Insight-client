import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../layout/Layout';
import { Spinner } from '../ui/Spinner';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * 🚧 Protected Route Wrapper
 * Problem Solved: Centralizes access control logic, preventing unauthenticated 
 * users from viewing sensitive pages.
 * Tradeoffs: Introduces a necessary loading screen/delay while session restoration completes.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  // 1. Initial Loading State:
  // If we are still checking the cookie (initAuth is running), show a full-page loading screen.
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen bg-white">
          <div className="flex flex-col items-center">
            <Spinner />
            <p className="mt-4 text-gray-600">Restoring session...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // 2. Unauthenticated State:
  // If loading is complete AND there is no user, redirect to login.
  // The 'replace' prop ensures the login page replaces the history entry, 
  // preventing the user from hitting "back" to land on the protected route again.
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // 3. Authenticated State:
  // User is present, render the intended children component.
  return <>{children}</>;
};