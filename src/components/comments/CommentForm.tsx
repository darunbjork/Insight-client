import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { useCreateComment } from '../../hooks/useComments';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// 1. Zod Schema
const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface CommentFormProps {
  postId: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const { user } = useAuth();
  const createMutation = useCreateComment(postId);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentFormValues) => {
    if (!user) {
      toast.error("Please log in to leave a comment.");
      return;
    }
    
    try {
      await createMutation.mutateAsync({
        postId,
        content: data.content,
      });
      reset(); // Clear form on successful submission
    } catch {
      // Error handled by global handler
    }
  };
  
  if (!user) {
    return (
      <div className="p-4 bg-gray-50 text-center text-gray-600 rounded-lg">
        <p>Please <Link to="/login" className="text-blue-600 hover:underline font-medium">log in</Link> to join the conversation.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-inner">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <textarea
          placeholder="Write a comment..."
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
            ${errors.content ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
          {...register('content')}
        />
        {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            isLoading={isSubmitting || createMutation.isLoading}
          >
            Post Comment
          </Button>
        </div>
      </form>
    </div>
  );
};
