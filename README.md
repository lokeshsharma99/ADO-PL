# GDS Content Management System

A modern content management system built for the UK Government Digital Service (GDS), featuring AI-assisted content generation, research integration, and export capabilities.

## Features

### Content Creation
- **AI-Assisted Writing**: Generate content with AI while maintaining GDS standards
- **Research Integration**: Automatically research and incorporate information from gov.uk
- **Multiple Content Types**: Support for blogs, news articles, and announcements
- **Smart Visualizations**: View research insights in timeline and list formats

### Content Management
- **Rich Text Editing**: Full markdown support with live preview
- **Image Management**: Upload and manage images with banner support
- **Category Management**: Organize content with custom categories
- **Author Attribution**: Track content creators and their roles

### Export Options
- **Multiple Formats**: Export content as PDF, HTML, or Markdown
- **GDS Styling**: Maintains GOV.UK design system standards in exports
- **Crown Copyright**: Proper attribution and licensing included
- **Responsive Design**: Exports work well on all devices

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd [project-directory]
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with:
```env
MISTRAL_API_KEY=your_mistral_api_key
BRAVE_API_KEY=your_brave_api_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### Creating Content

1. Select content type (blog, news, or announcement)
2. Enter a title and author information
3. Click "Generate Content" to:
   - Research relevant information from gov.uk
   - Generate AI-assisted content
   - View research insights
4. Edit the generated content as needed
5. Add images and categories
6. Preview the content
7. Export in your preferred format

### Adding Images

- Upload images through the image uploader
- Name images with section names for automatic placement:
  - `main-banner.jpg` for the main banner
  - `section-name-banner.jpg` for section banners
  - `section-name.jpg` for inline images

### Exporting Content

1. Click the "Export Content" button
2. Choose your preferred format:
   - PDF: Professional document format
   - HTML: Web-ready format
   - Markdown: Plain text format
3. Download and use the exported file

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: TailwindCSS
- **AI Integration**: Mistral AI
- **Search**: Brave Search API
- **PDF Generation**: html-pdf-node
- **Image Handling**: Next.js Image Optimization

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   └── page.tsx         # Main page
├── components/          # React components
│   ├── content/        # Content-related components
│   ├── ui/            # UI components
│   └── visualizations/ # Data visualization components
├── public/             # Static assets
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the terms of the Open Government Licence v3.0.

## Crown Copyright

© Crown copyright 2024 