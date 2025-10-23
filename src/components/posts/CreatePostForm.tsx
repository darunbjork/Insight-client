import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from ' @hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useCreatePost } from '../../hooks/usePosts';
import { useAuth } from '../../hooks/useAuth';
import { useImageInput } from '../../hooks/useImageInput';
import { CreatePostPayload } from '../../types/api.types';
import toast from 'react-hot-toast';

// 1. Zod Schema
const postSchema = z.object({
  title: z.string().min(3, 'Title is required (min 3 chars)'),
  content: z.string().min(10, 'Content is required (min 10 chars)'),
});

type PostFormValues = z.infer<typeof postSchema>;

export const CreatePostForm: React.FC = () => {
  const { user } = useAuth();
  const createMutation = useCreatePost();
  const { file, preview, handleFileChange, clearFile, hasFile } = useImageInput();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = async (data: PostFormValues) => {
    if (!user) {
      toast.error("You must be logged in to post.");
      return;
    }
    
    // Combine form data and file data into the final payload
    const payload: CreatePostPayload = {
      ...data,
      image: file || undefined, // undefined if no file is selected
    };

    try {
      await createMutation.mutateAsync(payload);
      
      // On success: Clear the form and the file input
      reset();
      clearFile(); 
    } catch (error) {
      // Error handled by global handler
      console.error(error);
    }
  };

  if (!user) return null; // Only show form if logged in

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Share Your Thoughts</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          placeholder="Title (e.g., My first post)"
          error={errors.title?.message}
          {...register('title')}
          className="text-lg"
        />
        <textarea
          placeholder="What's on your mind? (Minimum 10 characters)"
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 
            ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
          {...register('content')}
        />
        {errors.content && <p className="mt-1 text-sm text-red-500" role="alert">{errors.content.message}</p>}
        
        {/* IMAGE UPLOAD SECTION */}
        <div className="flex items-center space-x-4">
          <label className="block text-sm font-medium text-gray-700">Image:</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {hasFile && (
            <Button type="button" variant="danger" onClick={clearFile} className="flex-shrink-0">
              Remove
            </Button>
          )}
        </div>
        
        {preview && (
          <div className="mt-2">
            <img src={preview} alt="Post preview" className="max-h-60 rounded-lg object-cover w-full" />
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full"
          isLoading={isSubmitting || createMutation.isPending}
        >
          {createMutation.isPending ? 'Posting...' : 'Post to Feed'}
        </Button>
      </form>
    </div>
  );
};