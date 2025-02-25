'use client';

import { useState } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface TopicImage {
  file: File;
  preview: string;
  topic?: string;
  isBanner: boolean;
  section?: string;
}

interface TopicImageUploaderProps {
  topics: string[];
  onImagesChange: (images: TopicImage[]) => void;
  maxImages?: number;
}

export const TopicImageUploader = ({
  topics,
  onImagesChange,
  maxImages = 10
}: TopicImageUploaderProps) => {
  const [images, setImages] = useState<TopicImage[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [isBanner, setIsBanner] = useState(false);
  const [section, setSection] = useState('');

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please upload JPG, PNG, GIF, or WebP images.';
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'File too large. Maximum size is 5MB.';
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const newImages: TopicImage[] = [];
    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        alert(error);
        return;
      }

      newImages.push({
        file,
        preview: URL.createObjectURL(file),
        topic: selectedTopic || undefined,
        isBanner,
        section: section || undefined
      });
    });

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Topic
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a topic</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Section Name (optional)
          </label>
          <input
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="e.g., Introduction, Background"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isBanner}
            onChange={(e) => setIsBanner(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Use as banner image</span>
        </label>

        <div className="flex-grow" />

        <label className="relative cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          <span className="flex items-center space-x-2">
            <PhotoIcon className="h-5 w-5" />
            <span>Add Image</span>
          </span>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            multiple
          />
        </label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={image.preview}
                alt={`Upload ${index + 1}`}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity" />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="h-4 w-4 text-gray-600" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-xs">
                {image.topic && <div className="font-medium">Topic: {image.topic}</div>}
                {image.section && <div>Section: {image.section}</div>}
                <div className="text-blue-600">{image.isBanner ? 'Banner Image' : 'Inline Image'}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-sm text-gray-500">
        Supported formats: JPG, PNG, GIF, WebP. Maximum size: 5MB per image.
      </div>
    </div>
  );
}; 