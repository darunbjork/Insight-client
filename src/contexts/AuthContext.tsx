import { useState, useEffect, type ReactNode } from 'react';
import { type User } from '../types/models.types';
import { authApi } from '../api/auth.api';
import type { LoginPayload, RegisterPayload, UpdateProfilePayload } from '../types/api.types';
import { parseApiError } from '../utils/errorHandler';
import toast from 'react-hot-toast';
import { AuthContext, type AuthContextType } from './auth.types';

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
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
    const { user: loggedInUser } = await authApi.login(payload);
    setUser(loggedInUser);
    toast.success(`Welcome back, ${loggedInUser.username}!`);
  };
  
  const register = async (payload: RegisterPayload) => {
    const { user: registeredUser } = await authApi.register(payload);
    setUser(registeredUser);
    toast.success(`Account created! Welcome, ${registeredUser.username}!`);
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
