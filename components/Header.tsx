
import React from 'react';
import { WandIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="text-center w-full max-w-7xl mx-auto">
      <div className="inline-flex items-center gap-4">
        <WandIcon className="w-10 h-10 text-purple-400"/>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Imaginative Canvas
        </h1>
      </div>
      <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
        Edit images with the power of your words. Upload a photo and let Gemini transform your vision into reality.
      </p>
    </header>
  );
};
