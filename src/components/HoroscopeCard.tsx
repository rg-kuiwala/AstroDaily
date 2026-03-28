import React from "react";
import { HoroscopeData, Language } from "../types";
import { motion } from "framer-motion";
import { Sparkles, Heart, Palette, Hash, Moon, Share2 } from "lucide-react";

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
      <div className="glass-dark p-12 w-full max-w-3xl mx-auto animate-pulse space-y-8 flex flex-col items-center">
        <div className="p-4 bg-white/5 rounded-full mb-4">
          <Moon size={32} className="text-white/20 animate-spin-slow" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/20 font-bold">Consulting the Stars...</p>
        <div className="h-12 bg-white/5 rounded-2xl w-1/2"></div>
        <div className="space-y-4 w-full">
          <div className="h-4 bg-white/5 rounded-full w-full"></div>
          <div className="h-4 bg-white/5 rounded-full w-full"></div>
          <div className="h-4 bg-white/5 rounded-full w-3/4"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
          <div className="h-16 bg-white/5 rounded-2xl"></div>
          <div className="h-16 bg-white/5 rounded-2xl"></div>
          <div className="h-16 bg-white/5 rounded-2xl"></div>
          <div className="h-16 bg-white/5 rounded-2xl"></div>
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
      prediction: "Celestial Guidance",
    },
    hi: {
      luckyNumber: "भाग्यशाली अंक",
      luckyColor: "भाग्यशाली रंग",
      compatibility: "अनुकूलता",
      mood: "मनोदशा",
      prediction: "दिव्य मार्गदर्शन",
    },
  };

  const l = labels[language];

  const handleShare = async () => {
    const shareUrl = "https://NamsteAstro.vercel.app";
    const text = `Check out my ${data.sign} horoscope on NamasteAstro! 🌟\n\n"${data.prediction}"\n\nLucky Number: ${data.luckyNumber}\nLucky Color: ${data.luckyColor}\n\nRead more at: ${shareUrl}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Horoscope - NamasteAstro',
          text: text,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert(language === "en" ? "Horoscope copied to clipboard!" : "राशिफल क्लिपबोर्ड पर कॉपी किया गया!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-dark p-10 md:p-14 w-full max-w-3xl mx-auto relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={handleShare}
          className="p-4 bg-gold text-mystic-900 hover:scale-110 active:scale-95 transition-all rounded-2xl shadow-lg flex items-center gap-2 font-bold text-sm"
          title="Share Horoscope"
        >
          <Share2 size={18} />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

      <div className="text-center mb-12 relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block p-4 bg-gold/10 rounded-full mb-6 border border-gold/20"
        >
          <Sparkles size={32} className="text-gold" />
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-serif gold-text mb-4 tracking-tight">
          {data.sign}
        </h2>
        <p className="text-xs text-white/40 uppercase tracking-[0.4em] font-medium">
          {data.date}
        </p>
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent w-full"></div>
      </div>

      <div className="mb-14 relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-gold/50"></div>
          <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-gold/80">
            {l.prediction}
          </h3>
        </div>
        <p className="text-xl md:text-2xl leading-relaxed font-serif italic text-white/90">
          "{data.prediction}"
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: Hash, label: l.luckyNumber, value: data.luckyNumber },
          { icon: Palette, label: l.luckyColor, value: data.luckyColor },
          { icon: Heart, label: l.compatibility, value: data.compatibility },
          { icon: Sparkles, label: l.mood, value: data.mood },
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-5 glass border-white/5 flex flex-col items-center gap-3 text-center group hover:bg-white/5 transition-colors"
          >
            <item.icon size={20} className="text-gold opacity-60 group-hover:opacity-100 transition-opacity" />
            <div>
              <p className="text-[10px] opacity-40 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="font-bold text-sm tracking-wide">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
