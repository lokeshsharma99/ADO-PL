import { NextResponse } from 'next/server';
import { BraveSearchResult } from '@/utils/braveSearch';

interface AnalyzeRequest {
  searchResults: BraveSearchResult[];
  contentType: string;
  topic: string;
  context?: string;
}

export async function POST(request: Request) {
  const { searchResults, contentType, topic, context } = await request.json();

  const encoder = new TextEncoder();
  
  return new Response(new ReadableStream({
    async start(controller) {
      try {
        await processSearchResults(searchResults, controller, encoder, topic, context);
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
    cancel() {
      // Handle cancellation
    }
  }));
}

async function processSearchResults(
  searchResults: BraveSearchResult[],
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  topic: string,
  context?: string
) {
  for (const result of searchResults) {
    const point = await extractKeyPoint(result, topic, context);
    if (point) {
      const data = encoder.encode(
        JSON.stringify({ point }) + '\n'
      );
      controller.enqueue(data);
    }
  }
}

async function extractKeyPoint(
  result: BraveSearchResult, 
  topic: string,
  context?: string
): Promise<string> {
  // Include context in the analysis if provided
  const analysisPrompt = `
    Analyze this content about "${topic}"
    ${context ? `\nAdditional context: ${context}` : ''}
    \nContent: ${result.description}
    \nExtract a key point that is most relevant to the topic and context.
  `;

  // This is a simplified version - in production, you'd want to use
  // more sophisticated NLP techniques or AI to extract meaningful points
  const sentences = result.description.split(/[.!?]+/).filter(Boolean);
  return sentences[0].trim();
} 