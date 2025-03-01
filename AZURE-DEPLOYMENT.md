# Azure Deployment Guide

This guide provides instructions for deploying the Next.js Content Writer application to Azure App Service.

## Prerequisites

1. **Azure Account**: You need an active Azure subscription.
2. **Azure CLI**: Install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) on your local machine.
3. **Node.js**: Ensure you have Node.js 18.x or later installed.
4. **GitHub Account**: For GitHub Actions deployment (optional).

## Manual Deployment Steps

### 1. Create Azure Resources

```bash
# Login to Azure
az login

# Create a resource group
az group create --name content-writer-rg --location westeurope

# Create an App Service Plan
az appservice plan create --name content-writer-plan --resource-group content-writer-rg --sku P1v2 --is-linux

# Create a Web App
az webapp create --name content-writer-app --resource-group content-writer-rg --plan content-writer-plan --runtime "NODE|18-lts"
```

### 2. Configure Environment Variables

```bash
# Set environment variables
az webapp config appsettings set --name content-writer-app --resource-group content-writer-rg --settings MISTRAL_API_KEY="your-mistral-api-key" BRAVE_API_KEY="your-brave-api-key" NODE_ENV="production" PORT="8080"
```

### 3. Configure Startup Command

```bash
# Set the startup command to use our startup.sh script
az webapp config set --name content-writer-app --resource-group content-writer-rg --startup-file "startup.sh"

# Make sure the startup script is executable
chmod +x startup.sh
```

### 4. Deploy the Application

```bash
# Build the application
npm run build:azure

# Deploy to Azure
az webapp deployment source config-local-git --name content-writer-app --resource-group content-writer-rg

# Get the deployment URL
git remote add azure <deployment-url>

# Push to Azure
git push azure main
```

## GitHub Actions Deployment

1. In your GitHub repository, go to Settings > Secrets and add the following secrets:
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: The publish profile from your Azure Web App
   - `MISTRAL_API_KEY`: Your Mistral API key
   - `BRAVE_API_KEY`: Your Brave API key

2. Push your code to the main branch, and GitHub Actions will automatically deploy to Azure.

## How the Production Server Works

The application uses the following process to start in production:

1. Azure App Service executes the `startup.sh` script
2. The script runs `npm run serve:prod`
3. The `serve:prod` script runs `next start -p ${PORT:-3000}`
4. Next.js starts the production server on the port provided by Azure (via the `PORT` environment variable)

This ensures that your application listens on the correct port and can handle API requests properly.

## Troubleshooting

- **Application not starting**: Check the logs using `az webapp log tail --name content-writer-app --resource-group content-writer-rg`
- **API routes not working**: Ensure that the `output: 'export'` line is removed from `next.config.js`
- **Environment variables not available**: Verify they are correctly set in the Azure portal
- **Startup command issues**: Check that the startup.sh file is executable and properly configured in Azure

## Additional Resources

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [GitHub Actions for Azure](https://github.com/Azure/actions) 