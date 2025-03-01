# Prepare ZIP file for Azure deployment
Write-Host "Preparing ZIP file for Azure deployment..." -ForegroundColor Green

# Build the application
Write-Host "Building the application..." -ForegroundColor Yellow
try {
    # Try to clean the .next directory first
    if (Test-Path ".next") {
        Write-Host "Removing existing .next directory..." -ForegroundColor Yellow
        Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    # Run the build command
    npm run build:azure
} catch {
    Write-Host "Warning: Build process encountered issues. Continuing with deployment preparation..." -ForegroundColor Yellow
}

# Create a temporary directory for deployment
$tempDir = "deploy-temp"
Write-Host "Creating temporary directory: $tempDir..." -ForegroundColor Yellow
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}
New-Item -Path $tempDir -ItemType Directory | Out-Null

# Copy necessary files to the temporary directory
Write-Host "Copying files to temporary directory..." -ForegroundColor Yellow
$filesToCopy = @(
    ".next",
    "node_modules",
    "public",
    "package.json",
    "package-lock.json",
    "next.config.js",
    "startup.sh",
    ".env.production"
)

foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        try {
            if (Test-Path -PathType Container $file) {
                Copy-Item -Path $file -Destination "$tempDir/$file" -Recurse -Force -ErrorAction SilentlyContinue
            } else {
                Copy-Item -Path $file -Destination "$tempDir/$file" -Force -ErrorAction SilentlyContinue
            }
            Write-Host "Copied $file successfully" -ForegroundColor Green
        } catch {
            Write-Host "Warning: Could not copy $file completely. Some files may be missing." -ForegroundColor Yellow
        }
    } else {
        Write-Host "Warning: $file not found, skipping..." -ForegroundColor Yellow
    }
}

# Create the ZIP file
$zipFile = "content-writer-deploy.zip"
Write-Host "Creating ZIP file: $zipFile..." -ForegroundColor Yellow
if (Test-Path $zipFile) {
    Remove-Item -Path $zipFile -Force
}

try {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $zipFile)
    Write-Host "ZIP file created successfully: $zipFile" -ForegroundColor Green
} catch {
    Write-Host "Error creating ZIP file: $_" -ForegroundColor Red
    Write-Host "Trying alternative method..." -ForegroundColor Yellow
    
    # Alternative method using Compress-Archive
    Compress-Archive -Path "$tempDir\*" -DestinationPath $zipFile -Force
    Write-Host "ZIP file created using Compress-Archive: $zipFile" -ForegroundColor Green
}

# Clean up
Write-Host "Cleaning up temporary directory..." -ForegroundColor Yellow
Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "ZIP file preparation completed: $zipFile" -ForegroundColor Green
Write-Host "You can now deploy this ZIP file to Azure App Service using the Azure Portal." -ForegroundColor Green
Write-Host "Follow the instructions in MANUAL-AZURE-DEPLOYMENT.md for deployment steps." -ForegroundColor Green 