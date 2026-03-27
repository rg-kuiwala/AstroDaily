export type Language = "en" | "hi";

export type ZodiacSign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

export interface HoroscopeData {
  sign: ZodiacSign;
  date: string;
  prediction: string;
  luckyNumber: number;
  luckyColor: string;
  compatibility: string;
  mood: string;
}

export interface UserProfile {
  name: string;
  dob: string;
  tob: string;
  pob: string;
  sign: ZodiacSign;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface ZodiacInfo {
  id: ZodiacSign;
  hindiName: string;
  dateRange: string;
  element: string;
  rulingPlanet: string;
  symbol: string;
}
