'use client';

import { useState } from 'react';
import {PublishAction } from '@/types/content';

interface PublishWorkflowProps {
  onStatusChange: (action: PublishAction) => void;
  reviewComments?: string;
  reviewedBy?: string;
  publishedAt?: Date;
  content: {
    title: string;
    content: string;
    author?: {
      name: string;
      role: string;
    };
    categories?: string[];
  };
}

type PublishStatus = 'draft' | 'in_review' | 'published';

const badges: Record<PublishStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  in_review: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800'
};

export const PublishWorkflow = ({
  onStatusChange,
  reviewComments,
  reviewedBy,
  publishedAt,
  content,
}: PublishWorkflowProps) => {
  const [status, setStatus] = useState<PublishStatus>('draft');
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const handleAction = (actionType: PublishAction['type']) => {
    onStatusChange({
      type: actionType,
      comment: comment.trim() || undefined,
      reviewedBy: actionType === 'approve' ? 'Current User' : undefined,
    });
    setComment('');
    setShowCommentBox(false);
  };

  const handleExport = async (format: 'pdf' | 'html' | 'markdown') => {
    try {
      const response = await fetch('/api/export-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format,
          content: {
            ...content,
            publishedAt,
            reviewedBy,
            reviewComments,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to export content');
      }

      // For PDF, we need to handle blob response
      if (format === 'pdf') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${content.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        // Create a blob from the content
        const blob = new Blob([data.content], { 
          type: format === 'html' ? 'text/html' : 'text/markdown' 
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${content.title}.${format === 'html' ? 'html' : 'md'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting content:', error);
      // Handle error (you might want to show this in the UI)
    }
  };

  const renderStatusBadge = () => {
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badges[status]}`}>
        {status === 'in_review' ? 'In Review' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderExportOptions = () => (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-1" role="menu" aria-orientation="vertical">
        <button
          onClick={() => handleExport('pdf')}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          Export as PDF
        </button>
        <button
          onClick={() => handleExport('html')}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          Export as HTML
        </button>
        <button
          onClick={() => handleExport('markdown')}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          Export as Markdown
        </button>
      </div>
    </div>
  );

  const renderActionButtons = () => {
    const buttons = [];

    // Export button always available for published content
    if (status === 'published') {
      buttons.push(
        <div key="export" className="relative">
          <button
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Export
          </button>
          {showExportOptions && renderExportOptions()}
        </div>
      );

      buttons.push(
        <button
          key="unpublish"
          onClick={() => handleAction('unpublish')}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Unpublish
        </button>
      );
    }

    // Review actions
    switch (status) {
      case 'draft':
        buttons.unshift(
          <button
            key="review"
            onClick={() => setShowCommentBox(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit for Review
          </button>
        );
        break;
      case 'in_review':
        buttons.unshift(
          <div key="review-actions" className="flex space-x-4">
            <button
              onClick={() => setShowCommentBox(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Approve
            </button>
            <button
              onClick={() => setShowCommentBox(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Reject
            </button>
          </div>
        );
        break;
    }

    return <div className="flex space-x-4">{buttons}</div>;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-gray-900">Publishing Status</h3>
          <div className="flex items-center space-x-3">
            {renderStatusBadge()}
            {publishedAt && (
              <span className="text-sm text-gray-500">
                Published on {publishedAt.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        {renderActionButtons()}
      </div>

      {showCommentBox && (
        <div className="space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Add a comment..."
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowCommentBox(false)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (status === 'draft') {
                  handleAction('submit_for_review');
                } else if (status === 'in_review') {
                  handleAction(comment.toLowerCase().includes('reject') ? 'reject' : 'approve');
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {(reviewComments || reviewedBy) && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-900">Review Information</h4>
          {reviewedBy && (
            <p className="text-sm text-gray-600">Reviewed by: {reviewedBy}</p>
          )}
          {reviewComments && (
            <p className="text-sm text-gray-600 mt-1">Comments: {reviewComments}</p>
          )}
        </div>
      )}
    </div>
  );
}; 