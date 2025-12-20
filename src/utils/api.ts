import {
  GoogleGenerativeAI,
  GenerationConfig,
  Part,
} from "@google/generative-ai";

export const callGeminiApi = async (
  apiKey: string,
  prompt: string | Part[],
  model: string = "gemini-pro",
  generationConfig?: GenerationConfig & { responseMimeType?: string },
  imageData?: { data: string; mimeType: string }, // Legacy support for single image
) => {
  if (!apiKey) {
    throw new Error("API key is missing.");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const finalGenerationConfig: GenerationConfig & {
      responseMimeType?: string;
    } = { ...generationConfig };

    const geminiModel = genAI.getGenerativeModel({
      model,
      generationConfig: finalGenerationConfig,
    });

    let parts: Part[];

    if (typeof prompt === "string") {
      // For backward compatibility when prompt is a simple string
      parts = [{ text: prompt }];
      if (imageData) {
        parts.push({ inlineData: imageData });
      }
    } else {
      // For multimodal prompts where the prompt is already an array of Parts
      parts = prompt;
    }

    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts }],
    });
    const response = await result.response;
    let fullResponse = "";
    const responseParts = response.candidates?.[0]?.content?.parts || [];
    for (const part of responseParts) {
      if (part.text) {
        fullResponse += part.text;
      } else if (part.inlineData) {
        // Assuming image data is base64 encoded and mimeType is available
        fullResponse += `![Image](data:${part.inlineData.mimeType};base64,${part.inlineData.data})`;
      }
    }
    return fullResponse;
  } catch (error: any) {
    // Explicitly type error as any for easier property access
    console.error("Error calling Gemini API:", error);
    let errorMessage =
      "Terjadi kesalahan yang tidak diketahui saat memanggil Gemini API.";

    if (error.message) {
      errorMessage = `Error: ${error.message}`;
    }

    // Check for specific error types or properties from the Gemini SDK
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 400:
          errorMessage = "Permintaan tidak valid. Mohon periksa input Anda.";
          break;
        case 401:
          errorMessage =
            "API Key tidak valid atau tidak terotorisasi. Mohon periksa API Key Anda.";
          break;
        case 429:
          errorMessage =
            "Batas penggunaan API terlampaui. Mohon coba lagi nanti.";
          break;
        case 500:
          errorMessage = "Kesalahan server internal. Mohon coba lagi nanti.";
          break;
        default:
          errorMessage = `Kesalahan API (${error.response.status}): ${error.response.statusText || error.message}`;
      }
    } else if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      errorMessage =
        "Koneksi ke API terputus atau waktu habis. Mohon periksa koneksi internet Anda.";
    } else if (error.name === "GoogleGenerativeAIError") {
      // Specific error from the SDK
      errorMessage = `Kesalahan Gemini API: ${error.message}`;
    }

    return { error: errorMessage }; // Return an object with an error property
  }
};

export const listGeminiModels = async (_apiKey: string) => {
  // Hardcoded models as listModels is not directly available in client SDK easily without extra config
  return [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-pro-vision",
  ];
};
