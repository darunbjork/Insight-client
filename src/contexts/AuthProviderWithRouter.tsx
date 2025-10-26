
import { AuthProvider } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { type ReactNode } from 'react';

export const AuthProviderWithRouter = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  return (
    <AuthProvider navigate={navigate}>
      {children}
    </AuthProvider>
  );
};
