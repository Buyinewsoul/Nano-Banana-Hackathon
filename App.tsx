
import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageViewer } from './components/ImageViewer';
import { PromptControls } from './components/PromptControls';
import { HistoryPanel } from './components/HistoryPanel';
import { editImage, generateImage } from './services/geminiService';
import { Header } from './components/Header';
import { InlineError } from './components/InlineError';
// Fix: Replaced deprecated type 'GenerativePart' with the correct type 'Part'.
import type { Part } from '@google/genai';
import { CreatorPanel } from './components/CreatorPanel';
import { GalleryPanel } from './components/GalleryPanel';
import { Tabs } from './components/Tabs';
import { EditIcon, WandIcon, GalleryIcon } from './components/icons';
import { Loader } from './components/Loader';

type ActiveTab = 'edit' | 'create' | 'gallery';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentMimeType, setCurrentMimeType] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState('Transforming...');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [key, setKey] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<ActiveTab>('edit');
  const [gallery, setGallery] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedGallery = localStorage.getItem('imaginativeCanvasGallery');
      if (savedGallery) {
        setGallery(JSON.parse(savedGallery));
      }
    } catch (e) {
      console.error("Failed to load gallery from local storage", e);
    }
  }, []);

  const saveGalleryToStorage = (updatedGallery: string[]) => {
    try {
      localStorage.setItem('imaginativeCanvasGallery', JSON.stringify(updatedGallery));
    } catch (e) {
      console.error("Failed to save gallery to local storage", e);
    }
  };

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    const objectUrl = URL.createObjectURL(file);
    setCurrentImage(objectUrl);
    setCurrentMimeType(file.type);
    setError(null);
    setHistory([]);
    setPrompt('');
    setActiveTab('edit');
    setKey(prev => prev + 1);
  };

  const handleReset = () => {
    if (originalImage) {
      const objectUrl = URL.createObjectURL(originalImage);
      setCurrentImage(objectUrl);
      setCurrentMimeType(originalImage.type);
      setHistory([]);
      setError(null);
      setPrompt('');
    }
  };

  const handleTransform = useCallback(async () => {
    if (!currentImage || !prompt || !currentMimeType) {
      setError('Please provide an image and a prompt.');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Transforming...');
    setError(null);

    try {
      const base64Response = await fetch(currentImage);
      const blob = await base64Response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const pureBase64 = base64data.split(',')[1];

        // Fix: Replaced deprecated type 'GenerativePart' with the correct type 'Part'.
        const imagePart: Part = {
          inlineData: {
            data: pureBase64,
            mimeType: currentMimeType,
          },
        };

        const result = await editImage(imagePart, prompt);

        if (result.imageData && result.mimeType) {
            const newImageUrl = `data:${result.mimeType};base64,${result.imageData}`;
            setCurrentImage(newImageUrl);
            setCurrentMimeType(result.mimeType);
            setHistory(prev => [...prev, prompt]);
            setPrompt('');
        } else {
            throw new Error(result.text || "No image was returned from the AI. Try a different prompt.");
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentImage, prompt, currentMimeType]);
  
  const handleGenerate = useCallback(async (generationPrompt: string) => {
    setIsLoading(true);
    setLoadingMessage('Generating...');
    setError(null);
    setCurrentImage(null);
    setOriginalImage(null);
    setHistory([]);

    try {
      const imageData = await generateImage(generationPrompt);
      const newImageUrl = `data:image/png;base64,${imageData}`;
      const blob = await (await fetch(newImageUrl)).blob();
      const file = new File([blob], "generated-image.png", { type: "image/png" });

      setOriginalImage(file);
      setCurrentImage(newImageUrl);
      setCurrentMimeType('image/png');
      setActiveTab('edit');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error(errorMessage);
      setError(errorMessage);
      // Reset view if generation fails
      setCurrentImage(null);
      setOriginalImage(null);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleSaveToGallery = () => {
    if (currentImage && !gallery.includes(currentImage)) {
      const updatedGallery = [currentImage, ...gallery];
      setGallery(updatedGallery);
      saveGalleryToStorage(updatedGallery);
    }
  };

  const handleSelectFromGallery = async (imageDataUrl: string) => {
    const blob = await (await fetch(imageDataUrl)).blob();
    const file = new File([blob], "gallery-image.png", { type: "image/png" });
    handleImageUpload(file);
  };
  
  const tabs = [
    { id: 'edit', label: 'Edit', icon: <EditIcon className="w-5 h-5 mr-2" /> },
    { id: 'create', label: 'Create', icon: <WandIcon className="w-5 h-5 mr-2" /> },
    { id: 'gallery', label: 'Gallery', icon: <GalleryIcon className="w-5 h-5 mr-2" /> },
  ];
  
  const isImageLoaded = !!originalImage;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col p-4 md:p-8">
      <Header />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto mt-6">
        <div className="lg:col-span-1 bg-gray-800/50 rounded-2xl p-6 flex flex-col space-y-4 self-start backdrop-blur-sm border border-gray-700/50">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as ActiveTab)} />

          <div className="flex-grow">
            {activeTab === 'edit' && (
              <div className="space-y-6">
                <PromptControls
                  prompt={prompt}
                  setPrompt={setPrompt}
                  onSubmit={handleTransform}
                  onReset={handleReset}
                  isLoading={isLoading}
                  isImageLoaded={isImageLoaded}
                />
                <HistoryPanel history={history} />
              </div>
            )}
            {activeTab === 'create' && (
                <CreatorPanel onGenerate={handleGenerate} isLoading={isLoading}/>
            )}
            {activeTab === 'gallery' && (
                <GalleryPanel images={gallery} onSelect={handleSelectFromGallery} />
            )}
          </div>
          
          {error && <InlineError message={error} />}
        </div>
        <div className="lg:col-span-2 bg-gray-800/50 rounded-2xl p-4 md:p-6 flex items-center justify-center min-h-[400px] lg:min-h-[60vh] border border-gray-700/50">
          {isLoading && (activeTab === 'create' || isLoading && isImageLoaded) ? (
              <div className="flex flex-col items-center text-center">
                  <Loader/>
                  <p className="mt-4 text-lg font-semibold">{loadingMessage}</p>
                  <p className="text-sm text-gray-400">This can take a moment, hang tight...</p>
              </div>
          ) : isImageLoaded ? (
            <ImageViewer 
              key={key} 
              originalImage={URL.createObjectURL(originalImage)} 
              editedImage={currentImage}
              onSave={handleSaveToGallery}
            />
          ) : (
            <ImageUploader onImageUpload={handleImageUpload} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
