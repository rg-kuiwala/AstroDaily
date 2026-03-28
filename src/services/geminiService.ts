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
  const systemInstruction = `You are a professional astrologer. Generate a ${period} horoscope for ${sign} in ${
    language === "en" ? "English" : "Hindi"
  }. 
  Provide a detailed prediction, luckyNumber (number), luckyColor (string), compatibility (zodiac sign), and mood (string).
  Return ONLY a valid JSON object.`;

  try {
    // Add a timeout to the fetch
    const fetchPromise = ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate my horoscope.",
      config: {
        systemInstruction,
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

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Request timed out")), 15000)
    );

    const response = await Promise.race([fetchPromise, timeoutPromise]) as any;

    if (!response || !response.text) {
      throw new Error("Empty response from AI");
    }

    const data = JSON.parse(response.text);
    return {
      sign,
      date: new Date().toLocaleDateString(),
      ...data,
    };
  } catch (error) {
    console.error("Fetch Horoscope Error:", error);
    throw error;
  }
}

export async function chatWithAstrologer(
  userProfile: UserProfile,
  messages: ChatMessage[],
  language: Language
): Promise<string> {
  const ai = getAI();
  try {
    const systemInstruction = `You are an expert Vedic and Western Astrologer named NamasteAstro AI. 
    User Profile: ${JSON.stringify(userProfile)}
    
    Provide personalized astrological advice based on the user's birth details. 
    Be empathetic, mystical, and professional. 
    Respond in ${language === "en" ? "English" : "Hindi"}.
    Keep your responses concise and insightful (max 120 words).`;

    const lastMessage = messages[messages.length - 1].text;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: lastMessage }]
        }
      ],
      config: {
        systemInstruction,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    if (!response || !response.text) {
      throw new Error("Empty response from AI");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
}
