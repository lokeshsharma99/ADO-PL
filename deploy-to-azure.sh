#!/bin/bash

# Content Writer Azure Deployment Script
# This script automates the deployment of the Content Writer application to Azure

echo -e "\e[32mStarting Content Writer deployment to Azure...\e[0m"

# Variables
resourceGroup="content-writer-rg"
location="westeurope"
appServicePlan="content-writer-plan"
webAppName="content-writer-app"
sku="P1v2"
runtime="NODE|18-lts"

# Login to Azure
echo -e "\e[33mLogging in to Azure...\e[0m"
az login

# Create Resource Group if it doesn't exist
echo -e "\e[33mCreating Resource Group if it doesn't exist...\e[0m"
az group create --name $resourceGroup --location $location

# Create App Service Plan if it doesn't exist
echo -e "\e[33mCreating App Service Plan if it doesn't exist...\e[0m"
az appservice plan create --name $appServicePlan --resource-group $resourceGroup --sku $sku --is-linux

# Create Web App if it doesn't exist
echo -e "\e[33mCreating Web App if it doesn't exist...\e[0m"
az webapp create --name $webAppName --resource-group $resourceGroup --plan $appServicePlan --runtime $runtime

# Configure environment variables
echo -e "\e[33mConfiguring environment variables...\e[0m"
az webapp config appsettings set --name $webAppName --resource-group $resourceGroup --settings \
    MISTRAL_API_KEY="your-mistral-api-key" \
    BRAVE_API_KEY="BSAsDd5v_DhzOXMvxDp59Up7gE4F9FU" \
    NODE_ENV="production" \
    PORT="8080" \
    NEXT_PUBLIC_API_URL="https://$webAppName.azurewebsites.net/api" \
    NEXT_PUBLIC_APP_URL="https://$webAppName.azurewebsites.net" \
    NEXTAUTH_URL="https://$webAppName.azurewebsites.net" \
    NEXTAUTH_SECRET="your_production_secret"

# Configure startup command
echo -e "\e[33mConfiguring startup command...\e[0m"
az webapp config set --name $webAppName --resource-group $resourceGroup --startup-file "startup.sh"

# Make startup script executable
echo -e "\e[33mMaking startup script executable...\e[0m"
chmod +x startup.sh

# Build the application
echo -e "\e[33mBuilding the application...\e[0m"
npm run build:azure

# Configure local Git deployment
echo -e "\e[33mConfiguring local Git deployment...\e[0m"
deploymentUrl=$(az webapp deployment source config-local-git --name $webAppName --resource-group $resourceGroup --query url -o tsv)

# Add Azure remote
echo -e "\e[33mAdding Azure remote to Git...\e[0m"
git remote remove azure 2>/dev/null || true
git remote add azure $deploymentUrl

# Push to Azure
echo -e "\e[33mPushing to Azure...\e[0m"
echo -e "\e[36mYou may be prompted for credentials. Use the deployment credentials from the Azure portal.\e[0m"
git push azure main

echo -e "\e[32mDeployment completed!\e[0m"
echo -e "\e[32mYour application should be available at: https://$webAppName.azurewebsites.net\e[0m" 