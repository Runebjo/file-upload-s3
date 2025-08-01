# File Upload App Implementation Plan

## Overview
Create a Next.js app with drag-and-drop file upload functionality using modern React patterns and shadcn/ui components.

## Technical Stack
- **Framework**: Next.js 15 with TypeScript
- **UI Library**: shadcn/ui components
- **Drag & Drop**: react-dropzone
- **Styling**: Tailwind CSS (via shadcn)
- **File Handling**: Browser File API with URL.createObjectURL
- **Unique IDs**: uuid package
- **Notifications**: shadcn Toast component

## Core Requirements Implementation

### 1. Dependencies Setup
```bash
npm install react-dropzone uuid
npm install @types/uuid
npx shadcn-ui@latest add toast
```

### 2. File Validation Rules
- **File Types**: Only image files (MIME type checking)
- **File Size**: Maximum 2MB per file
- **File Count**: Maximum 5 files per drop operation
- **Supported Formats**: jpg, jpeg, png, gif, webp, svg

### 3. Main Page Design Structure

#### Layout Components:
1. **Header Section**
   - App title
   - Brief instructions

2. **Dropzone Area**
   - Large, visually appealing drop target
   - Drag states (idle, drag-over, drag-reject)
   - Visual feedback with borders/colors
   - File input fallback for click-to-upload

3. **Image Preview Grid**
   - Responsive grid layout (2-3 columns on mobile, 4-5 on desktop)
   - Image thumbnails with proper aspect ratio
   - File information overlay (name, size)
   - Remove button for each image

### 4. State Management Structure
```typescript
interface UploadedFile {
  id: string;          // uuid
  file: File;          // original File object
  preview: string;     // URL.createObjectURL result
  name: string;        // file name
  size: number;        // file size in bytes
}

// Main state
const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
```

### 5. File Processing Flow

#### Drop Handler Logic:
1. **Validation Phase**
   - Check file count (current + new ≤ 5)
   - Validate each file type (image MIME types)
   - Validate each file size (≤ 2MB)
   - Collect validation errors

2. **Processing Phase**
   - Generate UUID for each valid file
   - Create object URLs for previews
   - Create UploadedFile objects
   - Update state with new files

3. **Feedback Phase**
   - Show success toast for valid files
   - Show error toast for rejected files with specific reasons
   - Update UI to reflect new state

### 6. Error Handling & User Feedback

#### Toast Messages:
- **Success**: "X files uploaded successfully"
- **File Type Error**: "Only image files are allowed"
- **File Size Error**: "Files must be under 2MB"
- **File Count Error**: "Maximum 5 files allowed"
- **Mixed Errors**: Combine multiple error types

#### Visual States:
- **Idle**: Default dropzone appearance
- **Drag Over**: Highlighted border, background change
- **Drag Reject**: Red border, error styling
- **Loading**: Optional loading state during processing

### 7. Memory Management
- **Cleanup**: Revoke object URLs when files are removed
- **useEffect cleanup**: Revoke all URLs on component unmount
- **File removal**: Individual cleanup when removing specific files

### 8. Responsive Design
- **Mobile**: Single column grid, larger touch targets
- **Tablet**: 2-3 column grid, medium spacing
- **Desktop**: 4-5 column grid, optimal spacing

## File Structure
```
app/
├── page.tsx                 # Main page component
├── components/
│   ├── file-upload/
│   │   ├── dropzone.tsx     # Main dropzone component
│   │   ├── image-grid.tsx   # Preview grid component
│   │   └── image-card.tsx   # Individual image preview
│   └── ui/                  # shadcn components
└── lib/
    ├── utils.ts             # Utility functions
    └── file-validation.ts   # File validation logic
```

## Implementation Phases

### Phase 1: Basic Setup
1. Install dependencies
2. Setup shadcn toast
3. Create basic page structure
4. Implement basic dropzone

### Phase 2: File Handling
1. Add file validation logic
2. Implement state management
3. Create object URLs for previews
4. Add basic error handling

### Phase 3: UI Polish
1. Create image preview components
2. Add responsive grid layout
3. Implement toast notifications
4. Add drag states and animations

### Phase 4: Optimization
1. Add proper TypeScript types
2. Implement memory cleanup
3. Add accessibility features
4. Performance optimizations

## Additional Considerations
- **Accessibility**: Proper ARIA labels, keyboard navigation
- **Performance**: Lazy loading for large grids, efficient re-renders
- **Browser Support**: Modern browsers with File API support
- **Testing**: Unit tests for validation logic, integration tests for upload flow