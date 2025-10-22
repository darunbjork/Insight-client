import apiClient from './client';
import { 
  LoginPayload, 
  RegisterPayload, 
  AuthSuccessResponse, 
  UpdateProfilePayload 
} from '../types/api.types';
import { User } from '../types/models.types';

// The authentication-specific API methods.
// We return the response.data directly to simplify hook consumption.
export const authApi = {
  // POST /api/v1/auth/register
  register: (payload: RegisterPayload) => 
    apiClient.post<AuthSuccessResponse>('/auth/register', payload).then(res => res.data),

  // POST /api/v1/auth/login
  login: (payload: LoginPayload) => 
    apiClient.post<AuthSuccessResponse>('/auth/login', payload).then(res => res.data),

  // GET /api/v1/auth/refresh
  // This is used by the interceptor AND the AuthContext for session restoration.
  refresh: () => 
    apiClient.get<AuthSuccessResponse>('/auth/refresh').then(res => res.data),

  // POST /api/v1/auth/logout
  // Note: The backend clears the HttpOnly cookie, no client-side action needed beyond the call.
  logout: () => 
    apiClient.post<void>('/auth/logout').then(res => res.data),
    
  // PUT /api/v1/auth/profile
  updateProfile: (payload: UpdateProfilePayload) => 
    apiClient.put<AuthSuccessResponse>('/auth/profile', payload).then(res => res.data),
    
  // PUT /api/v1/auth/avatar (multipart/form-data)
  uploadAvatar: (formData: FormData) => 
    apiClient.put<AuthSuccessResponse>('/auth/avatar', formData, {
      headers: { 
        // Axios sets this automatically for FormData, but being explicit is good practice
        'Content-Type': 'multipart/form-data' 
      },
    }).then(res => res.data),
};