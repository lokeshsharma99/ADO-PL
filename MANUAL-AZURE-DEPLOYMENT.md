# Manual Azure Deployment Guide for Content Writer

This guide provides step-by-step instructions for manually deploying the Content Writer application to Azure App Service using the Azure Portal.

## Prerequisites

1. **Azure Account**: You need an active Azure subscription.
2. **GitHub Account**: For setting up continuous deployment (optional).
3. **Application Code**: Make sure your application code is ready for deployment.

## Step 1: Prepare Your Application

Before deploying, make sure your application is properly configured for Azure:

1. Ensure `next.config.js` is properly configured (no `output: 'export'` setting).
2. Make sure `startup.sh` is present and contains:
   ```bash
   #!/bin/bash
   npm run serve:prod
   ```
3. Verify that `package.json` has the correct scripts:
   ```json
   "scripts": {
     "build:azure": "npm run clean && next build",
     "serve:prod": "next start -p ${PORT:-3000}"
   }
   ```

## Step 2: Create Azure Resources

1. **Log in to the Azure Portal**:
   - Go to [https://portal.azure.com](https://portal.azure.com)
   - Sign in with your Azure account

2. **Create a Resource Group**:
   - Click on "Resource groups" in the left menu
   - Click "Create"
   - Enter "content-writer-rg" as the name
   - Select "West Europe" as the region
   - Click "Review + create", then "Create"

3. **Create an App Service Plan**:
   - Search for "App Service Plan" in the search bar
   - Click "Create"
   - Select "content-writer-rg" as the resource group
   - Enter "content-writer-plan" as the name
   - Select "Linux" as the operating system
   - Select "West Europe" as the region
   - Select "Premium V2" as the pricing tier (P1v2)
   - Click "Review + create", then "Create"

4. **Create a Web App**:
   - Search for "Web App" in the search bar
   - Click "Create"
   - Select "content-writer-rg" as the resource group
   - Enter "content-writer-app" as the name
   - Select "Linux" as the operating system
   - Select "Node 18 LTS" as the runtime stack
   - Select "content-writer-plan" as the App Service Plan
   - Click "Review + create", then "Create"

## Step 3: Configure Application Settings

1. **Navigate to Your Web App**:
   - Go to the "content-writer-app" web app you just created

2. **Configure Environment Variables**:
   - Click on "Configuration" in the left menu
   - Click "New application setting" for each of the following:
     - MISTRAL_API_KEY: your-mistral-api-key
     - BRAVE_API_KEY: BSAsDd5v_DhzOXMvxDp59Up7gE4F9FU
     - NODE_ENV: production
     - PORT: 8080
     - NEXT_PUBLIC_API_URL: https://content-writer-app.azurewebsites.net/api
     - NEXT_PUBLIC_APP_URL: https://content-writer-app.azurewebsites.net
     - NEXTAUTH_URL: https://content-writer-app.azurewebsites.net
     - NEXTAUTH_SECRET: your_production_secret
   - Click "Save" at the top

3. **Configure Startup Command**:
   - Still in the "Configuration" section, click on the "General settings" tab
   - Scroll down to "Startup Command"
   - Enter "/home/site/wwwroot/startup.sh"
   - Click "Save" at the top

## Step 4: Deploy Your Application

### Option 1: Deploy from GitHub

1. **Navigate to Deployment Center**:
   - Click on "Deployment Center" in the left menu
   - Select "GitHub" as the source
   - Follow the prompts to connect to your GitHub account
   - Select your repository and branch
   - Click "Save"

2. **Set Up GitHub Actions**:
   - Azure will automatically create a GitHub Actions workflow file
   - Make sure it includes the necessary steps for building and deploying your Next.js app

### Option 2: Deploy from Local Git

1. **Navigate to Deployment Center**:
   - Click on "Deployment Center" in the left menu
   - Select "Local Git" as the source
   - Click "Save"

2. **Get Deployment Credentials**:
   - Note the Git Clone URI provided
   - Click on "Deployment Credentials" to set up a username and password

3. **Push Your Code**:
   - Add the Azure remote to your local Git repository:
     ```bash
     git remote add azure <Git-Clone-URI>
     ```
   - Push your code to Azure:
     ```bash
     git push azure main
     ```

### Option 3: Deploy from ZIP File

1. **Build Your Application Locally**:
   ```bash
   npm run build:azure
   ```

2. **Create a ZIP File**:
   - Zip the entire project directory, including node_modules

3. **Deploy the ZIP File**:
   - In the Azure Portal, navigate to your web app
   - Click on "Deployment Center" in the left menu
   - Select "External" as the source
   - Click on "Open in classic experience"
   - Select "ZIP Deploy"
   - Upload your ZIP file

## Step 5: Verify Deployment

1. **Check Deployment Status**:
   - In the Azure Portal, navigate to your web app
   - Click on "Deployment Center" to see the deployment status

2. **Browse to Your Application**:
   - Click on "Browse" at the top of the web app overview page
   - Your application should open in a new tab with the URL:
     https://content-writer-app.azurewebsites.net

3. **Check Application Logs**:
   - If your application is not working, click on "Log stream" in the left menu
   - Check for any errors in the logs

## Troubleshooting

1. **Application Not Starting**:
   - Check the startup command is correct
   - Verify all environment variables are set
   - Check the application logs for errors

2. **API Routes Not Working**:
   - Ensure `next.config.js` does not have `output: 'export'`
   - Verify the application is built with `npm run build:azure`

3. **Deployment Failing**:
   - Check the deployment logs for errors
   - Verify your GitHub Actions workflow is correct
   - Try deploying using a different method

## Additional Resources

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [GitHub Actions for Azure](https://github.com/Azure/actions) 