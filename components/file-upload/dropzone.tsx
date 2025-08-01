'use client';

import { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Upload, Image, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateFiles, DEFAULT_OPTIONS } from '@/lib/file-validation';
import { toast } from 'sonner';

interface DropzoneProps {
  onFilesAccepted: (files: File[]) => void;
  currentFileCount: number;
  disabled?: boolean;
  className?: string;
}

export function Dropzone({
  onFilesAccepted,
  currentFileCount,
  disabled,
  className,
}: DropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Handle rejected files from react-dropzone
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(({ file, errors }) =>
          errors.map((e) => `${file.name}: ${e.message}`).join(', ')
        );
        toast.error(`Upload failed: ${errors.join(', ')}`);
      }

      // Validate accepted files
      if (acceptedFiles.length > 0) {
        const validation = validateFiles(acceptedFiles, currentFileCount);

        if (validation.valid) {
          onFilesAccepted(acceptedFiles);
          toast.success(
            `${acceptedFiles.length} file${
              acceptedFiles.length > 1 ? 's' : ''
            } uploaded successfully`
          );
        } else {
          toast.error(`Upload failed: ${validation.errors.join(', ')}`);
        }
      }
    },
    [onFilesAccepted, currentFileCount]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept,
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
    },
    maxSize: DEFAULT_OPTIONS.maxSize,
    multiple: true,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer',
        'flex flex-col items-center justify-center min-h-[200px] text-center',
        {
          'border-muted-foreground/25 hover:border-muted-foreground/50':
            !isDragActive && !disabled,
          'border-green-500 bg-green-50 dark:bg-green-950/20': isDragAccept,
          'border-red-500 bg-red-50 dark:bg-red-950/20': isDragReject,
          'border-primary bg-primary/5': isDragActive && !isDragReject,
          'opacity-50 cursor-not-allowed': disabled,
        },
        className
      )}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-4">
        {isDragReject ? (
          <X className="h-12 w-12 text-red-500" />
        ) : isDragActive ? (
          <Upload className="h-12 w-12 text-primary animate-bounce" />
        ) : (
          <Image
            className="h-12 w-12 text-muted-foreground"
            aria-label="upload image"
          />
        )}

        <div className="space-y-2">
          {isDragReject ? (
            <p className="text-red-600 dark:text-red-400 font-medium">
              Some files cannot be uploaded
            </p>
          ) : isDragActive ? (
            <p className="text-primary font-medium">Drop your images here</p>
          ) : (
            <>
              <p className="text-foreground font-medium">
                Drag & drop images here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, GIF, WebP up to 5MB each • Max{' '}
                {DEFAULT_OPTIONS.maxFiles} files
              </p>
            </>
          )}
        </div>
      </div>

      {currentFileCount > 0 && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
          {currentFileCount}/{DEFAULT_OPTIONS.maxFiles}
        </div>
      )}
    </div>
  );
}
