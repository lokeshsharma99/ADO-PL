'use client';

import { useState, useCallback } from 'react';

interface ContentPublisherProps {
  contentId: string;
  onPublish?: (id: string) => void;
}

const ContentPublisher = ({ contentId, onPublish }: ContentPublisherProps) => {
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = useCallback(async () => {
    if (isPublished || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate publish action with localStorage
      localStorage.setItem(`published-${contentId}`, 'true');
      setIsPublished(true);
      onPublish?.(contentId);
      
    } catch (error) {
      setError('Failed to publish content');
      console.error('Publishing error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [contentId, isLoading, isPublished, onPublish]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePublish();
    }
  }, [handlePublish]);

  return (
    <div 
      className="space-y-4"
      role="region"
      aria-label="Content publishing controls"
    >
      {error && (
        <div 
          className="text-red-600 p-4 rounded bg-red-50 border border-red-200" 
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
      
      <button
        onClick={handlePublish}
        onKeyDown={handleKeyDown}
        disabled={isLoading || isPublished}
        className={`
          px-4 py-2 rounded font-medium
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${isPublished 
            ? 'bg-green-500 text-white focus:ring-green-500' 
            : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        `}
        aria-busy={isLoading}
        aria-disabled={isLoading || isPublished}
        tabIndex={0}
      >
        {isLoading ? 'Publishing...' : isPublished ? 'Published' : 'Publish'}
      </button>
    </div>
  );
};

export default ContentPublisher; 