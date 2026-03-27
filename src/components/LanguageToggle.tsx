import React from "react";
import { Language } from "../types";
import { cn } from "../lib/utils";

interface LanguageToggleProps {
  language: Language;
  onToggle: (lang: Language) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  language,
  onToggle,
}) => {
  return (
    <div className="flex items-center gap-2 glass p-1 rounded-full">
      <button
        onClick={() => onToggle("en")}
        className={cn(
          "px-4 py-1 rounded-full transition-all text-sm font-medium",
          language === "en" ? "bg-gold text-mystic-900" : "text-white/60 hover:text-white"
        )}
      >
        English
      </button>
      <button
        onClick={() => onToggle("hi")}
        className={cn(
          "px-4 py-1 rounded-full transition-all text-sm font-medium",
          language === "hi" ? "bg-gold text-mystic-900" : "text-white/60 hover:text-white"
        )}
      >
        हिन्दी
      </button>
    </div>
  );
};
