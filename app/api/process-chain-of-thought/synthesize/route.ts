import { NextResponse } from 'next/server';

interface SynthesizeRequest {
  points: string[];
  contentType: string;
}

export async function POST(request: Request) {
  try {
    const { points, contentType }: SynthesizeRequest = await request.json();

    if (!points || points.length === 0) {
      return NextResponse.json(
        { error: 'No points provided for synthesis' },
        { status: 400 }
      );
    }

    // Create a summary from the points
    const summary = await synthesizePoints(points, contentType);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error synthesizing content:', error);
    return NextResponse.json(
      { error: 'Failed to synthesize content' },
      { status: 500 }
    );
  }
}

async function synthesizePoints(points: string[], contentType: string): Promise<string> {
  // For now, we'll use a simple approach to create a summary
  // In production, you might want to use an AI model for better synthesis
  
  // Get the main themes from the points
  const themes = points.slice(0, 3).map(point => {
    // Extract the main idea from each point
    const words = point.split(' ');
    return words.slice(0, 5).join(' ') + '...';
  });

  // Create a summary based on the content type
  switch (contentType) {
    case 'blog':
      return `This blog post explores ${themes.join(', ')} and related topics. Based on research from gov.uk sources, we'll examine the key aspects and their implications.`;
    
    case 'news':
      return `Recent developments include ${themes.join(', ')}. This article provides updates and analysis based on official gov.uk sources.`;
    
    case 'announcement':
      return `Important update regarding ${themes.join(', ')}. This announcement outlines key changes and next steps based on official guidance.`;
    
    default:
      return `Key findings include ${themes.join(', ')}. This content synthesizes information from authoritative gov.uk sources.`;
  }
} 