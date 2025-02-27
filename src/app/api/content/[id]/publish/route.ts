export const dynamic = 'force-static';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return new Response(JSON.stringify({ error: 'Not available in static export' }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 