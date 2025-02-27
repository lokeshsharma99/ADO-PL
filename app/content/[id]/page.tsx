import { Metadata } from 'next';
import { BlobServiceClient } from '@azure/storage-blob';

// This generates the static paths at build time
export async function generateStaticParams() {
  try {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_STORAGE_CONTAINER || '$web';

    if (!connectionString) {
      return [{ id: 'demo' }]; // Fallback for development
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobs = containerClient.listBlobsFlat({ prefix: 'content/' });
    const paths = [];

    for await (const blob of blobs) {
      const id = blob.name.replace('content/', '').replace('.json', '');
      paths.push({ id });
    }

    return paths;
  } catch (error) {
    console.error('Error generating static paths:', error);
    return [{ id: 'demo' }];
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Content - ${params.id}`,
  };
}

export default function ContentPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Content: {params.id}</h1>
      {/* Add your content display component here */}
    </div>
  );
} 