import { useState, useEffect, type ReactNode, useCallback } from 'react'; // Added useCallback
import { type User } from '../types/models.types';
import { authApi } from '../api/auth.api';
import type { LoginPayload, RegisterPayload, UpdateProfilePayload } from '../types/api.types';
import { parseApiError } from '../utils/errorHandler';
import toast from 'react-hot-toast';
import { AuthContext, type AuthContextType } from './auth.types';

import { type NavigateFunction } from 'react-router-dom';

// 3. Auth Provider Component
export const AuthProvider = ({ children, navigate }: { children: ReactNode, navigate: NavigateFunction }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use useCallback to prevent unnecessary re-creation of this function
  const safeLogout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout API failed, continuing client-side clear:", error);
    } finally {
      setUser(null);
      // We could clear React Query cache here, but often better done with the queryClient instance if needed
      toast.success('You have been logged out.');
    }
  }, []);
  
  /**
   * 🔄 Session Restoration Pattern
   * Problem Solved: Keeps the user logged in across tab closes and page refreshes.
   * How it works: On mount, it calls /auth/refresh. If HttpOnly cookie is valid, the backend
   * issues a new access token and returns the user object, restoring the session.
   */
  useEffect(() => {
    const initAuth = async () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/login' || currentPath === '/register') {
        setIsLoading(false);
        return;
      }

      if (user) {
        setIsLoading(false);
        return;
      }

      try {
        const { user: refreshedUser } = await authApi.refresh();
        setUser(refreshedUser);
        console.log('Session restored successfully.');
      } catch {
        setUser(null);
        console.log('Redirecting to login page...');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [navigate, user]);

  const login = async (payload: LoginPayload) => {
    const { user: loggedInUser } = await authApi.login(payload);
    setUser(loggedInUser);
    toast.success(`Welcome back, ${loggedInUser.username}!`);
    navigate('/');
  };
  
  const register = async (payload: RegisterPayload) => {
    await authApi.register(payload);
    toast.success('Account created! Please login.');
    navigate('/login');
  };

  const updateProfile = async (payload: UpdateProfilePayload) => {
    try {
      const { user: updatedUser } = await authApi.updateProfile(payload);
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(parseApiError(error));
      throw error;
    }
  };

  // 2. Token Refresh Logic Finalization (Runs once on mount)
  useEffect(() => {
    // We attach the interceptor outside of React and rely on `authApi.refresh()`
    // which uses the underlying HttpOnly cookie.
    
    // We must ensure the interceptor is robustly implemented in client.ts
    
    // For this specific architecture (HttpOnly cookies + axios interceptors + window.location.href), 
    // we don't need to pass the setUser/safeLogout function into the interceptor 
    // because the forced redirect on failure is the most reliable clean state.

    // If we used a global state manager (Zustand) we could pass the store action here.
    
  }, [safeLogout]); // The interceptor logic is entirely self-contained in client.ts

  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout: safeLogout,
    updateProfile,
    navigate,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
