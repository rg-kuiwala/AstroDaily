import { GoogleGenAI, Type } from "@google/genai";
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
  Include:
  - A detailed prediction
  - Lucky number
  - Lucky color
  - Compatibility with another zodiac sign
  - General mood
  
  Return the response in JSON format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
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
    User Profile:
    - Name: ${userProfile.name}
    - DOB: ${userProfile.dob}
    - TOB: ${userProfile.tob}
    - POB: ${userProfile.pob}
    - Zodiac Sign: ${userProfile.sign}
    
    Provide personalized astrological advice based on these details. 
    Be empathetic, mystical, and professional. 
    Respond in ${language === "en" ? "English" : "Hindi"}.
    If the user asks non-astrological questions, gently guide them back to astrology.
    Keep your responses concise but insightful (max 150 words).`;

    const lastMessage = messages[messages.length - 1].text;
    
    // Using generateContent directly for better reliability in this environment
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `My details: ${JSON.stringify(userProfile)}. My question: ${lastMessage}` }]
        }
      ],
      config: {
        systemInstruction,
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
    // Re-throw to be caught by the component
    throw error;
  }
}
