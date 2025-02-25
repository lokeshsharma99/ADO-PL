import { NextResponse } from 'next/server';

const BRAVE_SEARCH_URL = 'https://api.search.brave.com/res/v1/web/search';
const BRAVE_API_KEY = process.env.BRAVE_API_KEY;

if (!BRAVE_API_KEY) {
  console.warn('BRAVE_API_KEY is not set in environment variables');
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query?.trim()) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    if (!BRAVE_API_KEY) {
      return NextResponse.json(
        { error: 'Brave Search API key is not configured' },
        { status: 500 }
      );
    }

    const searchParams = new URLSearchParams({
      q: `site:gov.uk ${query.trim()}`,
      count: '10',
      format: 'json',
      safesearch: 'moderate',
    });

    console.log('Searching Brave with query:', searchParams.toString());

    const response = await fetch(`${BRAVE_SEARCH_URL}?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Brave Search API error:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        error: errorText
      });

      return NextResponse.json(
        { error: `Failed to fetch from Brave Search: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Brave Search response:', JSON.stringify(data, null, 2));

    if (!data.web?.results) {
      console.warn('No results found in Brave Search response');
      return NextResponse.json({ 
        results: [],
        message: 'No results found for the given query'
      });
    }

    const results = data.web.results.map((result: any) => ({
      title: result.title || 'Untitled',
      description: result.description || 'No description available',
      url: result.url || '',
      image: result.image?.url || null
    }));

    return NextResponse.json({ 
      results,
      total: results.length,
      query: query.trim()
    });

  } catch (error) {
    console.error('Error in Brave Search API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 