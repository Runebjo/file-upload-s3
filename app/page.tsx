'use client';

import { Dropzone } from '@/components/file-upload/dropzone';
import { ImageGrid } from '@/components/file-upload/image-grid';
import useFileUploader from '@/hooks/useFileUploader';

export default function Home() {
  const { uploadedFiles, handleFilesAccepted, handleRemoveFile } =
    useFileUploader();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            File Upload App
          </h1>
          <p className="text-muted-foreground">
            Drag and drop your images or click to browse • Max 5 files, 5MB each
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
        <ImageGrid files={uploadedFiles} onRemoveFile={handleRemoveFile} />

        {uploadedFiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No images uploaded yet. Drag and drop some files above to get
              started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
