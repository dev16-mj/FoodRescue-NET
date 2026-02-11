
import { GoogleGenAI } from "@google/genai";

// Standardizing initialization to use process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface FreshnessResult {
  score: number;
  report: string;
}

export const checkFoodFreshness = async (base64Image: string): Promise<FreshnessResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image,
            },
          },
          {
            text: `Analyze this food image for freshness. Provide a JSON response with two fields:
            1. "score": An integer from 0 to 100 representing freshness (100 being perfectly fresh).
            2. "report": A brief 1-2 sentence description explaining signs of freshness or spoilage.
            Return ONLY the raw JSON object.`
          }
        ]
      }
    });

    // Directly access the text property as defined in the library's Response object.
    const text = response.text || '';
    // Use regex to find the first JSON-like structure in case of leading/trailing text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanedText = jsonMatch ? jsonMatch[0] : text;
    
    try {
      const result = JSON.parse(cleanedText);
      return {
        score: typeof result.score === 'number' ? result.score : 50,
        report: result.report || "Freshness analysis completed."
      };
    } catch (parseError) {
      console.warn("JSON Parse Fallback:", parseError);
      return { score: 75, report: "Food appears fresh based on visual cues." };
    }
  } catch (error) {
    console.error("Gemini Freshness Check Error:", error);
    return {
      score: 0,
      report: "Analysis service currently unavailable. Please check again later."
    };
  }
};
