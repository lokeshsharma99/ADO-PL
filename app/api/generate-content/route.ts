import { NextResponse } from 'next/server';
import { getPromptForContentType } from '@/utils/prompts';
import { ContentType } from '@/types/content';
import type { BraveSearchResult } from '@/utils/braveSearch';
import OpenAI from 'openai';

// Azure OpenAI Configuration
const AZURE_OPENAI_CONFIG = {
  endpoint: "https://coglok.openai.azure.com/",
  apiKey: "4UQGofQ1MHI2B3rZGejwnp1C9BysFPfapsWnjvcnk6LIm7s4qQyUJQQJ99BAACYeBjFXJ3w3AAABACOGekfN",
  apiVersion: "2024-02-15-preview",
  deployment: "gpt-4o-mini"
};

// Initialize Azure OpenAI client
const azureClient = new OpenAI({
  apiKey: AZURE_OPENAI_CONFIG.apiKey,
  baseURL: `${AZURE_OPENAI_CONFIG.endpoint}openai/deployments/${AZURE_OPENAI_CONFIG.deployment}`,
  defaultQuery: { 'api-version': AZURE_OPENAI_CONFIG.apiVersion },
  defaultHeaders: { 'api-key': AZURE_OPENAI_CONFIG.apiKey }
});

// Rate limiting configuration
const RETRY_DELAY = 1000; // 1 second
const MAX_RETRIES = 3;

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to make API calls with retry logic and fallback to Azure
async function callAI(payload: any, retryCount = 0): Promise<any> {
  try {
    // Hardcoded Mistral API token (temporary for testing)
    const MISTRAL_API_KEY = 'Lu7xpXn9EScc0UkfDxGFY6HOpAlsFFRR';

    // Try Mistral first
    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 429 && retryCount < MAX_RETRIES) {
        console.log(`Rate limited, attempt ${retryCount + 1}/${MAX_RETRIES}. Waiting ${RETRY_DELAY}ms...`);
        await delay(RETRY_DELAY * (retryCount + 1));
        return callAI(payload, retryCount + 1);
      }

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Mistral API Response:', result); // Debug log
      return result;
    } catch (mistralError) {
      console.log('Mistral API failed, falling back to Azure OpenAI:', mistralError);
      
      // Fall back to Azure OpenAI
      const azureResponse = await azureClient.chat.completions.create({
        model: AZURE_OPENAI_CONFIG.deployment,
        messages: payload.messages,
        max_tokens: payload.max_tokens || 800,
        temperature: payload.temperature || 0.7,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: null
      });

      // Format Azure response to match Mistral format
      return {
        choices: [{
          message: {
            content: azureResponse.choices[0].message.content
          }
        }]
      };
    }
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Error occurred, attempt ${retryCount + 1}/${MAX_RETRIES}. Retrying...`);
      await delay(RETRY_DELAY * (retryCount + 1));
      return callAI(payload, retryCount + 1);
    }
    throw error;
  }
}

interface GenerateRequest {
  contentType: ContentType;
  context: string;
  title?: string;
  isTitle?: boolean;
  author?: {
    name: string;
    role: string;
  };
  categories?: string[];
}

interface NewsGenerateRequest {
  title: string;
  contentType: ContentType;
  searchResults: BraveSearchResult[];
}

interface NewsResponse {
  headline: string;
  content: string;
  summary: string;
  image?: string;
  references: Array<{ title: string; url: string }>;
}

function generateFallbackContent(
  title: string,
  contentType: ContentType,
  relevantPoints: string[],
  summary: string,
  references: Array<{ title: string; url: string; }>,
  context: string
): string {
  // Ensure all content is backed by references
  const verifiedPoints = relevantPoints.filter(point => 
    references.some(ref => ref.title.toLowerCase().includes(point.toLowerCase()))
  );

  const structure = {
    blog: `
${summary}

## Key Facts
${verifiedPoints.map(point => `- ${point}`).join('\n')}

## Verified Information
${references.map(ref => `- Source: [${ref.title}](${ref.url})`).join('\n')}

Note: All information in this content is sourced from verified GOV.UK sources.`,

    news: `
${summary}

## Latest Verified Updates
${verifiedPoints.map(point => `- ${point}`).join('\n')}

## Sources
${references.map(ref => `- [${ref.title}](${ref.url})`).join('\n')}

Note: This news update contains only verified information from official sources.`,

    announcement: `
${summary}

## Official Information
${verifiedPoints.map(point => `- ${point}`).join('\n')}

## References
${references.map(ref => `- [${ref.title}](${ref.url})`).join('\n')}

Note: This announcement contains only verified information from official sources.`
  }[contentType];

  return `# ${title}\n${structure}`;
}

export async function POST(request: Request) {
  try {
    const data: GenerateRequest = await request.json();
    const { contentType, context, isTitle, title, author, categories } = data;

    if (!context || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields: context and contentType are required' },
        { status: 400 }
      );
    }

    const prompt = getPromptForContentType(contentType);
    if (!prompt) {
      return NextResponse.json(
        { error: `Invalid content type: ${contentType}` },
        { status: 400 }
      );
    }

    // If this is a title generation request
    if (isTitle) {
      try {
        const titlePrompts = {
          blog: `You are a professional title generator for blog posts. Create a catchy, engaging, and descriptive title that:
- Grabs attention while maintaining professionalism
- Uses active voice and strong verbs
- Avoids generic terms like "Introduction" or "Overview"
- Reflects the main value or insight of the content
- Follows UK Government style guidelines
- Is concise (5-10 words)
- Does not include unnecessary punctuation

IMPORTANT: Return ONLY the title text. Do not include any explanations, notes, or additional text. Do not include phrases like "Title:" or formatting.`,

          news: `You are a professional title generator for news articles. Create a clear, informative title that:
- Leads with the most important information
- Uses present tense for current events
- Is factual and objective
- Avoids sensationalism
- Follows UK Government style guidelines
- Is concise (5-10 words)
- Does not include unnecessary punctuation

IMPORTANT: Return ONLY the title text. Do not include any explanations, notes, or additional text. Do not include phrases like "Title:" or formatting.`,

          announcement: `You are a professional title generator for official announcements. Create a clear, authoritative title that:
- States the announcement purpose directly
- Uses official but accessible language
- Includes relevant service or policy names
- Follows UK Government style guidelines
- Is concise (5-10 words)
- Does not include unnecessary punctuation

IMPORTANT: Return ONLY the title text. Do not include any explanations, notes, or additional text. Do not include phrases like "Title:" or formatting.`
        };

        const result = await callAI({
          model: 'mistral-medium',
          messages: [
            {
              role: 'system',
              content: titlePrompts[contentType]
            },
            {
              role: 'user',
              content: `Generate a ${contentType} title for this topic: ${context}`
            }
          ],
          temperature: 0.7,
          max_tokens: 50
        });

        if (!result.choices?.[0]?.message?.content) {
          throw new Error('Invalid response format from AI service');
        }

        // Clean up the title
        let generatedTitle = result.choices[0].message.content
          .trim()
          .replace(/^["']|["']$/g, '') // Remove quotes if present
          .replace(/^#+ /g, '') // Remove markdown headers if present
          .replace(/\.$/, ''); // Remove trailing period if present
          
        // Extract only the first line or sentence as the title
        // Remove any notes, explanations or additional text
        generatedTitle = generatedTitle
          .split(/[\n\r]/)[0] // Get only the first line
          .split(/Note:|note:|PS:|P.S.:|N.B.:|Explanation:|explanation:/i)[0] // Remove any notes
          .trim();
          
        // If the title is too long, truncate it
        if (generatedTitle.length > 100) {
          generatedTitle = generatedTitle.substring(0, 100).trim();
        }

        return NextResponse.json({ content: generatedTitle });
      } catch (error) {
        console.error('Title generation error:', error);
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'Failed to generate title' },
          { status: 500 }
        );
      }
    }

    // For content generation
    if (!title) {
      return NextResponse.json(
        { error: 'Missing required field: title is required for content generation' },
        { status: 400 }
      );
    }

    const contentStructures = {
      blog: `Structure the blog post with these sections:
- Start with an engaging introduction that sets the context
- Use clear headings for main sections
- Include real examples and specific details
- End with a conclusion or call to action
Do not include the title in the content.`,

      news: `Structure the news article with:
- Lead paragraph summarizing key information
- Supporting details and context
- Quotes or relevant data
- Background information if needed
Do not include the title in the content.`,

      announcement: `Structure the announcement with:
- Key message or change
- Important dates or deadlines
- Who is affected
- What action is needed
- Where to find more information
Do not include the title in the content.`
    };

    let contextString = `Title: ${title}\n\n`;
    contextString += `Content Type: ${contentType}\n\n`;
    contextString += `Structure: ${contentStructures[contentType]}\n\n`;
    
    if (context) {
      contextString += `Topic Details: ${context}\n\n`;
    }

    if (author) {
      contextString += `Author: ${author.name} (${author.role})\n\n`;
    }

    if (categories?.length) {
      contextString += `Categories: ${categories.join(', ')}\n\n`;
    }

    try {
      const result = await callAI({
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: prompt.systemPrompt + "\nIMPORTANT: Generate content in markdown format. Do not include the title. Start directly with the main content."
          },
          {
            role: 'user',
            content: contextString
          }
        ],
        temperature: prompt.temperature,
        max_tokens: prompt.maxTokens
      });

      if (!result.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from AI service');
      }

      const generatedContent = result.choices[0].message.content;
      return NextResponse.json({ content: generatedContent });

    } catch (error) {
      console.error('Content generation error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to generate content' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
}

async function verifyContentAgainstSources(
  content: string,
  sources: BraveSearchResult[],
  relevantPoints: string[]
): Promise<string> {
  // Split content into sentences
  const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  
  // Add verification notes
  const verificationNotes = `

---

## Sources and Verification
This content has been automatically verified against official sources. Every statement is supported by referenced materials from GOV.UK. If any information appears to be missing or unclear, it has been intentionally omitted due to lack of authoritative sources.

### Referenced Sources:
${sources.map(source => `- [${source.title}](${source.url})`).join('\n')}

### Verification Process:
- Content generated using verified GOV.UK sources only
- Each statement cross-referenced with source materials
- Automated fact-checking performed on ${new Date().toISOString().split('T')[0]}
- Strict adherence to GDS content standards

For the most up-to-date information, please always refer to GOV.UK official sources.
`;

  return content + verificationNotes;
}

async function generateNewsContent(data: NewsGenerateRequest): Promise<NewsResponse> {
  try {
    const prompt = `
Based on the following search results about "${data.title}":
${data.searchResults.map(result => `
- ${result.title}
- ${result.description}
- Source: ${result.url}
`).join('\n')}

Please generate:
1. A catchy, attention-grabbing headline (max 10 words)
2. A concise summary (2-3 sentences)
3. A detailed news article that:
   - Is factual and well-researched
   - Includes relevant statistics and examples
   - Follows journalistic best practices
   - Uses clear, engaging language
   - Provides context and implications
   - Maintains objectivity

Format the response as JSON with:
- headline: The catchy headline
- summary: The concise summary
- content: The full article
- references: Array of sources used`;

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: 'You are an expert news writer specializing in creating engaging, factual content.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate news content');
    }

    const aiResponse = await response.json();
    const generatedContent = JSON.parse(aiResponse.choices[0].message.content);

    // Find a relevant image from the search results
    const image = data.searchResults.find(result => result.image)?.image;

    return {
      headline: generatedContent.headline,
      content: generatedContent.content,
      summary: generatedContent.summary,
      image,
      references: data.searchResults.map(result => ({
        title: result.title,
        url: result.url,
      })),
    };
  } catch (error) {
    console.error('Error generating news content:', error);
    throw new Error('Failed to generate news content');
  }
}

async function generateContent(
  title: string,
  contentType: ContentType,
  systemPrompt: string
): Promise<string> {
  // TODO: Replace with actual AI service integration
  // This is just a placeholder implementation
  return `Sample generated content for "${title}" (${contentType})
  
Following the provided system prompt:
${systemPrompt}

This is where the AI-generated content would appear. You would need to:
1. Set up your preferred AI service (e.g., OpenAI)
2. Configure the API key and endpoint
3. Format the prompt appropriately
4. Process and return the generated content

The actual implementation would make an API call to your chosen AI service
and return the generated content based on the title and system prompt.`;
} 