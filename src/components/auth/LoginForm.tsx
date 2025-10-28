import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import type { LoginPayload } from '../../types/api.types';
import { parseApiError } from '../../utils/errorHandler';
import toast from 'react-hot-toast';
import './LoginForm.scss'; // Import the SCSS file

// 1. Zod Schema for Client-side Validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data as LoginPayload); // Cast is safe as schema matches payload
    } catch (error) {
      // Catch error re-thrown from useAuth's login, then parse and display it
      const message = parseApiError(error);
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
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
        placeholder="******"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button 
        type="submit" 
        className="w-full" // Keep w-full for now, it will be overridden by SCSS
        isLoading={isSubmitting}
      >
        Sign In
      </Button>
    </form>
  );
};
