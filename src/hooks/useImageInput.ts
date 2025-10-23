import { useState, useCallback, useEffect } from 'react';

/**
 * 🖼️ useImageInput: Manages file selection, preview creation, and memory cleanup.
 * Problem Solved: Prevents memory leaks by revoking temporary object URLs.
 */
export const useImageInput = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // 1. Create a preview URL whenever a new file is set
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    // Create a temporary, client-side URL for the browser to display the image
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // 2. CRITICAL Cleanup function: Revoke the object URL when the component unmounts 
    // or when the file changes to prevent memory leaks in the browser.
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  // Handle file selection from input event
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  }, []);

  // Clear file and preview state
  const clearFile = useCallback(() => {
    setFile(null);
  }, []);

  return { 
    file, 
    preview, 
    handleFileChange, 
    clearFile,
    hasFile: !!file // Utility boolean
  };
};