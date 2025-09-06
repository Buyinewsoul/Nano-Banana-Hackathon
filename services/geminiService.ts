
import { GoogleGenAI, Modality } from "@google/genai";
// Fix: Replaced deprecated type 'GenerativePart' with the correct type 'Part'.
import type { Part } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface EditImageResult {
    imageData: string | null;
    mimeType: string | null;
    text: string | null;
}

export const editImage = async (
  // Fix: Replaced deprecated type 'GenerativePart' with the correct type 'Part'.
  imagePart: Part,
  prompt: string,
): Promise<EditImageResult> => {
  const textPart = {
    text: prompt,
  };
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const result: EditImageResult = { imageData: null, mimeType: null, text: null };

    if (response?.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          result.imageData = part.inlineData.data;
          result.mimeType = part.inlineData.mimeType;
        } else if (part.text) {
          result.text = part.text;
        }
      }
    }
    
    if (!result.imageData && !result.text) {
        result.text = response.text || "The model did not return an image or specific text.";
    }

    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    } else {
      throw new Error("The model did not return any images. Try a different prompt.");
    }
  } catch (error) {
    console.error("Error calling Gemini API for image generation:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};
