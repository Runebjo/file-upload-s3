'use client';

import { UploadedFile } from '@/lib/types';
import { ImageCard } from './image-card';

interface ImageGridProps {
  files: UploadedFile[];
  onRemoveFile: (id: string) => void;
  className?: string;
}

export function ImageGrid({ files, onRemoveFile, className }: ImageGridProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">
        Uploaded Images ({files.length})
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {files.map((file) => (
          <ImageCard
            key={file.id}
            file={file}
            onRemove={onRemoveFile}
          />
        ))}
      </div>
    </div>
  );
}