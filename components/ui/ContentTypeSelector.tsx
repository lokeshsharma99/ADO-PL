'use client';

import { ContentType } from '@/types/content';

interface ContentTypeSelectorProps {
  selectedType: ContentType;
  onTypeChange: (type: ContentType) => void;
}

const contentTypeOptions = [
  { value: 'blog', label: 'Blog Post', description: 'In-depth articles and analysis' },
  { value: 'news', label: 'News Feed', description: 'Latest updates and current information' },
  { value: 'announcement', label: 'Announcement', description: 'Official statements and notices' },
] as const;

export const ContentTypeSelector = ({
  selectedType,
  onTypeChange,
}: ContentTypeSelectorProps) => {
  const handleOptionClick = (type: ContentType) => {
    onTypeChange(type);
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: ContentType) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTypeChange(type);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Select Content Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contentTypeOptions.map((option) => (
          <div
            key={option.value}
            role="button"
            tabIndex={0}
            aria-label={`Select ${option.label} content type`}
            aria-pressed={selectedType === option.value}
            onClick={() => handleOptionClick(option.value)}
            onKeyDown={(e) => handleKeyDown(e, option.value)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
              hover:border-blue-500 hover:bg-blue-50
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${selectedType === option.value 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 bg-white'
              }
            `}
          >
            <h3 className="font-medium text-gray-900">{option.label}</h3>
            <p className="mt-1 text-sm text-gray-500">{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}; 