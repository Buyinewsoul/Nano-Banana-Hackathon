
import React from 'react';

interface GalleryPanelProps {
  images: string[];
  onSelect: (imageDataUrl: string) => void;
}

export const GalleryPanel: React.FC<GalleryPanelProps> = ({ images, onSelect }) => {
  if (!images || images.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Your saved creations will appear here.</p>
        <p className="text-sm mt-1">Edit an image and click the save icon to add it to your gallery.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 max-h-[60vh] overflow-y-auto pr-2">
      {images.map((imgSrc, index) => (
        <div 
            key={index} 
            className="aspect-square bg-gray-700 rounded-md overflow-hidden cursor-pointer group relative"
            onClick={() => onSelect(imgSrc)}
        >
          <img 
            src={imgSrc} 
            alt={`Saved creation ${index + 1}`} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
            <p className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">Load into Editor</p>
          </div>
        </div>
      ))}
    </div>
  );
};
