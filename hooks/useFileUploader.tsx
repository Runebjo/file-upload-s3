import { UploadedFile } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { uuidv4 } from 'zod';

const useFileUploader = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [uploadedFiles]);

  const handleFilesAccepted = useCallback((files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    files.forEach(uploadFile);
  }, []);

  const handleRemoveFile = useCallback((id: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const uploadFile = async (file: File) => {
    console.log('uploading files', file);

    try {
      const presignedResponse = await fetch('/api/s3/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });

      if (!presignedResponse.ok) {
        toast.error('Failed to get presigned URL');

        return;
      }

      const { presignedUrl, key } = await presignedResponse.json();

      console.log('presignedUrl', presignedUrl);
      console.log('key', key);

      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        toast.error('Failed to upload file');

        return;
      }

      console.log('uploadResponse', uploadResponse);

      const uploadedFile = {
        id: uuidv4(),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      };

      setUploadedFiles((prev) => [...prev, uploadedFile]);
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };
  return { uploadedFiles, handleFilesAccepted, handleRemoveFile };
};

export default useFileUploader;
