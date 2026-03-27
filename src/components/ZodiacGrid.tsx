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
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
      {ZODIAC_SIGNS.map((sign, index) => (
        <motion.button
          key={sign.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelect(sign.id)}
          className={cn(
            "glass zodiac-card p-4 flex flex-col items-center justify-center gap-2",
            selectedSign === sign.id && "border-gold bg-white/20"
          )}
        >
          <span className="text-4xl gold-text">{sign.symbol}</span>
          <div className="text-center">
            <p className="font-bold text-sm md:text-base">
              {language === "en" ? sign.id : sign.hindiName}
            </p>
            <p className="text-[10px] md:text-xs opacity-60">{sign.dateRange}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
};
