
import React, { useState } from 'react';
import { Loader } from './Loader';
import { WandIcon } from './icons';

interface CreatorPanelProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const genres = ['Fantasy', 'Sci-Fi', 'Cyberpunk', 'Steampunk', 'Horror', 'Abstract'];

export const CreatorPanel: React.FC<CreatorPanelProps> = ({ onGenerate, isLoading }) => {
  const [storyName, setStoryName] = useState('');
  const [genre, setGenre] = useState(genres[0]);
  const [scene, setScene] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    const fullPrompt = `${genre} style. A scene for a story called "${storyName}". The scene is: ${scene}. Detailed description of the image: ${description}.`;
    onGenerate(fullPrompt);
  };
  
  const canGenerate = scene.trim() && description.trim();

  return (
    <div className="w-full flex flex-col space-y-4">
      <div>
        <label htmlFor="storyName" className="block text-sm font-medium text-gray-300 mb-2">
          Story Name (Optional)
        </label>
        <input
          type="text"
          id="storyName"
          value={storyName}
          onChange={(e) => setStoryName(e.target.value)}
          placeholder="e.g., The Last Dragon"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-white placeholder-gray-400"
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-2">
          Genre
        </label>
        <select
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-white"
          disabled={isLoading}
        >
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
       <div>
        <label htmlFor="scene" className="block text-sm font-medium text-gray-300 mb-2">
          Scene
        </label>
        <input
          type="text"
          id="scene"
          value={scene}
          onChange={(e) => setScene(e.target.value)}
          placeholder="e.g., A castle in the clouds"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-white placeholder-gray-400"
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
          Describe the scene
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A detailed description of what you want to see..."
          className="w-full p-3 pr-4 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-white placeholder-gray-400 resize-none"
          rows={5}
          disabled={isLoading}
        />
      </div>
      <button
          onClick={handleSubmit}
          disabled={isLoading || !canGenerate}
          className="flex-grow inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Loader />
              Generating...
            </>
          ) : (
            <>
              <WandIcon className="w-5 h-5 mr-2" />
              Generate Story Image
            </>
          )}
        </button>
    </div>
  );
};
