import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { Language, ZodiacSign, HoroscopeData, UserProfile, ChatMessage } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing! Please add it to your environment variables.");
    }
    aiInstance = new GoogleGenAI({ apiKey: apiKey || "MISSING_KEY" });
  }
  return aiInstance;
}

export async function fetchHoroscope(
  sign: ZodiacSign,
  language: Language,
  period: "daily" | "weekly" | "monthly" = "daily"
): Promise<HoroscopeData> {
  const ai = getAI();
  const prompt = `Generate a ${period} horoscope for ${sign} in ${
    language === "en" ? "English" : "Hindi"
  }. 
  Include: prediction, luckyNumber, luckyColor, compatibility, mood.
  Return JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          prediction: { type: Type.STRING },
          luckyNumber: { type: Type.NUMBER },
          luckyColor: { type: Type.STRING },
          compatibility: { type: Type.STRING },
          mood: { type: Type.STRING },
        },
        required: ["prediction", "luckyNumber", "luckyColor", "compatibility", "mood"],
      },
    },
  });

  const data = JSON.parse(response.text);
  return {
    sign,
    date: new Date().toLocaleDateString(),
    ...data,
  };
}

export async function chatWithAstrologer(
  userProfile: UserProfile,
  messages: ChatMessage[],
  language: Language
): Promise<string> {
  const ai = getAI();
  try {
    const systemInstruction = `You are an expert Vedic and Western Astrologer. 
    User Profile: ${JSON.stringify(userProfile)}
    
    Provide personalized astrological advice. 
    Be empathetic, mystical, and professional. 
    Respond in ${language === "en" ? "English" : "Hindi"}.
    Keep your responses concise (max 100 words).`;

    const lastMessage = messages[messages.length - 1].text;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `My question: ${lastMessage}` }]
        }
      ],
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
    });

    if (!response || !response.text) {
      throw new Error("Empty response from AI");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
}
