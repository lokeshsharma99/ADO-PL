'use client';

import { useState } from 'react';

interface ResearchInsightsProps {
  relevantPoints: string[];
  summary: string;
  references: Array<{ title: string; url: string }>;
  stage: 'analyzing' | 'synthesizing' | 'generating' | 'complete';
}

export const ResearchInsights = ({
  relevantPoints,
  summary,
  references,
  stage
}: ResearchInsightsProps) => {
  const [activeView, setActiveView] = useState<'timeline' | 'list'>('timeline');

  const renderProgressIndicator = () => (
    <div className="mb-6">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ease-in-out ${
            stage === 'complete' ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ 
            width: stage === 'analyzing' ? '33%' : 
                   stage === 'synthesizing' ? '66%' : 
                   stage === 'generating' ? '90%' : 
                   stage === 'complete' ? '100%' : '0%' 
          }}
        >
          <div className={`
            h-full w-full animate-pulse
            ${stage === 'complete' ? 'hidden' : ''}
          `} />
        </div>
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="space-y-4">
      {relevantPoints.map((point, index) => (
        <div 
          key={index} 
          className={`flex items-start space-x-4 transition-opacity duration-300 ${
            stage === 'analyzing' && index === relevantPoints.length - 1 ? 'animate-pulse' : ''
          }`}
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {index + 1}
          </div>
          <div className="flex-grow">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-700">{point}</p>
            </div>
            {index < relevantPoints.length - 1 && (
              <div className="w-0.5 h-8 bg-blue-200 ml-4" />
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderList = () => (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Summary</h4>
        {summary ? (
          <p className="text-gray-700 mb-6">{summary}</p>
        ) : (
          <div className="h-20 bg-gray-100 rounded animate-pulse mb-6" />
        )}
        
        <h4 className="text-lg font-medium text-gray-900 mb-4">Key Points</h4>
        <ul className="space-y-3">
          {relevantPoints.map((point, index) => (
            <li 
              key={index} 
              className={`flex items-start space-x-3 ${
                stage === 'analyzing' && index === relevantPoints.length - 1 ? 'animate-pulse' : ''
              }`}
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                {index + 1}
              </span>
              <span className="text-gray-700">{point}</span>
            </li>
          ))}
        </ul>

        <h4 className="text-lg font-medium text-gray-900 mt-6 mb-4">References</h4>
        <ul className="space-y-2">
          {references.map((ref, index) => (
            <li key={index}>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500"
              >
                {ref.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderProgressIndicator()}
      
      <div className="flex justify-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
        <button
          onClick={() => setActiveView('timeline')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${activeView === 'timeline'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          Timeline
        </button>
        <button
          onClick={() => setActiveView('list')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${activeView === 'list'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          Detailed List
        </button>
      </div>

      <div className="min-h-[400px]">
        {activeView === 'timeline' && renderTimeline()}
        {activeView === 'list' && renderList()}
      </div>
    </div>
  );
}; 