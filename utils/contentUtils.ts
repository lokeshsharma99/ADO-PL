import { BlobServiceClient } from '@azure/storage-blob';

export interface ContentPublishOptions {
  id: string;
  content: string;
  metadata?: Record<string, string>;
}

export const publishContent = async ({ id, content, metadata = {} }: ContentPublishOptions) => {
  try {
    // If using Azure Storage static website
    const connectionString = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONTAINER || '$web';

    if (!connectionString) {
      throw new Error('Azure Storage connection string is not configured');
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(`content/${id}.json`);

    const data = JSON.stringify({
      id,
      content,
      metadata,
      publishedAt: new Date().toISOString(),
    });

    await blobClient.upload(data, data.length, {
      blobHTTPHeaders: {
        blobContentType: 'application/json',
      },
      metadata,
    });

    return {
      success: true,
      url: blobClient.url,
      publishedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error publishing content:', error);
    throw error;
  }
}; 