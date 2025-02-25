const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

// Azure Storage configuration
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || '$web'; // $web is the special container name for static websites

async function uploadToAzure() {
  if (!connectionString) {
    console.error('Error: AZURE_STORAGE_CONNECTION_STRING environment variable is required');
    process.exit(1);
  }

  try {
    // Create BlobServiceClient
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Ensure the container exists
    await containerClient.createIfNotExists({
      access: 'blob'
    });

    // Function to upload a single file
    async function uploadFile(filePath) {
      const relativePath = path.relative('dist', filePath);
      const blobName = relativePath.replace(/\\/g, '/');
      const contentType = mime.lookup(filePath) || 'application/octet-stream';
      
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      
      console.log(`Uploading: ${blobName}`);
      await blockBlobClient.uploadFile(filePath, {
        blobHTTPHeaders: {
          blobContentType: contentType
        }
      });
    }

    // Function to walk through directory
    async function processDirectory(dirPath) {
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          await processDirectory(fullPath);
        } else {
          await uploadFile(fullPath);
        }
      }
    }

    // Start uploading from dist directory
    await processDirectory('dist');
    
    console.log('Upload completed successfully!');
    
    // Get the website URL
    const account = blobServiceClient.accountName;
    console.log(`Your website is available at: https://${account}.z1.web.core.windows.net/`);
    
  } catch (error) {
    console.error('Error uploading to Azure:', error.message);
    process.exit(1);
  }
}

uploadToAzure().catch(console.error); 