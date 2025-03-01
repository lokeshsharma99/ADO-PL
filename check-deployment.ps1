# Check if the Content Writer application is accessible
$url = "https://content-writer-app.azurewebsites.net"
Write-Host "Checking if $url is accessible..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $url -Method Head -UseBasicParsing
    Write-Host "Status code: $($response.StatusCode)" -ForegroundColor Green
    
    if ($response.StatusCode -eq 200) {
        Write-Host "The application is accessible!" -ForegroundColor Green
    } else {
        Write-Host "The application returned a non-200 status code." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error accessing the application: $_" -ForegroundColor Red
    Write-Host "The application might not be deployed yet or there might be an issue with the deployment." -ForegroundColor Red
}

Write-Host "`nManual Deployment Instructions:" -ForegroundColor Cyan
Write-Host "1. Log in to the Azure Portal: https://portal.azure.com" -ForegroundColor White
Write-Host "2. Create a new Web App with the following settings:" -ForegroundColor White
Write-Host "   - Name: content-writer-app" -ForegroundColor White
Write-Host "   - Resource Group: content-writer-rg" -ForegroundColor White
Write-Host "   - Runtime stack: Node.js 18 LTS" -ForegroundColor White
Write-Host "   - Operating System: Linux" -ForegroundColor White
Write-Host "   - Region: West Europe" -ForegroundColor White
Write-Host "   - App Service Plan: content-writer-plan (P1v2)" -ForegroundColor White
Write-Host "3. Once created, go to Configuration and add the following Application settings:" -ForegroundColor White
Write-Host "   - MISTRAL_API_KEY: your-mistral-api-key" -ForegroundColor White
Write-Host "   - BRAVE_API_KEY: BSAsDd5v_DhzOXMvxDp59Up7gE4F9FU" -ForegroundColor White
Write-Host "   - NODE_ENV: production" -ForegroundColor White
Write-Host "   - PORT: 8080" -ForegroundColor White
Write-Host "   - NEXT_PUBLIC_API_URL: https://content-writer-app.azurewebsites.net/api" -ForegroundColor White
Write-Host "   - NEXT_PUBLIC_APP_URL: https://content-writer-app.azurewebsites.net" -ForegroundColor White
Write-Host "   - NEXTAUTH_URL: https://content-writer-app.azurewebsites.net" -ForegroundColor White
Write-Host "   - NEXTAUTH_SECRET: your_production_secret" -ForegroundColor White
Write-Host "4. Go to Deployment Center and set up deployment from your GitHub repository" -ForegroundColor White
Write-Host "5. Once deployed, your application should be accessible at: $url" -ForegroundColor White 