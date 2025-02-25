#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment..."

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t gds-content-writer .

# Stop the existing container if it exists
echo "🛑 Stopping existing container..."
docker stop gds-content-writer || true
docker rm gds-content-writer || true

# Run the new container
echo "🏃 Starting new container..."
docker run -d \
  --name gds-content-writer \
  --restart unless-stopped \
  -p 3001:3001 \
  --env-file .env.production \
  gds-content-writer

echo "✅ Deployment complete!" 