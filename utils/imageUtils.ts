
// Fix: Replaced deprecated type 'GenerativePart' with the correct type 'Part'.
import type { Part } from "@google/genai";

const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Fix: Replaced deprecated type 'GenerativePart' with the correct type 'Part'.
export const fileToGenerativePart = async (file: File): Promise<Part> => {
    const dataURL = await fileToDataURL(file);
    const base64Data = dataURL.split(',')[1];
    return {
      inlineData: {
        data: base64Data,
        mimeType: file.type,
      },
    };
};
