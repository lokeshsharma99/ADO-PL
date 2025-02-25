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

export async function searchGovUKContent(query: string): Promise<BraveSearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch('/api/brave-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: query.trim() 
      }),
    });

    if (!response.ok) {
      console.warn('Brave Search API error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      console.warn('Invalid response format from Brave Search');
      return [];
    }

    return data.results.map((result: BraveSearchApiResult) => ({
      title: result.title || 'Untitled',
      description: result.description || 'No description available',
      url: result.url || '',
      image: result.image?.url
    }));

  } catch (error) {
    console.warn('Error searching Brave:', error);
    return [];
  }
}

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