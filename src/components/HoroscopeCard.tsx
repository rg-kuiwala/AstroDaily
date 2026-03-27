import React from "react";
import { HoroscopeData, Language } from "../types";
import { motion } from "framer-motion";
import { Sparkles, Heart, Palette, Hash, Moon } from "lucide-react";

interface HoroscopeCardProps {
  data: HoroscopeData;
  language: Language;
  loading?: boolean;
}

export const HoroscopeCard: React.FC<HoroscopeCardProps> = ({
  data,
  language,
  loading,
}) => {
  if (loading) {
    return (
      <div className="glass p-8 w-full max-w-2xl mx-auto animate-pulse">
        <div className="h-8 bg-white/10 rounded w-1/3 mb-6 mx-auto"></div>
        <div className="space-y-4">
          <div className="h-4 bg-white/10 rounded w-full"></div>
          <div className="h-4 bg-white/10 rounded w-full"></div>
          <div className="h-4 bg-white/10 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const labels = {
    en: {
      luckyNumber: "Lucky Number",
      luckyColor: "Lucky Color",
      compatibility: "Compatibility",
      mood: "Mood",
      prediction: "Your Horoscope",
    },
    hi: {
      luckyNumber: "भाग्यशाली अंक",
      luckyColor: "भाग्यशाली रंग",
      compatibility: "अनुकूलता",
      mood: "मनोदशा",
      prediction: "आपका राशिफल",
    },
  };

  const l = labels[language];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-8 w-full max-w-2xl mx-auto relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={120} />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif gold-text mb-2">
          {data.sign} - {data.date}
        </h2>
        <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent w-full"></div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Moon size={20} className="text-gold" />
          {l.prediction}
        </h3>
        <p className="text-lg leading-relaxed opacity-90">{data.prediction}</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg">
            <Hash size={20} className="text-gold" />
          </div>
          <div>
            <p className="text-xs opacity-60">{l.luckyNumber}</p>
            <p className="font-bold">{data.luckyNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg">
            <Palette size={20} className="text-gold" />
          </div>
          <div>
            <p className="text-xs opacity-60">{l.luckyColor}</p>
            <p className="font-bold">{data.luckyColor}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg">
            <Heart size={20} className="text-gold" />
          </div>
          <div>
            <p className="text-xs opacity-60">{l.compatibility}</p>
            <p className="font-bold">{data.compatibility}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg">
            <Sparkles size={20} className="text-gold" />
          </div>
          <div>
            <p className="text-xs opacity-60">{l.mood}</p>
            <p className="font-bold">{data.mood}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
