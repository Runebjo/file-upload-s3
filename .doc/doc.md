# File Upload S3 App Documentation

## Overview

This is a Next.js-based file upload application that allows users to drag and drop image files for upload. Despite the name suggesting S3 integration, the current implementation focuses on client-side file handling and preview functionality without actual cloud storage integration.

## Tech Stack

- **Framework**: Next.js 15.4.5 with App Router
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components with Lucide React icons
- **File Handling**: react-dropzone for drag-and-drop functionality
- **Notifications**: Sonner for toast notifications
- **Theming**: next-themes for dark/light mode support

## Architecture

### Core Components

#### 1. Main Page (`app/page.tsx`)
- **Location**: `app/page.tsx:1`
- **Purpose**: Root component that manages the application state
- **Key Features**:
  - Manages uploaded files state using `useState`
  - Handles file acceptance and removal callbacks
  - Creates object URLs for file previews
  - Implements cleanup for object URLs to prevent memory leaks

#### 2. Dropzone Component (`components/file-upload/dropzone.tsx`)
- **Location**: `components/file-upload/dropzone.tsx:1`
- **Purpose**: Drag-and-drop file upload interface
- **Key Features**:
  - Built on react-dropzone library
  - Visual feedback for drag states (accept/reject)
  - File validation integration
  - Toast notifications for upload status
  - File counter display
  - Supports click-to-browse functionality

#### 3. Image Grid (`components/file-upload/image-grid.tsx`)
- **Location**: `components/file-upload/image-grid.tsx:1`
- **Purpose**: Displays uploaded images in a responsive grid layout
- **Key Features**:
  - Responsive grid (2-5 columns based on screen size)
  - Shows file count in header
  - Renders individual ImageCard components

#### 4. Image Card (`components/file-upload/image-card.tsx`)
- **Location**: `components/file-upload/image-card.tsx:1`
- **Purpose**: Individual image display component
- **Key Features**:
  - Square aspect ratio image display
  - Hover effects showing file information
  - Remove button with accessibility support
  - File name and size display on hover

### Utility Functions

#### File Validation (`lib/file-validation.ts`)
- **Location**: `lib/file-validation.ts:1`
- **Purpose**: Validates uploaded files against defined rules
- **Default Limits**:
  - Maximum file size: 5MB per file
  - Maximum files: 5 files total
  - Allowed types: JPEG, JPG, PNG, GIF, WebP, SVG
- **Functions**:
  - `validateFile()`: Validates single file
  - `validateFiles()`: Validates multiple files with count check
  - `formatFileSize()`: Converts bytes to human-readable format

#### Type Definitions (`lib/types.ts`)
- **Location**: `lib/types.ts:1`
- **Purpose**: TypeScript interface definitions
- **Key Types**:
  - `UploadedFile`: Represents an uploaded file with metadata

## File Upload Flow

1. **File Selection**: User drags files onto dropzone or clicks to browse
2. **Validation**: Files are validated against size, type, and count limits
3. **Preview Generation**: Object URLs are created for image previews
4. **State Management**: Files are added to the application state
5. **Grid Display**: Images are displayed in a responsive grid
6. **Removal**: Users can remove individual files, triggering cleanup

## Key Features

### File Validation
- **Size Limit**: 5MB per file
- **Count Limit**: Maximum 5 files
- **Type Restriction**: Image files only (JPEG, PNG, GIF, WebP, SVG)
- **Real-time Feedback**: Immediate validation with error messages

### User Experience
- **Drag & Drop**: Intuitive file upload interface
- **Visual Feedback**: Different states for drag actions
- **Responsive Design**: Works across different screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Toast Notifications**: Success/error feedback

### Memory Management
- **Object URL Cleanup**: Prevents memory leaks by revoking object URLs
- **Effect Cleanup**: Proper cleanup on component unmount

## Current Limitations

1. **No Cloud Storage**: Despite the S3 naming, files are only stored in browser memory
2. **No Persistence**: Files are lost on page refresh
3. **No Upload Progress**: No indication of upload progress
4. **Client-Side Only**: No server-side processing or storage

## Development Commands

- `npm run dev`: Start development server with Turbopack
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Future Enhancements

To fully implement S3 integration, the following would be needed:

1. **Backend API**: Server-side endpoints for file upload
2. **AWS SDK Integration**: S3 client configuration
3. **Upload Progress**: Real-time upload progress tracking
4. **File Persistence**: Database storage of file metadata
5. **Error Handling**: Comprehensive error handling for network issues
6. **Authentication**: User authentication for file ownership

## File Structure

```
file-upload-s3/
├── app/
│   ├── page.tsx          # Main application page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── file-upload/
│   │   ├── dropzone.tsx  # Drag-and-drop component
│   │   ├── image-grid.tsx # Grid layout for images
│   │   └── image-card.tsx # Individual image display
│   └── ui/               # Reusable UI components
├── lib/
│   ├── file-validation.ts # File validation utilities
│   ├── types.ts          # TypeScript definitions
│   └── utils.ts          # General utilities
└── public/               # Static assets
```

This application provides a solid foundation for a file upload system with room for expansion into a full-featured cloud storage solution.