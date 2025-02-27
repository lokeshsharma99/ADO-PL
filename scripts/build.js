const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Improved path resolution using __dirname
const BUILD_DIR = path.join(__dirname, '../dist');
const ASSETS_DIR = path.join(BUILD_DIR, 'assets');

// Create directory structure with error handling
const createDirectories = () => {
  const directories = [
    BUILD_DIR,
    path.join(ASSETS_DIR, 'images'),
    path.join(ASSETS_DIR, 'styles'),
    path.join(ASSETS_DIR, 'scripts')
  ];

  try {
    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  } catch (error) {
    console.error('Error creating directories:', error);
    process.exit(1);
  }
};

// Generate index.html content with proper accessibility attributes
const generateIndexHtml = () => `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0b0c0c">
  <title>GOV.UK Service</title>
  <link rel="stylesheet" href="/assets/styles/main.css">
  <link rel="icon" href="/assets/images/favicon.ico" type="image/x-icon">
</head>
<body class="bg-white font-sans">
  <header class="govuk-header" role="banner" data-module="govuk-header">
    <div class="govuk-header__container govuk-width-container">
      <div class="govuk-header__logo">
        <a href="/" class="govuk-header__link--homepage" aria-label="Go to GOV.UK homepage">
          <svg class="govuk-header__logotype-crown" focusable="false" aria-hidden="true">
            <!-- Crown SVG content -->
          </svg>
          <span class="govuk-header__logotype-text">GOV.UK</span>
        </a>
      </div>
    </div>
  </header>
  
  <main id="main-content" class="govuk-width-container" role="main">
    <!-- Main content -->
  </main>

  <footer class="govuk-footer" role="contentinfo">
    <!-- Footer content -->
  </footer>
  
  <script src="/assets/scripts/content-generator.js" defer></script>
</body>
</html>`;

// Main build process with error handling
const runBuild = () => {
  try {
    createDirectories();

    // Generate index.html from template
    fs.writeFileSync(path.join(BUILD_DIR, 'index.html'), generateIndexHtml());

    // Download crown copyright logo with error handling
    try {
      const crownCopyrightUrl = 'https://www.gov.uk/assets/government-frontend/govuk-crest-795cd6b7da4a2efe0ffb973f525d2f2f3c9f2186d08a4dc75f42b6661df32d25.png';
      execSync(`curl ${crownCopyrightUrl} -o ${path.join(ASSETS_DIR, 'images', 'govuk-crest.png')}`);
    } catch (fetchError) {
      console.error('Error fetching crown image:', fetchError);
    }

    console.log('Build completed successfully! Files are ready in the dist directory.');
    console.log('\nAzure Deployment Checklist:');
    console.log('1. Create Storage Account with Static Website hosting enabled');
    console.log('2. Set index.html as default document');
    console.log('3. Upload all files from dist/ to $web container');
    console.log('4. Configure CDN endpoint for custom domain (optional)');
    console.log('5. Set environment variables in Azure Portal:');
    console.log('   - MISTRAL_API_KEY=<your-api-key>');
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
};

runBuild(); 