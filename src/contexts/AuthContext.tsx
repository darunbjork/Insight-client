import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/models.types';
import { authApi } from '../api/auth.api';
import { LoginPayload, RegisterPayload, UpdateProfilePayload } from '../types/api.types';
import { parseApiError } from '../utils/errorHandler';
import toast from 'react-hot-toast';

// 1. Auth Context Type
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
}

// 2. Create Context
// We assert the type as undefined initially, which is handled by the useAuth hook check
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Auth Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 🔄 Session Restoration Pattern
   * Problem Solved: Keeps the user logged in across tab closes and page refreshes.
   * How it works: On mount, it calls /auth/refresh. If HttpOnly cookie is valid, the backend
   * issues a new access token and returns the user object, restoring the session.
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { user: refreshedUser } = await authApi.refresh(); // Tries to use the existing refresh cookie
        setUser(refreshedUser);
        console.log('Session restored successfully.');
      } catch (error) {
        // Refresh failed (e.g., no cookie or refresh token expired)
        setUser(null);
        // Note: The /login redirect is handled by the API client interceptor if a network call fails,
        // but here we just clear the state.
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []); // Run only once on component mount

  const login = async (payload: LoginPayload) => {
    try {
      const { user: loggedInUser } = await authApi.login(payload);
      setUser(loggedInUser);
      toast.success(`Welcome back, ${loggedInUser.username}!`);
    } catch (error) {
      // Error handled globally via QueryClient or specifically by forms
      throw error; // Re-throw to allow form component to catch and handle submission state
    }
  };
  
  const register = async (payload: RegisterPayload) => {
    try {
      const { user: registeredUser } = await authApi.register(payload);
      setUser(registeredUser);
      toast.success(`Account created! Welcome, ${registeredUser.username}!`);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      toast.success('You have been logged out.');
    } catch (error) {
      toast.error(parseApiError(error));
    }
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

  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Re-export useAuth from its hook file for cleaner import paths
// (The custom hook is preferred over useContext(AuthContext))
export { useAuth }; 