# Content Writer Azure Deployment Script
# This script automates the deployment of the Content Writer application to Azure

Write-Host "Starting Content Writer deployment to Azure..." -ForegroundColor Green

# Variables
$resourceGroup = "content-writer-rg"
$location = "westeurope"
$appServicePlan = "content-writer-plan"
$webAppName = "content-writer-app"
$sku = "P1v2"
$runtime = "NODE:18-lts"

# Login to Azure
Write-Host "Logging in to Azure..." -ForegroundColor Yellow
az login

# Create Resource Group if it doesn't exist
Write-Host "Creating Resource Group if it doesn't exist..." -ForegroundColor Yellow
az group create --name $resourceGroup --location $location

# Create App Service Plan if it doesn't exist
Write-Host "Creating App Service Plan if it doesn't exist..." -ForegroundColor Yellow
az appservice plan create --name $appServicePlan --resource-group $resourceGroup --sku $sku --is-linux

# Create Web App if it doesn't exist
Write-Host "Creating Web App if it doesn't exist..." -ForegroundColor Yellow
az webapp create --name $webAppName --resource-group $resourceGroup --plan $appServicePlan --runtime "$runtime"

# Configure environment variables
Write-Host "Configuring environment variables..." -ForegroundColor Yellow
az webapp config appsettings set --name $webAppName --resource-group $resourceGroup --settings `
    MISTRAL_API_KEY="your-mistral-api-key" `
    BRAVE_API_KEY="BSAsDd5v_DhzOXMvxDp59Up7gE4F9FU" `
    NODE_ENV="production" `
    PORT="8080" `
    NEXT_PUBLIC_API_URL="https://$webAppName.azurewebsites.net/api" `
    NEXT_PUBLIC_APP_URL="https://$webAppName.azurewebsites.net" `
    NEXTAUTH_URL="https://$webAppName.azurewebsites.net" `
    NEXTAUTH_SECRET="your_production_secret"

# Configure startup command
Write-Host "Configuring startup command..." -ForegroundColor Yellow
az webapp config set --name $webAppName --resource-group $resourceGroup --startup-file "startup.sh"

# Fix for Windows - can't use chmod
Write-Host "Making startup script executable..." -ForegroundColor Yellow
# Windows doesn't need chmod, Azure will handle this

# Build the application
Write-Host "Building the application..." -ForegroundColor Yellow
npm run build:azure

# Configure local Git deployment
Write-Host "Configuring local Git deployment..." -ForegroundColor Yellow
$deploymentUrl = az webapp deployment source config-local-git --name $webAppName --resource-group $resourceGroup --query url -o tsv

# Add Azure remote
Write-Host "Adding Azure remote to Git..." -ForegroundColor Yellow
git remote remove azure 2>$null
git remote add azure $deploymentUrl

# Push to Azure
Write-Host "Pushing to Azure..." -ForegroundColor Yellow
Write-Host "You may be prompted for credentials. Use the deployment credentials from the Azure portal." -ForegroundColor Cyan
git push azure main

Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "Your application should be available at: https://$webAppName.azurewebsites.net" -ForegroundColor Green 