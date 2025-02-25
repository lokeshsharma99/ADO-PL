'use client';

import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { TopicImageUploader } from '@/components/ui/TopicImageUploader';

interface TopicImage {
  file: File;
  preview: string;
  topic?: string;
  isBanner: boolean;
  section?: string;
}

interface NewsItem {
  topic: string;
  headline: string;
  content: string;
  image?: string;
  summary: string;
  references: Array<{ title: string; url: string }>;
}

export const NewsFeedCompiler = () => {
  const [topics, setTopics] = useState<string[]>([]);
  const [currentTopic, setCurrentTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [topicImages, setTopicImages] = useState<TopicImage[]>([]);
  const [showImageUploader, setShowImageUploader] = useState(false);

  const handleAddTopic = () => {
    if (currentTopic.trim() && !topics.includes(currentTopic.trim())) {
      setTopics([...topics, currentTopic.trim()]);
      setCurrentTopic('');
    }
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setTopics(topics.filter(topic => topic !== topicToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTopic();
    }
  };

  const handleImagesChange = (images: TopicImage[]) => {
    setTopicImages(images);
  };

  const getTopicImages = (topic: string) => {
    return topicImages.filter(img => img.topic === topic);
  };

  const generateNewsFeed = async () => {
    if (topics.length === 0) return;

    setIsGenerating(true);
    setError(null);
    setShowImageUploader(false);
    const generatedNews: NewsItem[] = [];

    try {
      for (const topic of topics) {
        // Step 1: Search for relevant content
        const searchResults = await fetch('/api/brave-search', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: topic }),
        });

        if (!searchResults.ok) {
          throw new Error(`Failed to search for topic: ${topic}`);
        }

        // Step 2: Generate catchy headline and content
        const newsResponse = await fetch('/api/generate-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: topic,
            contentType: 'news',
            searchResults: await searchResults.json(),
          }),
        });

        if (!newsResponse.ok) {
          throw new Error(`Failed to generate news for topic: ${topic}`);
        }

        const newsData = await newsResponse.json();
        generatedNews.push({
          topic,
          headline: newsData.headline,
          content: newsData.content,
          image: newsData.image,
          summary: newsData.summary,
          references: newsData.references,
        });
      }

      setNewsItems(generatedNews);
      // Show image uploader after successful generation
      setShowImageUploader(true);
    } catch (error) {
      console.error('Error generating newsfeed:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate newsfeed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Compile News Feed
        </h2>
        
        {/* Topics Input */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={currentTopic}
              onChange={(e) => setCurrentTopic(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a topic"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isGenerating}
            />
            <button
              onClick={handleAddTopic}
              disabled={!currentTopic.trim() || isGenerating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Topics List */}
          {topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {topic}
                  <button
                    onClick={() => handleRemoveTopic(topic)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <button
            onClick={generateNewsFeed}
            disabled={topics.length === 0 || isGenerating}
            className={`
              w-full px-4 py-2 rounded-md text-sm font-medium text-white
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${topics.length === 0 || isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {isGenerating ? 'Generating News Feed...' : 'Generate News Feed'}
          </button>
        </div>
      </div>

      {/* News Feed Display */}
      {newsItems.length > 0 && (
        <>
          {/* Image Uploader (shown after content generation) */}
          {showImageUploader && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Enhance Your Content with Images
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Add banner images or section-specific images to your generated content.
              </p>
              <TopicImageUploader
                topics={topics}
                onImagesChange={handleImagesChange}
                maxImages={20}
              />
            </div>
          )}

          <div className="space-y-6">
            {newsItems.map((item, index) => (
              <article
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {/* Banner Images */}
                {getTopicImages(item.topic)
                  .filter(img => img.isBanner)
                  .map((img, imgIndex) => (
                    <div key={imgIndex} className="relative h-48 w-full">
                      <img
                        src={img.preview}
                        alt={`${item.topic} banner`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {item.headline}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">Topic: {item.topic}</p>
                  <p className="text-gray-700 mb-4">{item.summary}</p>

                  {/* Content with Inline Images */}
                  <div className="prose max-w-none">
                    {item.content}
                    {getTopicImages(item.topic)
                      .filter(img => !img.isBanner)
                      .map((img, imgIndex) => (
                        <div key={imgIndex} className="my-4">
                          <img
                            src={img.preview}
                            alt={`${item.topic} content image`}
                            className="w-full rounded-lg"
                          />
                          {img.section && (
                            <p className="text-sm text-gray-500 mt-2">
                              Section: {img.section}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>

                  {/* References section */}
                  {item.references.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Sources:</h4>
                      <ul className="space-y-1">
                        {item.references.map((ref, idx) => (
                          <li key={idx}>
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-500"
                            >
                              {ref.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}; 