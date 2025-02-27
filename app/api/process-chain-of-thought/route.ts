import { NextResponse } from 'next/server';
import type { BraveSearchResult } from '@/utils/braveSearch';

interface ChainOfThoughtRequest {
  searchResults: BraveSearchResult[];
  contentType: string;
  topic: string;
}

export async function POST(request: Request) {
  try {
    const { searchResults, contentType, topic }: ChainOfThoughtRequest = await request.json();

    // Step 1: Analyze and extract relevant information
    const relevantPoints = await analyzeSearchResults(searchResults);

    // Step 2: Synthesize information
    const summary = await synthesizeInformation(relevantPoints, contentType);

    // Step 3: Generate suggested content
    const suggestedContent = await generateContent(summary, contentType, topic);

    return NextResponse.json({
      relevantPoints,
      summary,
      suggestedContent,
      references: searchResults.map(result => ({
        title: result.title,
        url: result.url,
      })),
    });
  } catch (error) {
    console.error('Error in chain of thought processing:', error);
    return NextResponse.json(
      { error: 'Failed to process content' },
      { status: 500 }
    );
  }
}

async function analyzeSearchResults(searchResults: BraveSearchResult[]): Promise<string[]> {
  if (searchResults.length === 0) {
    return [];
  }

  try {
    // Hardcoded Mistral API token (temporary for testing)
    const MISTRAL_API_KEY = 'Lu7xpXn9EScc0UkfDxGFY6HOpAlsFFRR';

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at analyzing and extracting key points from search results.',
          },
          {
            role: 'user',
            content: `Analyze these search results and extract the most relevant points:\n${searchResults.map(r => `${r.title}\n${r.description}\n${r.url}\n`).join('\n')}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API error:', errorData);
      throw new Error('Failed to analyze search results');
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from Mistral API');
    }

    return data.choices[0].message.content
      .split('\n')
      .filter((line: string) => Boolean(line))
      .map((point: string) => point.trim());
  } catch (error) {
    console.error('Error analyzing search results:', error);
    return [];
  }
}

async function synthesizeInformation(points: string[], contentType: string): Promise<string> {
  if (points.length === 0) {
    return 'No relevant information found.';
  }

  try {
    // Hardcoded Mistral API token (temporary for testing)
    const MISTRAL_API_KEY = 'Lu7xpXn9EScc0UkfDxGFY6HOpAlsFFRR';

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at synthesizing information into coherent summaries.',
          },
          {
            role: 'user',
            content: `Synthesize these key points into a coherent summary suitable for a ${contentType}:\n${points.join('\n')}`,
          },
        ],
        temperature: 0.4,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API error:', errorData);
      throw new Error('Failed to synthesize information');
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from Mistral API');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error synthesizing information:', error);
    return 'Failed to synthesize information.';
  }
}

async function generateContent(
  summary: string,
  contentType: string,
  topic: string
): Promise<string> {
  // Hardcoded Mistral API token (temporary for testing)
  const MISTRAL_API_KEY = 'Lu7xpXn9EScc0UkfDxGFY6HOpAlsFFRR';

  const formatGuidance = {
    blog: 'a detailed blog post with clear sections, examples, and practical insights',
    news: 'a news article following the inverted pyramid style, with key information first',
    announcement: 'a clear, concise announcement with key points and next steps',
  }[contentType];

  const prompt = `Based on this summary about ${topic}:
${summary}

Create ${formatGuidance}. The content should:
1. Follow GOV.UK style guidelines
2. Be clear and accessible
3. Include relevant facts and figures
4. Provide practical information
5. End with clear next steps or calls to action

The tone should be professional but approachable, and the content should be structured for easy reading.`;

  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    console.error('Mistral API Error:', await response.text());
    throw new Error('Failed to generate content');
  }

  const data = await response.json();
  console.log('Mistral API Response:', data); // Debug log
  return data.choices[0].message.content.trim();
} 