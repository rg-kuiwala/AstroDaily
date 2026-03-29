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
      <div className="glass-dark p-12 md:p-24 w-full max-w-5xl mx-auto animate-pulse space-y-12 flex flex-col items-start">
        <div className="flex justify-between w-full items-start">
          <div className="space-y-4 w-1/2">
            <div className="h-4 bg-white/5 rounded-full w-24"></div>
            <div className="h-20 bg-white/5 rounded-2xl w-full"></div>
          </div>
          <div className="h-16 w-16 bg-white/5 rounded-full"></div>
        </div>
        
        <div className="space-y-6 w-full">
          <div className="h-4 bg-white/5 rounded-full w-full"></div>
          <div className="h-4 bg-white/5 rounded-full w-full"></div>
          <div className="h-4 bg-white/5 rounded-full w-3/4"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-white/5 rounded-3xl"></div>
          ))}
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
      share: "Share Insight",
    },
    hi: {
      luckyNumber: "भाग्यशाली अंक",
      luckyColor: "भाग्यशाली रंग",
      compatibility: "अनुकूलता",
      mood: "मनोदशा",
      prediction: "दिव्य मार्गदर्शन",
      share: "साझा करें",
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass-dark p-8 md:p-20 w-full max-w-5xl mx-auto relative overflow-hidden group"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20 relative z-10">
        <div className="space-y-4">
          <span className="micro-label text-gold">{data.date}</span>
          <h2 className="text-7xl md:text-9xl font-display leading-none tracking-tighter gold-text">
            {data.sign}
          </h2>
        </div>
        
        <button 
          onClick={handleShare}
          className="group/btn flex items-center gap-4 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-gold hover:text-mystic-900 transition-all duration-500 shadow-2xl"
        >
          <Share2 size={16} />
          {l.share}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-gold/40"></div>
            <span className="micro-label">{l.prediction}</span>
          </div>
          <p className="text-3xl md:text-5xl font-serif italic leading-[1.15] text-white/90 selection:bg-gold selection:text-black">
            "{data.prediction}"
          </p>
        </div>

        <div className="lg:col-span-4 grid grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-[2rem] overflow-hidden self-start">
          {[
            { icon: Hash, label: l.luckyNumber, value: data.luckyNumber },
            { icon: Palette, label: l.luckyColor, value: data.luckyColor },
            { icon: Heart, label: l.compatibility, value: data.compatibility },
            { icon: Sparkles, label: l.mood, value: data.mood },
          ].map((item, i) => (
            <div 
              key={i}
              className="p-8 bg-mystic-950/40 flex flex-col items-start gap-4 group/item hover:bg-white/[0.03] transition-colors"
            >
              <item.icon size={18} className="text-gold opacity-40 group-hover/item:opacity-100 transition-opacity" />
              <div>
                <p className="text-[9px] opacity-30 uppercase tracking-[0.2em] mb-2 font-bold">{item.label}</p>
                <p className="font-bold text-sm tracking-tight">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </motion.div>
  );
};
