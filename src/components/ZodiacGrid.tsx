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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 overflow-hidden rounded-[2.5rem]">
      {ZODIAC_SIGNS.map((sign, index) => (
        <motion.button
          key={sign.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.5,
            delay: index * 0.05 
          }}
          onClick={() => {
            console.log("Zodiac Grid Button Clicked:", sign.id);
            onSelect(sign.id);
          }}
          className={cn(
            "zodiac-card p-12 flex flex-col items-start justify-between min-h-[300px] text-left group relative",
            selectedSign === sign.id ? "bg-gold text-mystic-900" : "bg-mystic-950 hover:bg-white/[0.03]"
          )}
        >
          <div className="flex justify-between w-full items-start">
            <span className={cn(
              "text-xs font-bold uppercase tracking-[0.3em] opacity-40",
              selectedSign === sign.id && "text-mystic-900 opacity-60"
            )}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className={cn(
              "text-4xl transition-transform duration-700 group-hover:rotate-[360deg]",
              selectedSign === sign.id ? "text-mystic-900" : "gold-text"
            )}>
              {sign.symbol}
            </span>
          </div>
          
          <div className="space-y-2">
            <h3 className={cn(
              "text-4xl md:text-5xl font-display leading-none",
              selectedSign === sign.id ? "text-mystic-900" : "text-white"
            )}>
              {language === "en" ? sign.id : sign.hindiName}
            </h3>
            <p className={cn(
              "micro-label",
              selectedSign === sign.id ? "text-mystic-900/60" : "opacity-40"
            )}>
              {sign.dateRange}
            </p>
          </div>

          {/* Hover effect line */}
          <div className={cn(
            "absolute bottom-0 left-0 h-1 bg-gold transition-all duration-500",
            selectedSign === sign.id ? "w-full bg-mystic-900" : "w-0 group-hover:w-full"
          )} />
        </motion.button>
      ))}
    </div>
  );
};
