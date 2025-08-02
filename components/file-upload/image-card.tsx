'use client';

import { X } from 'lucide-react';
import { UploadedFile } from '@/lib/types';
import { formatFileSize } from '@/lib/file-validation';

interface ImageCardProps {
  file: UploadedFile;
  onRemove: (id: string) => void;
}

export function ImageCard({ file, onRemove }: ImageCardProps) {
  console.log('file in image card', file);
  return (
    <div className="relative group bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={file.objectUrl}
          alt={file.file.name}
          className="w-full h-full object-cover"
        />

        {/* Remove button */}
        <button
          onClick={() => onRemove(file.id)}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label={`Remove ${file.file.name}`}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Overlay with file info */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs font-medium truncate" title={file.file.name}>
            {file.file.name}
          </p>
          <p className="text-xs text-gray-300">
            {formatFileSize(file.file.size)}
          </p>
        </div>
      </div>
    </div>
  );
}
