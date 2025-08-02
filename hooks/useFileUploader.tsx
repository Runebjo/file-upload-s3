import { UploadedFile } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const useFileUploader = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    console.log('uploadedFiles in useEffect', uploadedFiles);
    return () => {
      uploadedFiles.forEach((file) => {
        if (file.objectUrl) {
          URL.revokeObjectURL(file.objectUrl);
        }
      });
    };
  }, [uploadedFiles]);

  const handleUploadFiles = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      setUploadedFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => ({
          id: uuidv4(),
          file,
          uploading: false,
          progress: 0,
          isDeleting: false,
          error: false,
          objectUrl: URL.createObjectURL(file),
        })),
      ]);

      acceptedFiles.forEach(uploadFile);
    }
  }, []);

  const handleRemoveFile = useCallback(async (id: string) => {
    try {
      console.log('id', id);
      console.log('uploadedFiles', uploadedFiles);
      const fileToRemove = uploadedFiles.find((f) => f.id === id);
      console.log('fileToRemove', fileToRemove);
      if (fileToRemove) {
        if (fileToRemove.objectUrl) {
          URL.revokeObjectURL(fileToRemove.objectUrl);
        }
      }

      // If file hasn't been uploaded to S3 yet (no key), just remove from local state
      if (!fileToRemove?.key) {
        setUploadedFiles((prevFiles) => prevFiles.filter((f) => f.id !== id));
        toast.success('File removed successfully');
        return;
      }

      setUploadedFiles((prevFiles) =>
        prevFiles.map((f) => (f.id === id ? { ...f, isDeleting: true } : f))
      );

      const response = await fetch('/api/s3/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: fileToRemove.key }),
      });

      console.log('response', response);

      if (!response.ok) {
        toast.error('Failed to remove file from storage.');
        setUploadedFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.id === id ? { ...f, isDeleting: false, error: true } : f
          )
        );
        return;
      }

      setUploadedFiles((prevFiles) => prevFiles.filter((f) => f.id !== id));
      toast.success('File removed successfully');
    } catch (error) {
      toast.error('Failed to remove file from storage.');
      setUploadedFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === id ? { ...f, isDeleting: false, error: true } : f
        )
      );
    }
  }, [uploadedFiles]);

  const uploadFile = async (file: File) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.map((f) => (f.file === file ? { ...f, uploading: true } : f))
    );

    try {
      // 1. Get presigned URL
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

        setUploadedFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.file === file
              ? { ...f, uploading: false, progress: 0, error: true }
              : f
          )
        );

        return;
      }

      const { presignedUrl, key } = await presignedResponse.json();

      // 2. Upload file to S3
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setUploadedFiles((prevFiles) =>
              prevFiles.map((f) =>
                f.file === file
                  ? { ...f, progress: Math.round(percentComplete), key: key }
                  : f
              )
            );
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            // 3. File fully uploaded - set progress to 100
            setUploadedFiles((prevFiles) =>
              prevFiles.map((f) =>
                f.file === file
                  ? { ...f, progress: 100, uploading: false, error: false }
                  : f
              )
            );

            toast.success('File uploaded successfully');
            console.log('uploadedFiles finished', uploadedFiles);

            resolve();
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Upload failed'));
        };

        xhr.open('PUT', presignedUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });
    } catch {
      toast.error('Something went wrong');

      setUploadedFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.file === file
            ? { ...f, uploading: false, progress: 0, error: true }
            : f
        )
      );
    }
  };

  return {
    uploadedFiles,
    handleUploadFiles,
    handleRemoveFile,
  };
};

export default useFileUploader;
