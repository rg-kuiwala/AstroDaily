import React from "react";
import { ZODIAC_SIGNS } from "../constants";
import { Language, ZodiacSign } from "../types";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

interface ZodiacGridProps {
  language: Language;
  onSelect: (sign: ZodiacSign) => void;
  selectedSign: ZodiacSign | null;
}

export const ZodiacGrid: React.FC<ZodiacGridProps> = ({
  language,
  onSelect,
  selectedSign,
}) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 p-4 max-w-6xl mx-auto">
      {ZODIAC_SIGNS.map((sign, index) => (
        <motion.button
          key={sign.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ 
            duration: 0.2,
            delay: index * 0.01 
          }}
          onClick={() => {
            console.log("Zodiac Grid Button Clicked:", sign.id);
            onSelect(sign.id);
          }}
          className={cn(
            "glass-dark zodiac-card p-6 flex flex-col items-center justify-center gap-4 group",
            selectedSign === sign.id ? "border-gold bg-gold/10 ring-2 ring-gold/20" : "hover:border-white/20"
          )}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gold/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-5xl gold-text relative z-10 block transform group-hover:rotate-12 transition-transform duration-500">
              {sign.symbol}
            </span>
          </div>
          
          <div className="text-center space-y-1">
            <p className="font-serif font-bold text-sm md:text-base tracking-wide gold-text">
              {language === "en" ? sign.id : sign.hindiName}
            </p>
            <p className="text-[9px] md:text-[10px] opacity-40 uppercase tracking-widest font-medium">
              {sign.dateRange}
            </p>
          </div>
        </motion.button>
      ))}
    </div>
  );
};
