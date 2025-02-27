'use client';

export interface BraveSearchResult {
  title: string;
  description: string;
  url: string;
  image?: string;
}

interface BraveSearchApiResult {
  title?: string;
  description?: string;
  url?: string;
  image?: {
    url?: string;
  };
}

export interface ChainOfThoughtResult {
  relevantPoints: string[];
  summary: string;
  suggestedContent: string;
  references: Array<{
    title: string;
    url: string;
  }>;
}

export const searchGovUKContent = async (query: string): Promise<BraveSearchResult[]> => {
  const BRAVE_API_KEY = 'BSAsDd5v_DhzOXMvxDp59Up7gE4F9FU';
  const endpoint = 'https://api.search.brave.com/res/v1/web/search';
  
  try {
    const response = await fetch(`${endpoint}?q=${encodeURIComponent(query)} site:gov.uk`, {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Brave Search API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.web?.results?.map((result: any) => ({
      title: result.title,
      description: result.description,
      url: result.url
    })) || [];
  } catch (error) {
    console.error('Error searching GOV.UK content:', error);
    return [];
  }
};

export async function processWithChainOfThought(
  searchResults: BraveSearchResult[],
  contentType: string,
  topic: string
): Promise<ChainOfThoughtResult> {
  try {
    const response = await fetch('/api/process-chain-of-thought', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchResults,
        contentType,
        topic,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to process content');
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing content:', error);
    throw error;
  }
}

export async function aggregateContent(
  query: string,
  contentType: string
): Promise<ChainOfThoughtResult> {
  const searchResults = await searchGovUKContent(query);
  return processWithChainOfThought(searchResults, contentType, query);
} 