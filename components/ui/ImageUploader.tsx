'use client';

import { useState, useRef } from 'react';
import { IMAGE_UPLOAD_CONFIG } from '@/utils/constants';

interface ImagePreview {
  file: File;
  preview: string;
  section?: string;
  title?: string;
  isBanner: boolean;
}

interface ImageUploaderProps {
  onImagesChange: (images: File[]) => void;
}

export const ImageUploader = ({ onImagesChange }: ImageUploaderProps) => {
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [contentText, setContentText] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [isBanner, setIsBanner] = useState(false);

  // Function to generate a title from content
  const generateTitle = (content: string): string => {
    // Split into sentences and take the first one
    const sentences = content.split(/[.!?]+/);
    const firstSentence = sentences[0].trim();
    
    // If sentence is too long, take first few words (5-8 words)
    const words = firstSentence.split(/\s+/);
    if (words.length > 8) {
      return words.slice(0, 8).join(' ') + '...';
    }
    return firstSentence;
  };

  // Function to extract section name from content
  const extractSection = (content: string): string => {
    const lines = content.split('\n');
    // Find first line that starts with # or first non-empty line
    const sectionLine = lines.find(line => line.startsWith('#')) || lines.find(line => line.trim().length > 0) || '';
    return sectionLine.replace(/^#+\s*/, '').trim(); // Remove heading markers
  };

  const validateFile = (file: File): string | null => {
    if (!IMAGE_UPLOAD_CONFIG.acceptedTypes.includes(file.type)) {
      return 'File type not supported. Please upload JPG, PNG, GIF, or WebP images.';
    }
    if (file.size > IMAGE_UPLOAD_CONFIG.maxSize) {
      return 'File size too large. Maximum size is 5MB.';
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError(null);

    if (previews.length + files.length > IMAGE_UPLOAD_CONFIG.maxFiles) {
      setError(`Maximum ${IMAGE_UPLOAD_CONFIG.maxFiles} images allowed`);
      return;
    }

    const newPreviews: ImagePreview[] = [];

    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        setError(error);
        return;
      }

      // Generate title from current content
      const title = contentText ? generateTitle(contentText) : undefined;

      // Create a new file name that includes the section and banner information
      const fileExtension = file.name.split('.').pop();
      const sectionPart = selectedSection ? `${selectedSection}-` : '';
      const bannerPart = isBanner ? 'banner-' : '';
      const newFileName = `${sectionPart}${bannerPart}${Date.now()}.${fileExtension}`;
      const renamedFile = new File([file], newFileName, { type: file.type });

      newPreviews.push({
        file: renamedFile,
        preview: URL.createObjectURL(file),
        section: selectedSection || undefined,
        title: title,
        isBanner: isBanner
      });
    });

    setPreviews(prev => {
      const updatedPreviews = [...prev, ...newPreviews];
      onImagesChange(updatedPreviews.map(p => p.file));
      return updatedPreviews;
    });

    // Reset the form
    setContentText('');
    setSelectedSection('');
    setIsBanner(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      onImagesChange(newPreviews.map(p => p.file));
      return newPreviews;
    });
  };

  const updateImageMetadata = (index: number, section: string, isBanner: boolean, title?: string) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      const preview = newPreviews[index];
      
      // Create a new file name with updated metadata
      const fileExtension = preview.file.name.split('.').pop();
      const sectionPart = section ? `${section}-` : '';
      const bannerPart = isBanner ? 'banner-' : '';
      const newFileName = `${sectionPart}${bannerPart}${Date.now()}.${fileExtension}`;
      const renamedFile = new File([preview.file], newFileName, { type: preview.file.type });
      
      newPreviews[index] = {
        ...preview,
        file: renamedFile,
        section: section || undefined,
        isBanner: isBanner,
        title: title
      };
      
      onImagesChange(newPreviews.map(p => p.file));
      return newPreviews;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isBanner}
            onChange={(e) => setIsBanner(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Use as banner image</span>
        </label>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            id="images"
            multiple
            accept={IMAGE_UPLOAD_CONFIG.acceptedTypes.join(',')}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Images
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm" role="alert">
          {error}
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={preview.preview} className="relative group bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <img
                src={preview.preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <div className="space-y-2">
                {preview.title && (
                  <p className="text-xs text-gray-500">
                    <strong>Title:</strong> {preview.title}
                  </p>
                )}
                {preview.section && (
                  <p className="text-xs text-gray-500">
                    <strong>Section:</strong> {preview.section}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={preview.isBanner}
                      onChange={(e) => updateImageMetadata(index, preview.section || '', e.target.checked, preview.title)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Banner</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-1 text-red-600 hover:text-red-700"
                    aria-label="Remove image"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-sm text-gray-500">
        <p>Supported formats: JPG, PNG, GIF, WebP</p>
        <p>Maximum size: 5MB per image</p>
        <p>Maximum {IMAGE_UPLOAD_CONFIG.maxFiles} images allowed</p>
      </div>
    </div>
  );
}; 