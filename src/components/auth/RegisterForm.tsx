import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import type { RegisterPayload } from '../../types/api.types';
import { parseApiError } from '../../utils/errorHandler';
import toast from 'react-hot-toast';

// 1. Zod Schema for Client-side Validation
const registerSchema = z.object({
  username: z.string().min(3, 'Username required (min 3 chars)'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const { register: authRegister } = useAuth();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await authRegister(data as RegisterPayload); 
    } catch (error) {
      const message = parseApiError(error);
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Username"
        type="text"
        placeholder="Your desired username"
        error={errors.username?.message}
        {...register('username')}
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Minimum 6 characters"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button 
        type="submit" 
        className="w-full"
        isLoading={isSubmitting}
      >
        Create Account
      </Button>
    </form>
  );
};
