'use client';

import { useState } from 'react';
import { ContentType } from '@/types/content';
import { marked } from 'marked';

interface ExportPanelProps {
  content: {
    title: string;
    content: string;
    type: ContentType;
    author?: {
      name: string;
      role: string;
    };
    categories?: string[];
  };
}

export const ExportPanel = ({ content }: ExportPanelProps) => {
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExportJSON = () => {
    try {
      const exportData = {
        title: content.title,
        content: content.content,
        type: content.type,
        author: content.author,
        categories: content.categories,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${content.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportError(null);
    } catch (error) {
      console.error('Error exporting JSON:', error);
      setExportError('Failed to export JSON');
    }
  };

  const handleExportMarkdown = () => {
    try {
      let markdown = `# ${content.title}\n\n`;

      if (content.author) {
        markdown += `*By ${content.author.name}${content.author.role ? ` - ${content.author.role}` : ''}*\n\n`;
      }

      if (content.categories?.length) {
        markdown += `**Categories:** ${content.categories.join(', ')}\n\n`;
      }

      markdown += `${content.content}\n\n`;
      markdown += `---\n*Generated on ${new Date().toLocaleDateString()}*`;

      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${content.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportError(null);
    } catch (error) {
      console.error('Error exporting Markdown:', error);
      setExportError('Failed to export Markdown');
    }
  };

  const handleExportHTML = () => {
    try {
      // Convert markdown content to HTML with proper formatting
      const formattedContent = marked.parse(content.content, {
        gfm: true,
        breaks: true
      });

      let html = `<!DOCTYPE html>
<html lang="en" class="govuk-template">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.title} - GOV.UK</title>
    <style>
        :root {
            --gds-black: #0b0c0c;
            --gds-white: #ffffff;
            --gds-blue: #1d70b8;
            --gds-grey: #505a5f;
            --gds-green: #00703c;
            --gds-light-grey: #f3f2f1;
            --govuk-blue: #1d70b8;
        }
        
        body {
            margin: 0;
            padding: 0;
            background: var(--gds-white);
            font-family: "GDS Transport", arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .govuk-header {
            background-color: #0b0c0c;
            padding: 10px 0;
            border-bottom: 10px solid #1d70b8;
        }

        .govuk-header__container {
            max-width: 960px;
            margin: 0 auto;
            padding: 0 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .govuk-header__logo {
            display: flex;
            align-items: center;
        }

        .govuk-header__link--homepage {
            display: inline-flex;
            align-items: center;
            text-decoration: none;
        }

        .govuk-header__logotype-crown {
            margin-right: 5px;
            fill: currentColor;
            height: 30px;
            width: 36px;
        }

        .govuk-header__logotype-text {
            color: white;
            font-family: "GDS Transport", arial, sans-serif;
            font-weight: 700;
            font-size: 30px;
            line-height: 1;
        }

        .govuk-width-container {
            max-width: 960px;
            margin: 0 auto;
            padding: 30px;
        }

        .app-content {
            padding: 30px 0;
        }

        .app-content__header {
            margin-bottom: 30px;
        }

        .app-content__body {
            font-size: 19px;
            line-height: 1.6;
            color: #0b0c0c;
        }

        .govuk-heading-xl {
            font-family: "GDS Transport", arial, sans-serif;
            font-weight: 700;
            font-size: 36px;
            line-height: 1.1;
            margin-top: 30px;
            margin-bottom: 30px;
        }

        .app-metadata {
            color: #505a5f;
            font-size: 16px;
            margin: 20px 0;
            font-family: "GDS Transport", arial, sans-serif;
        }

        .app-metadata__item {
            margin: 5px 0;
        }

        .app-categories {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin: 20px 0;
        }

        .app-category {
            background: #f3f2f1;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            color: #0b0c0c;
        }

        .app-content__body h1,
        .app-content__body h2,
        .app-content__body h3,
        .app-content__body h4 {
            font-family: "GDS Transport", arial, sans-serif;
            font-weight: 700;
            color: #0b0c0c;
            margin-top: 2em;
            margin-bottom: 1em;
        }

        .app-content__body h1 { font-size: 36px; line-height: 1.1; }
        .app-content__body h2 { font-size: 27px; line-height: 1.2; }
        .app-content__body h3 { font-size: 22px; line-height: 1.3; }
        .app-content__body h4 { font-size: 19px; line-height: 1.4; }

        .app-content__body p {
            margin: 1em 0;
            max-width: 75ch;
        }

        .app-content__body ul,
        .app-content__body ol {
            margin: 1em 0;
            padding-left: 20px;
        }

        .app-content__body li {
            margin: 0.5em 0;
            max-width: 75ch;
        }

        .app-content__body a {
            color: #1d70b8;
            text-decoration: underline;
            text-decoration-thickness: 1px;
            text-underline-offset: 0.1em;
        }

        .app-content__body a:hover {
            color: #003078;
            text-decoration-thickness: 3px;
        }

        .app-content__body blockquote {
            margin: 1em 0;
            padding: 0.5em 0 0.5em 15px;
            border-left: 5px solid #b1b4b6;
            color: #505a5f;
        }

        .app-content__body hr {
            margin: 2em 0;
            border: none;
            border-top: 1px solid #b1b4b6;
        }

        .app-content__body table {
            margin: 1em 0;
            border-collapse: collapse;
            width: 100%;
        }

        .app-content__body th,
        .app-content__body td {
            padding: 10px;
            border: 1px solid #b1b4b6;
            text-align: left;
        }

        .app-content__body th {
            background: #f3f2f1;
            font-weight: 700;
        }

        .app-content__body code {
            font-family: monospace;
            padding: 2px 4px;
            background: #f3f2f1;
            border-radius: 2px;
        }

        .app-content__body pre {
            margin: 1em 0;
            padding: 15px;
            background: #f3f2f1;
            overflow-x: auto;
            border-radius: 4px;
        }

        .app-content__body pre code {
            padding: 0;
            background: none;
        }

        .app-content__body img {
            max-width: 100%;
            height: auto;
            margin: 1em 0;
        }

        .govuk-footer {
            padding: 25px 0;
            border-top: 1px solid #b1b4b6;
            color: #505a5f;
            font-size: 16px;
            line-height: 1.5;
            font-family: "GDS Transport", arial, sans-serif;
        }

        .govuk-footer__container {
            max-width: 960px;
            margin: 0 auto;
            padding: 0 30px;
        }

        .govuk-footer__meta {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .govuk-footer__inline-list {
            margin: 0 0 20px;
            padding: 0;
            list-style: none;
        }

        .govuk-footer__inline-list-item {
            display: inline-block;
            margin-right: 15px;
            margin-bottom: 10px;
        }

        .govuk-footer__link {
            color: #1d70b8;
            text-decoration: underline;
            font-family: "GDS Transport", arial, sans-serif;
        }

        .govuk-footer__licence {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 20px;
        }

        .govuk-footer__copyright {
            display: flex;
            justify-content: flex-end;
            margin-top: 30px;
        }

        @media print {
            .app-content__body {
                font-size: 12pt;
            }
            
            .govuk-header,
            .govuk-footer {
                display: none;
            }

            .app-content__body a {
                text-decoration: none;
            }

            .app-content__body a[href^="http"]:after {
                content: " (" attr(href) ")";
                font-size: 90%;
            }
        }
    </style>
</head>
<body class="govuk-template__body">
    <header class="govuk-header" role="banner">
        <div class="govuk-header__container">
            <div class="govuk-header__logo">
                <a href="https://www.gov.uk" class="govuk-header__link govuk-header__link--homepage">
                    <svg
                        focusable="false"
                        role="img"
                        class="govuk-header__logotype"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 148 30"
                        height="30"
                        width="148"
                        aria-label="GOV.UK"
                        fill="white"
                    >
                        <title>GOV.UK</title>
                        <path d="M22.6 10.4c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m-5.9 6.7c-.9.4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m10.8-3.7c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s0 2-1 2.4m3.3 4.8c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4M17 4.7l2.3 1.2V2.5l-2.3.7-.2-.2.9-3h-3.4l.9 3-.2.2c-.1.1-2.3-.7-2.3-.7v3.4L15 4.7c.1.1.1.2.2.2l-1.3 4c-.1.2-.1.4-.1.6 0 1.1.8 2 1.9 2.2h.7c1-.2 1.9-1.1 1.9-2.1 0-.2 0-.4-.1-.6l-1.3-4c-.1-.2 0-.2.1-.3m-7.6 5.7c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s0 2 1 2.4m-5 3c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s.1 2 1 2.4m-3.2 4.8c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s0 2 1 2.4m14.8 11c4.4 0 8.6.3 12.3.8 1.1-4.5 2.4-7 3.7-8.8l-2.5-.9c.2 1.3.3 1.9 0 2.7-.4-.4-.8-1.1-1.1-2.3l-1.2 4c.7-.5 1.3-.8 2-.9-1.1 2.5-2.6 3.1-3.5 3-1.1-.2-1.7-1.2-1.5-2.1.3-1.2 1.5-1.5 2.1-.1 1.1-2.3-.8-3-2-2.3 1.9-1.9 2.1-3.5.6-5.6-2.1 1.6-2.1 3.2-1.2 5.5-1.2-1.4-3.2-.6-2.5 1.6.9-1.4 2.1-.5 1.9.8-.2 1.1-1.7 2.1-3.5 1.9-2.7-.2-2.9-2.1-2.9-3.6.7-.1 1.9.5 2.9 1.9l.4-4.3c-1.1 1.1-2.1 1.4-3.2 1.4.4-1.2 2.1-3 2.1-3h-5.4s1.7 1.9 2.1 3c-1.1 0-2.1-.2-3.2-1.4l.4 4.3c1-1.4 2.2-2 2.9-1.9-.1 1.5-.2 3.4-2.9 3.6-1.9.2-3.4-.8-3.5-1.9-.2-1.3 1-2.2 1.9-.8.7-2.3-1.2-3-2.5-1.6.9-2.2.9-3.9-1.2-5.5-1.5 2-1.3 3.7.6 5.6-1.2-.7-3.1 0-2 2.3.6-1.4 1.8-1.1 2.1.1.2.9-.3 1.9-1.5 2.1-.9.2-2.4-.5-3.5-3 .6 0 1.2.3 2 .9l-1.2-4c-.3 1.1-.7 1.9-1.1 2.3-.3-.8-.2-1.4 0-2.7l-2.9.9C1.3 23 2.6 25.5 3.7 30c3.7-.5 7.9-.8 12.3-.8"></path>
                    </svg>
                </a>
            </div>
        </div>
    </header>

    <div class="govuk-width-container">
        <main class="app-content" id="main-content" role="main">
            <div class="app-content__header">
                <h1 class="govuk-heading-xl">${content.title}</h1>
                
                <div class="app-metadata">
                    <div class="app-metadata__item">
                        Published: ${new Date().toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric'
                        })}
                    </div>
                    
                    ${content.author ? `
                    <div class="app-metadata__item">
                        By: ${content.author.name}${content.author.role ? ` - ${content.author.role}` : ''}
                    </div>
                    ` : ''}
                </div>

                ${content.categories?.length ? `
                <div class="app-categories">
                    ${content.categories.map(category => `
                    <span class="app-category">${category}</span>
                    `).join('')}
                </div>
                ` : ''}
            </div>

            <div class="app-content__body govuk-body">
                ${formattedContent}
            </div>
        </main>
    </div>

    <footer class="govuk-footer">
        <div class="govuk-footer__container">
            <div class="govuk-footer__meta">
                <ul class="govuk-footer__inline-list">
                    <li class="govuk-footer__inline-list-item">
                        <a class="govuk-footer__link" href="https://www.blog.gov.uk/all-blogs/">
                            All GOV.UK blogs
                        </a>
                    </li>
                    <li class="govuk-footer__inline-list-item">
                        <a class="govuk-footer__link" href="https://www.blog.gov.uk/all-posts/">
                            All GOV.UK blog posts
                        </a>
                    </li>
                    <li class="govuk-footer__inline-list-item">
                        <a class="govuk-footer__link" href="https://www.gov.uk">
                            GOV.UK
                        </a>
                    </li>
                    <li class="govuk-footer__inline-list-item">
                        <a class="govuk-footer__link" href="https://www.gov.uk/government/organisations">
                            All departments
                        </a>
                    </li>
                    <li class="govuk-footer__inline-list-item">
                        <a class="govuk-footer__link" href="https://www.blog.gov.uk/accessibility-statement/">
                            Accessibility statement
                        </a>
                    </li>
                    <li class="govuk-footer__inline-list-item">
                        <a class="govuk-footer__link" href="https://www.blog.gov.uk/cookies/">
                            Cookies
                        </a>
                    </li>
                </ul>

                <div class="govuk-footer__licence">
                    <svg class="govuk-footer__licence-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 483.2 195.7" height="17" width="41">
                        <path fill="currentColor" d="M421.5 142.8V.1l-50.7 32.3v161.1h112.4v-50.7zm-122.3-9.6A47.12 47.12 0 0 1 221 97.8c0-26 21.1-47.1 47.1-47.1 16.7 0 31.4 8.7 39.7 21.8l42.7-27.2A97.63 97.63 0 0 0 268.1 0c-36.5 0-68.3 20.1-85.1 49.7A98 98 0 0 0 97.8 0C43.9 0 0 43.9 0 97.8s43.9 97.8 97.8 97.8c36.5 0 68.3-20.1 85.1-49.7a97.76 97.76 0 0 0 149.6 25.4l19.4 22.2h3v-87.8h-80l24.3 27.5zM97.8 145c-26 0-47.1-21.1-47.1-47.1s21.1-47.1 47.1-47.1 47.2 21 47.2 47S123.8 145 97.8 145"/>
                    </svg>
                    <span class="govuk-footer__licence-description">
                        All content is available under the <a class="govuk-footer__link" href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">Open Government Licence v3.0</a>, except where otherwise stated
                    </span>
                </div>

                <div class="govuk-footer__copyright">
                    <a class="govuk-footer__copyright-logo" href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/">
                        © Crown copyright
                    </a>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>`;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${content.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportError(null);
    } catch (error) {
      console.error('Error exporting HTML:', error);
      setExportError('Failed to export HTML');
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Export Options</h3>
      
      {exportError && (
        <div className="text-red-600 text-sm mb-4" role="alert">
          {exportError}
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleExportJSON}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Export as JSON
        </button>
        <button
          onClick={handleExportMarkdown}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Export as Markdown
        </button>
        <button
          onClick={handleExportHTML}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Export as HTML
        </button>
      </div>
    </div>
  );
}; 