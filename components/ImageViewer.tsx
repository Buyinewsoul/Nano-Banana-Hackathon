
import React, { useState } from 'react';
import { SaveIcon } from './icons';

interface ImageViewerProps {
  originalImage: string | null;
  editedImage: string | null;
  onSave?: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ originalImage, editedImage, onSave }) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const hasBothImages = originalImage && editedImage && originalImage !== editedImage;

  const handleSave = () => {
    if (onSave) {
        onSave();
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="relative w-full max-w-2xl aspect-square bg-gray-900/50 rounded-lg overflow-hidden flex items-center justify-center">
        {hasBothImages && onSave && (
            <button
                onClick={handleSave}
                className={`absolute top-3 right-3 z-10 p-2 bg-black/50 rounded-full text-white hover:text-white transition-all duration-300 ${showSaved ? 'bg-green-600' : 'hover:bg-purple-600'}`}
                aria-label="Save to gallery"
                title="Save to gallery"
            >
                <SaveIcon className="w-6 h-6" />
            </button>
        )}
        {editedImage ? (
          <img
            src={showOriginal ? originalImage! : editedImage}
            alt={showOriginal ? 'Original image' : 'Edited image'}
            className="object-contain w-full h-full transition-opacity duration-300"
          />
        ) : originalImage ? (
           <img
            src={originalImage}
            alt='Original image'
            className="object-contain w-full h-full"
          />
        ) : (
          <p className="text-gray-500">Your image will appear here</p>
        )}
      </div>

      {hasBothImages && (
        <div className="flex items-center space-x-3 bg-gray-800 p-2 rounded-full">
          <span className={`px-3 text-sm font-medium ${!showOriginal ? 'text-gray-400' : 'text-white'}`}>Original</span>
          <label htmlFor="image-toggle" className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="image-toggle"
              className="sr-only peer"
              checked={!showOriginal}
              onChange={() => setShowOriginal(!showOriginal)}
            />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
          <span className={`px-3 text-sm font-medium ${showOriginal ? 'text-gray-400' : 'text-white'}`}>Edited</span>
        </div>
      )}
    </div>
  );
};
