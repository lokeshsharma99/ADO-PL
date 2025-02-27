'use client';

import { useState, useRef } from 'react';
import { ContentType } from '@/types/content';
import { getPromptForContentType } from '@/utils/prompts';
import { GDS_CATEGORIES } from '@/utils/constants';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { ContentPreview } from '@/components/content/ContentPreview';
import { ExportPanel } from '@/components/content/ExportPanel';
import { searchGovUKContent, processWithChainOfThought } from '@/utils/braveSearch';
import { ResearchInsights } from '@/components/visualizations/ResearchInsights';

interface ContentEditorProps {
  contentType: ContentType;
}

interface Author {
  name: string;
  role: string;
}

interface ChainOfThoughtProgress {
  relevantPoints: string[];
  summary: string;
  references: Array<{ title: string; url: string; }>;
  stage: 'analyzing' | 'synthesizing' | 'generating' | 'complete';
}

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

type GenerationContentType = 'blog' | 'news' | 'announcement';

// Add these utility functions at the top of the file after the imports
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const callMistralAPI = async (payload: any, retryCount = 0, maxRetries = 3): Promise<any> => {
  const MISTRAL_API_KEY = 'Lu7xpXn9EScc0UkfDxGFY6HOpAlsFFRR';
  const baseDelay = 1000; // 1 second

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify(payload)
    });

    if (response.status === 429 && retryCount < maxRetries) {
      // Calculate exponential backoff delay
      const delay = baseDelay * Math.pow(2, retryCount);
      console.log(`Rate limited, attempt ${retryCount + 1}/${maxRetries}. Waiting ${delay}ms...`);
      await wait(delay);
      return callMistralAPI(payload, retryCount + 1, maxRetries);
    }

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (retryCount < maxRetries) {
      const delay = baseDelay * Math.pow(2, retryCount);
      console.log(`Error occurred, attempt ${retryCount + 1}/${maxRetries}. Retrying in ${delay}ms...`);
      await wait(delay);
      return callMistralAPI(payload, retryCount + 1, maxRetries);
    }
    throw error;
  }
};

export const ContentEditor = ({ contentType }: ContentEditorProps) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [generationContext, setGenerationContext] = useState('');
  const [author, setAuthor] = useState<Author>({ name: '', role: '' });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chainOfThoughtProgress, setChainOfThoughtProgress] = useState<ChainOfThoughtProgress | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const prompt = getPromptForContentType(contentType);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAuthorChange = (field: keyof Author) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(prev => ({ ...prev, [field]: e.target.value }));
    setError(null);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setError(null);
  };

  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
  };

  const handleContentFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only accept text files
    if (!file.type.startsWith('text/')) {
      setError('Only text files are supported');
      return;
    }

    try {
      const text = await file.text();
      // Extract title from first line or first sentence
      const firstLine = text.split('\n')[0];
      const title = firstLine.length > 100 ? firstLine.substring(0, 100) + '...' : firstLine;
      setContent(text);
      setError(null);
    } catch (err) {
      setError('Failed to read file content');
      console.error('Error reading file:', err);
    }
  };

  const handleGenerationContextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGenerationContext(e.target.value);
    setError(null);
  };

  const handleGenerateContent = async () => {
    if (!generationContext.trim()) {
      setGenerationError('Please provide a topic for content generation');
      return;
    }

    try {
      setIsGenerating(true);
      setGenerationError(null);

      // First, search for relevant GOV.UK content
      const searchResults = await searchGovUKContent(generationContext);

      // Generate title with context from search results
      const titlePayload = {
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: getTitlePrompt(contentType)
          },
          {
            role: 'user',
            content: `Generate a ${contentType} title for this topic: ${generationContext}\n\nRelevant information from GOV.UK:\n${
              searchResults.map(result => `- ${result.title}\n  ${result.description}`).join('\n')
            }`
          }
        ],
        temperature: 0.7,
        max_tokens: 50
      };

      const titleData = await callMistralAPI(titlePayload);
      
      if (!titleData.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from AI service');
      }

      let generatedTitle = titleData.choices[0].message.content
        .trim()
        .replace(/^["']|["']$/g, '')
        .replace(/^#+ /g, '')
        .replace(/\.$/, '');
        
      generatedTitle = generatedTitle.split(/[\n\r]/)[0].trim();
      
      setTitle(generatedTitle);

      // Add a small delay between API calls
      await wait(1000);

      // Generate the main content using search results for context
      const contentPayload = {
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: getContentPrompt(contentType)
          },
          {
            role: 'user',
            content: `Title: ${generatedTitle}\n\nTopic: ${generationContext}\n\nRelevant GOV.UK sources:\n${
              searchResults.map(result => `- ${result.title}\n  URL: ${result.url}\n  ${result.description}`).join('\n\n')
            }${
              author ? `\n\nAuthor: ${author.name} (${author.role})` : ''
            }${
              selectedCategories.length > 0 ? `\n\nCategories: ${selectedCategories.join(', ')}` : ''
            }`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      };

      const contentData = await callMistralAPI(contentPayload);
      
      if (!contentData.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from AI service');
      }

      // Format the content with proper markdown structure
      const formattedContent = formatContentWithSources(
        contentData.choices[0].message.content,
        searchResults
      );

      setContent(formattedContent);
      setIsGenerating(false);

    } catch (error) {
      console.error('Content generation error:', error);
      setGenerationError(
        error instanceof Error 
          ? `Error: ${error.message}. Please try again in a few moments.` 
          : 'Failed to generate content. Please try again in a few moments.'
      );
      setIsGenerating(false);
    }
  };

  // Helper function to get title prompt
  const getTitlePrompt = (type: GenerationContentType) => {
    const prompts: Record<GenerationContentType, string> = {
      blog: `You are a professional title generator for blog posts. Create a catchy, engaging, and descriptive title that:
- Grabs attention while maintaining professionalism
- Uses active voice and strong verbs
- Avoids generic terms like "Introduction" or "Overview"
- Reflects the main value or insight of the content
- Follows UK Government style guidelines
- Is concise (5-10 words)
- Does not include unnecessary punctuation

IMPORTANT: Return ONLY the title text. Do not include any explanations, notes, or additional text.`,

      news: `You are a professional title generator for news articles. Create a clear, informative title that:
- Leads with the most important information
- Uses present tense for current events
- Is factual and objective
- Avoids sensationalism
- Follows UK Government style guidelines
- Is concise (5-10 words)
- Does not include unnecessary punctuation

IMPORTANT: Return ONLY the title text. Do not include any explanations, notes, or additional text.`,

      announcement: `You are a professional title generator for official announcements. Create a clear, authoritative title that:
- States the announcement purpose directly
- Uses official but accessible language
- Includes relevant service or policy names
- Follows UK Government style guidelines
- Is concise (5-10 words)
- Does not include unnecessary punctuation

IMPORTANT: Return ONLY the title text. Do not include any explanations, notes, or additional text.`
    };

    return prompts[type] || prompts.blog;
  };

  // Helper function to get content prompt
  const getContentPrompt = (type: GenerationContentType) => {
    const prompts: Record<GenerationContentType, string> = {
      blog: `Create a detailed blog post that:
- Starts with an engaging introduction
- Uses clear headings for main sections
- Includes real examples and specific details
- Ends with a conclusion or call to action
- Uses markdown formatting
Do not include the title in the content.`,

      news: `Create a news article that:
- Leads with key information (inverted pyramid style)
- Includes supporting details and context
- Uses quotes or relevant data
- Provides background information
- Uses markdown formatting
Do not include the title in the content.`,

      announcement: `Create an announcement that:
- States the key message or change clearly
- Includes important dates or deadlines
- Specifies who is affected
- Lists required actions
- Provides next steps
- Uses markdown formatting
Do not include the title in the content.`
    };

    return prompts[type] || prompts.blog;
  };

  // Helper function to format content with proper structure and sources
  const formatContentWithSources = (content: string, sources: Array<{ title: string; url: string; }>) => {
    // Split content into sections based on headings
    const sections = content.split(/(?=^#{1,3} )/m);
    
    // Format each section with proper spacing
    const formattedSections = sections.map(section => section.trim()).join('\n\n');
    
    // Add sources section at the end
    const formattedContent = `${formattedSections}

## Sources and References

${sources.map(source => `- [${source.title}](${source.url})`).join('\n')}

---

*Generated using official GOV.UK sources on ${new Date().toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})}*`;

    return formattedContent;
  };

  const handlePreviewContentChange = (newContent: string, newTitle: string) => {
    setContent(newContent);
    setTitle(newTitle);
    // Update any other necessary state based on the edited content
  };

  const renderResearchResults = () => {
    if (!chainOfThoughtProgress) return null;

    return (
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Research Insights</h3>
        <ResearchInsights
          relevantPoints={chainOfThoughtProgress.relevantPoints}
          summary={chainOfThoughtProgress.summary}
          references={chainOfThoughtProgress.references}
          stage={chainOfThoughtProgress.stage}
        />
      </div>
    );
  };

  if (showPreview) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowPreview(false)}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Back to editor
          </button>
        </div>
        <ContentPreview
          title={title}
          content={content}
          contentType={contentType}
          author={contentType === 'blog' ? author : undefined}
          categories={selectedCategories}
          images={images}
          onContentChange={handlePreviewContentChange}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="space-y-8">
        {/* Content Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ... keep content type selection ... */}
        </div>

        {/* Additional Context */}
        <div className="space-y-2">
          <label htmlFor="context" className="block text-sm font-medium text-gray-700">
            Topic
          </label>
          <textarea
            id="context"
            rows={5}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter topic, context or requirements for AI content generation."
            value={generationContext}
            onChange={(e) => setGenerationContext(e.target.value)}
          />
        </div>

        {/* Author Info (for blog posts) */}
        {contentType === 'blog' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="authorName"
                className="block text-sm font-medium text-gray-700"
              >
                Author Name
              </label>
              <input
                type="text"
                id="authorName"
                value={author.name}
                onChange={handleAuthorChange('name')}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter author's name"
                disabled={isGenerating}
              />
            </div>
            <div>
              <label 
                htmlFor="authorRole"
                className="block text-sm font-medium text-gray-700"
              >
                Author Role
              </label>
              <input
                type="text"
                id="authorRole"
                value={author.role}
                onChange={handleAuthorChange('role')}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter author's role"
                disabled={isGenerating}
              />
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-2">
          {/* ... keep categories section ... */}
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          {/* ... keep image upload section ... */}
        </div>

        {/* Content Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Output Content</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setContent('')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
              <button
                onClick={handleGenerateContent}
                disabled={isGenerating}
                className={`
                  inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                  ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}
                `}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </>
                ) : 'Generate Content'}
              </button>
            </div>
          </div>

          {generationError && (
            <div className="text-red-600 text-sm" role="alert">
              {generationError}
            </div>
          )}

          {content && (
            <ContentPreview
              title={title}
              content={content}
              contentType={contentType}
              author={contentType === 'blog' ? author : undefined}
              categories={selectedCategories}
              images={images}
              onContentChange={handlePreviewContentChange}
            />
          )}
        </div>

        {/* Export Panel */}
        {content && (
          <ExportPanel
            content={{
              title: title,
              content,
              type: contentType,
              author: contentType === 'blog' ? author : undefined,
              categories: selectedCategories,
            }}
          />
        )}
      </div>
    </div>
  );
}; 