import React, { createContext } from 'react';
import { User } from '../types/models.types';
import { LoginPayload, RegisterPayload, UpdateProfilePayload } from '../types/api.types';

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