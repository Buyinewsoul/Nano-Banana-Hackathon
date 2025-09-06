
import React from 'react';
import { Loader } from './Loader';
import { WandIcon, ResetIcon } from './icons';

interface PromptControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
  isImageLoaded: boolean;
}

const templates = [
    'Add a pirate hat',
    'Change background to a futuristic city',
    'Make it an oil painting',
    'Add a small, cute robot',
    'Change season to winter, add snow',
];

export const PromptControls: React.FC<PromptControlsProps> = ({
  prompt,
  setPrompt,
  onSubmit,
  onReset,
  isLoading,
  isImageLoaded,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && prompt.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
          Your prompt
        </label>
        <div className="relative">
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., add a pirate hat on the cat"
            className="w-full p-3 pr-4 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-white placeholder-gray-400 resize-none"
            rows={3}
            disabled={!isImageLoaded || isLoading}
          />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Quick Start Templates</h4>
        <div className="flex flex-wrap gap-2">
            {templates.map(t => (
                <button 
                    key={t}
                    onClick={() => setPrompt(t)}
                    disabled={!isImageLoaded || isLoading}
                    className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm hover:bg-gray-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {t}
                </button>
            ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onSubmit}
          disabled={isLoading || !prompt.trim() || !isImageLoaded}
          className="flex-grow inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Loader />
              Transforming...
            </>
          ) : (
            <>
              <WandIcon className="w-5 h-5 mr-2" />
              Transform
            </>
          )}
        </button>
        <button
          onClick={onReset}
          disabled={isLoading || !isImageLoaded}
          className="inline-flex items-center justify-center px-4 py-3 border border-gray-600 text-base font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ResetIcon className="w-5 h-5 mr-2"/>
          Reset
        </button>
      </div>
    </div>
  );
};
