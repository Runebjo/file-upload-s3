'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Dropzone } from '@/components/file-upload/dropzone';
import { ImageGrid } from '@/components/file-upload/image-grid';
import { UploadedFile } from '@/lib/types';

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleFilesAccepted = useCallback((files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleRemoveFile = useCallback((id: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [uploadedFiles]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            File Upload App
          </h1>
          <p className="text-muted-foreground">
            Drag and drop your images or click to browse • Max 5 files, 2MB each
          </p>
        </div>

        {/* Dropzone */}
        <div className="mb-8">
          <Dropzone
            onFilesAccepted={handleFilesAccepted}
            currentFileCount={uploadedFiles.length}
            disabled={uploadedFiles.length >= 5}
            className="w-full"
          />
        </div>

        {/* Image Grid */}
        <ImageGrid
          files={uploadedFiles}
          onRemoveFile={handleRemoveFile}
        />

        {uploadedFiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No images uploaded yet. Drag and drop some files above to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}