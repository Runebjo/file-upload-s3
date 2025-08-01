export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface FileValidationOptions {
  maxSize: number; // in bytes
  maxFiles: number;
  allowedTypes: string[];
}

export const DEFAULT_OPTIONS: FileValidationOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 5,
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
};

export function validateFile(file: File, options: FileValidationOptions = DEFAULT_OPTIONS): ValidationResult {
  const errors: string[] = [];

  // Check file type
  if (!options.allowedTypes.includes(file.type)) {
    errors.push(`${file.name}: Only image files are allowed`);
  }

  // Check file size
  if (file.size > options.maxSize) {
    const maxSizeMB = options.maxSize / (1024 * 1024);
    errors.push(`${file.name}: File size must be under ${maxSizeMB}MB`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateFiles(files: File[], currentCount: number = 0, options: FileValidationOptions = DEFAULT_OPTIONS): ValidationResult {
  const errors: string[] = [];

  // Check total file count
  if (currentCount + files.length > options.maxFiles) {
    errors.push(`Maximum ${options.maxFiles} files allowed`);
  }

  // Validate each file
  files.forEach(file => {
    const result = validateFile(file, options);
    errors.push(...result.errors);
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}