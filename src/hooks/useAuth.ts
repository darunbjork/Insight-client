import { useContext } from 'react';
import { AuthContext } from '../contexts/auth.types';

/**
 * 💡 Custom Hook for AuthContext
 * Problem Solved: Provides a convenient and type-safe way to access auth state,
 * and automatically throws an error if used outside of the provider (AuthContext.Provider).
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This is the safety check for developers: ensures the hook is used correctly
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};