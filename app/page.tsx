'use client';

import { useState } from 'react';
import { ContentEditor } from '@/components/content/ContentEditor';
import { Header } from '@/components/ui/Header';
import { ContentTypeSelector } from '@/components/ui/ContentTypeSelector';
import { ContentType } from '@/types/content';

export default function Home() {
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('blog');

  const handleContentTypeChange = (type: ContentType) => {
    setSelectedContentType(type);
  };

  return (
    <>
      <Header />
      <main className="flex-grow">
        <div className="max-w-[960px] mx-auto px-8 py-10">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h1 className="text-[36px] font-bold text-[#0b0c0c] mb-8">
              Content Writing Assistant
            </h1>
            
            <ContentTypeSelector 
              selectedType={selectedContentType}
              onTypeChange={handleContentTypeChange}
            />
            
            <div className="mt-8">
              <ContentEditor contentType={selectedContentType} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 