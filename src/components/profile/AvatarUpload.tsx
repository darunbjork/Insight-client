import React, { useMemo } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { useAuth } from '../../hooks/useAuth';
import { useUploadAvatar } from '../../hooks/useUser';
import toast from 'react-hot-toast';

export const AvatarUpload: React.FC = () => {
  const { user } = useAuth();
  const uploadMutation = useUploadAvatar();

  // Custom styles for dropzone feedback
  const baseStyle = 'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-200';
  const activeStyle = 'border-blue-500 bg-blue-50';
  const rejectStyle = 'border-red-500 bg-red-50';
  const loadingStyle = 'opacity-60 pointer-events-none';

  const onDrop = async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      const error = fileRejections[0]?.errors[0];
      let message = 'File upload failed.';
      if (error?.code === 'file-too-large') {
        message = 'File is too large (max 5MB).';
      } else if (error?.code === 'file-invalid-type') {
        message = 'Invalid file type. Only images are supported.';
      }
      toast.error(message);
      return;
    }

    if (acceptedFiles.length === 1) {
      try {
        await uploadMutation.mutateAsync(acceptedFiles[0]);
        // Success toast is handled in useUploadAvatar
      } catch {
        // Error handled globally
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxSize: 5 * 1024 * 1024, // 5MB limit ⚠️ Client-side limit must be backed by a server-side check
    multiple: false,
  });

  const style = useMemo(() => ({
    className: `${baseStyle} ${isDragActive ? activeStyle : ''} ${fileRejections.length > 0 ? rejectStyle : ''} ${uploadMutation.isPending ? loadingStyle : ''}`
  }), [isDragActive, fileRejections, uploadMutation.isPending]);

  const avatarUrl = user?.avatar;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <img
          src={avatarUrl || '/default-avatar.png'} // Use a default image if none exists
          alt={`${user?.username}'s avatar`}
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
        />
        <div
          {...getRootProps(style)}
          className={style.className}
        >
          <input {...getInputProps()} />
          {uploadMutation.isPending ? (
            <p className="text-gray-500">Uploading...</p>
          ) : isDragActive ? (
            <p className="font-semibold text-blue-600">Drop the image here...</p>
          ) : (
            <p className="text-gray-500">
              Drag 'n' drop a new avatar, or click to select (Max 5MB)
            </p>
          )}
        </div>
      </div>

      {uploadMutation.error && (
        <p className="text-sm text-red-500">
          Failed to upload avatar. {uploadMutation.error.message || 'Check file type.'}
        </p>
      )}
    </div>
  );
};