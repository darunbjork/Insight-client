import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useUpdateProfile } from '../../hooks/useUser';
import type { UpdateProfilePayload } from '../../types/api.types';
import toast from 'react-hot-toast';

// 1. Zod Schema
const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileForm: React.FC = () => {
  const { user } = useAuth();
  const updateMutation = useUpdateProfile();
  
  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
  });

  // CRITICAL: Initialize form with current user data
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    // Only send fields that have changed (optimization)
    const payload: UpdateProfilePayload = {};
    if (data.username !== user?.username) payload.username = data.username;
    if (data.email !== user?.email) payload.email = data.email;

    if (Object.keys(payload).length === 0) {
      toast('Nothing to update!', { icon: 'ℹ️' });
      return;
    }

    try {
      await updateMutation.mutateAsync(payload);
      // Reset the form state after successful update to clear isDirty flag
      reset(data); 
    } catch {
      // Error handled by global handler
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Username"
        type="text"
        error={errors.username?.message}
        {...register('username')}
        disabled={isSubmitting}
      />
      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register('email')}
        disabled={isSubmitting}
      />
      
      <Button 
        type="submit" 
        className="w-full"
        isLoading={isSubmitting}
        disabled={!isDirty || isSubmitting} // Disable if no changes or submitting
      >
        Save Changes
      </Button>
    </form>
  );
};