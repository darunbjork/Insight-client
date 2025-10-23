import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { User } from '../types/models.types';
import { UpdateProfilePayload } from '../types/api.types';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

/**
 * ✍️ useUpdateProfile: Handles updating user details (username/email).
 */
export const useUpdateProfile = () => {
  const { updateProfile } = useAuth(); // AuthContext handles updating the user state

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => authApi.updateProfile(payload),
    onSuccess: (data) => {
      // The authApi.updateProfile returns the updated user object.
      // We rely on the AuthContext's updateProfile function to handle the setUser(updatedUser) logic.
      updateProfile(data); 
      // Note: The success toast is already handled inside the AuthContext's updateProfile
    },
    // onError is handled globally in main.tsx QueryClient configuration
  });
};

/**
 * 🖼️ useUploadAvatar: Handles the complex multipart/form-data upload.
 */
export const useUploadAvatar = () => {
  const { updateProfile } = useAuth();
  
  return useMutation({
    mutationFn: async (file: File) => {
      // ⚠️ CRITICAL: Must use FormData for multipart/form-data
      const formData = new FormData();
      formData.append('avatar', file); // Field name 'avatar' must match backend contract
      
      const response = await authApi.uploadAvatar(formData);
      // Backend returns { status: 'success', user: User }
      return response.user;
    },
    onSuccess: (updatedUser: User) => {
      // Update the AuthContext state with the new user object (containing the new avatar URL)
      updateProfile({ user: updatedUser }); 
      toast.success('Avatar uploaded successfully!');
    },
    // onError is handled globally in main.tsx
  });
};