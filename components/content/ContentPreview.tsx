'use client';

import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { ContentType } from '@/types/content';
import { useState, useEffect } from 'react';

interface ContentPreviewProps {
  title: string;
  content: string;
  contentType: ContentType;
  author?: {
    name: string;
    role: string;
  };
  categories?: string[];
  images?: File[];
  onContentChange?: (newContent: string, newTitle: string) => void;
}

interface ImageWithSection {
  file: File;
  section?: string;
  isBanner: boolean;
}

export const ContentPreview = ({
  title,
  content,
  contentType,
  author,
  categories = [],
  images = [],
  onContentChange,
}: ContentPreviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [editedTitle, setEditedTitle] = useState(title);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // Clean up content to remove any potential title duplication at the start
  const cleanContent = editedContent.trim()
    .split('\n')
    .filter(line => line.trim() !== editedTitle.trim()) // Remove any lines that match the title exactly
    .join('\n')
    .trim();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleSaveChanges = () => {
    if (onContentChange) {
      onContentChange(editedContent, editedTitle);
    }
    setIsEditing(false);
  };

  const handleDiscardChanges = () => {
    setEditedContent(content);
    setEditedTitle(title);
    setIsEditing(false);
  };

  // Update local state when props change
  useEffect(() => {
    setEditedContent(content);
    setEditedTitle(title);
  }, [content, title]);

  const renderBannerImage = (image: File) => (
    <div className="relative w-full h-[300px] mb-8 rounded-lg overflow-hidden">
      <img
        src={URL.createObjectURL(image)}
        alt="Banner image"
        className="w-full h-full object-cover"
      />
    </div>
  );

  const renderInlineImage = (image: File) => (
    <div className="relative my-6">
      <img
        src={URL.createObjectURL(image)}
        alt="Content image"
        className="w-full rounded-lg shadow-sm"
      />
      <p className="text-sm text-gray-500 mt-2 italic">
        {image.name.split('.')[0]}
      </p>
    </div>
  );

  const bannerImage = images.find(img => 
    img.name.toLowerCase().includes('banner')
  );

  const components: Partial<Components> = {
    h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3" {...props} />,
    p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-6" {...props} />,
    a: ({node, ...props}) => (
      <a 
        className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 decoration-2 underline-offset-2 font-medium"
        {...props}
      />
    ),
    ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-6" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-6" {...props} />,
    li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
    blockquote: ({node, ...props}) => (
      <blockquote 
        className="border-l-4 border-blue-500 pl-4 py-2 my-6 text-gray-700 italic bg-blue-50 rounded-r-lg"
        {...props}
      />
    ),
    code: ({node, className, children}) => {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !match;
      return isInline ? (
        <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      ) : (
        <pre className="block bg-gray-100 p-4 rounded-lg overflow-x-auto">
          <code className={`text-sm font-mono ${className || ''}`}>
            {children}
          </code>
        </pre>
      );
    },
    img: ({node, src, alt, ...props}) => {
      const matchingImage = images.find(img => 
        img.name.toLowerCase().includes(alt?.toLowerCase() || '')
      );
      if (matchingImage) {
        return renderInlineImage(matchingImage);
      }
      return (
        <img 
          src={src}
          alt={alt}
          className="rounded-lg shadow-sm my-6 max-w-full"
          {...props}
        />
      );
    },
    table: ({node, ...props}) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full divide-y divide-gray-200" {...props} />
      </div>
    ),
    th: ({node, ...props}) => (
      <th 
        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        {...props}
      />
    ),
    td: ({node, ...props}) => (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700" {...props} />
    ),
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-8">
        {/* Edit Controls */}
        <div className="flex justify-end mb-6 gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleDiscardChanges}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Discard Changes
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Content
            </button>
          )}
        </div>

        {/* Content Type Badge */}
        <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
          {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
        </div>

        {/* Title */}
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={handleTitleChange}
            className="w-full text-4xl font-extrabold text-gray-900 tracking-tight mb-6 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        ) : (
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-6">
            {editedTitle}
          </h1>
        )}

        {/* Date */}
        <div className="text-sm text-gray-600 mb-6">
          {formatDate(new Date())}
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8">
          {author && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>
                <strong className="font-medium">{author.name}</strong>
                {author.role && (
                  <span className="text-gray-500"> • {author.role}</span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                {category}
              </span>
            ))}
          </div>
        )}

        {/* Banner Image */}
        {bannerImage && renderBannerImage(bannerImage)}

        {/* Content */}
        {isEditing ? (
          <div className="space-y-4">
            <label htmlFor="content-editor" className="sr-only">Edit content</label>
            <textarea
              id="content-editor"
              value={editedContent}
              onChange={handleContentChange}
              rows={20}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
              placeholder="Enter your content in markdown format"
            />
            <div className="text-sm text-gray-500">
              <p>Use markdown formatting:</p>
              <ul className="list-disc list-inside">
                <li># Heading 1</li>
                <li>## Heading 2</li>
                <li>**Bold text**</li>
                <li>*Italic text*</li>
                <li>- Bullet points</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown components={components}>
              {cleanContent}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}; 