'use client';

import { useState } from 'react';
import { ContentType } from '@/types/content';

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
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const handleExport = async (format: 'pdf' | 'html' | 'markdown') => {
    try {
      setExportStatus('exporting');
      const response = await fetch('/api/export-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format,
          content: {
            ...content,
            type: content.type,
            createdAt: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export content');
      }

      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `${content.title}.${format}`;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setExportStatus('success');
      setTimeout(() => {
        setExportStatus(null);
        setShowExportOptions(false);
      }, 2000);
    } catch (error) {
      console.error('Error exporting content:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  const exportOptions = [
    {
      format: 'pdf' as const,
      label: 'PDF Document',
      description: 'Best for printing and sharing',
      icon: (
        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      format: 'html' as const,
      label: 'HTML File',
      description: 'Web-ready format with styling',
      icon: (
        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      format: 'markdown' as const,
      label: 'Markdown',
      description: 'Plain text with formatting',
      icon: (
        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Export Content</h3>
            <p className="mt-1 text-sm text-gray-500">
              Download your content in various formats
            </p>
          </div>
          <button
            onClick={() => setShowExportOptions(!showExportOptions)}
            disabled={exportStatus === 'exporting'}
            className={`
              inline-flex items-center px-4 py-2 rounded-md text-sm font-medium
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${exportStatus === 'exporting'
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
            aria-label="Export content options"
          >
            {exportStatus === 'exporting' ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </span>
            ) : 'Export Content'}
          </button>
        </div>

        {showExportOptions && !exportStatus && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {exportOptions.map(({ format, label, description, icon }) => (
              <button
                key={format}
                onClick={() => handleExport(format)}
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col items-center space-y-3 hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex-shrink-0">
                  {icon}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {exportStatus === 'success' && (
        <div className="p-4 bg-green-50 border-t border-green-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Content exported successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {exportStatus === 'error' && (
        <div className="p-4 bg-red-50 border-t border-red-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                Failed to export content. Please try again.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 