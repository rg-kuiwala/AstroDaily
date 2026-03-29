import React, { useState } from "react";
import { auth, googleProvider, signInWithPopup, signInWithRedirect } from "../firebase";
import { Language } from "../types";
import { LogIn, Sparkles, AlertCircle, Loader2, ArrowRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthProps {
  language: Language;
}

export const Auth: React.FC<AuthProps> = ({ language }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRedirectOption, setShowRedirectOption] = useState(false);

  const handleLogin = async (useRedirect = false) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      if (useRedirect) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setShowRedirectOption(true);
      
      // User-friendly error messages
      if (err.code === "auth/popup-blocked") {
        setError(language === "en" 
          ? "The login window was blocked. Please allow popups or use the method below." 
          : "लॉगिन विंडो ब्लॉक कर दी गई थी। कृपया पॉपअप की अनुमति दें या नीचे दी गई विधि का उपयोग करें।");
      } else if (err.code === "auth/unauthorized-domain") {
        setError(language === "en"
          ? "This domain is not yet authorized in Firebase. Please check your settings."
          : "यह डोमेन अभी तक फायरबेस में अधिकृत नहीं है। कृपया अपनी सेटिंग्स जांचें।");
      } else {
        setError(language === "en" 
          ? "Something went wrong during sign in. Please try again." 
          : "साइन इन के दौरान कुछ गलत हो गया। कृपया पुनः प्रयास करें।");
      }
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    en: {
      title: "Unlock Your Destiny",
      subtitle: "Sign in to access personalized horoscopes and AI Astro Chat.",
      button: "Sign in with Google",
    },
    hi: {
      title: "अपना भाग्य अनलॉक करें",
      subtitle: "व्यक्तिगत राशिफल और एआई एस्ट्रो चैट तक पहुंचने के लिए साइन इन करें।",
      button: "गूगल के साथ साइन इन करें",
    },
  };

  const l = labels[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="glass-dark p-12 md:p-24 max-w-4xl mx-auto text-center space-y-16 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-30" />
      
      <div className="flex flex-col items-center gap-8">
        <motion.div 
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="p-8 border border-gold/20 rounded-full shadow-[0_0_60px_rgba(242,125,38,0.1)] relative"
        >
          <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full" />
          <Sparkles size={80} className="text-gold relative z-10" />
        </motion.div>
        
        <div className="space-y-6">
          <span className="micro-label text-gold">Access the Infinite</span>
          <h2 className="text-6xl md:text-8xl font-display leading-none uppercase tracking-tighter gold-text max-w-2xl mx-auto">
            {l.title}
          </h2>
          <p className="text-xl font-serif italic text-white/50 leading-relaxed max-w-xl mx-auto">
            "{l.subtitle}"
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto space-y-8">
        <button
          onClick={() => handleLogin(false)}
          disabled={loading}
          className="w-full flex items-center justify-center gap-6 bg-white text-mystic-950 font-bold py-6 rounded-full hover:bg-gold hover:text-mystic-900 transition-all duration-500 disabled:opacity-50 shadow-2xl group"
        >
          {loading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <LogIn size={24} className="group-hover:translate-x-2 transition-transform duration-500" />
          )}
          <span className="text-lg uppercase tracking-widest">{l.button}</span>
        </button>

        {showRedirectOption && (
          <button
            onClick={() => handleLogin(true)}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 text-white/30 hover:text-white text-[10px] font-bold py-2 transition-all uppercase tracking-[0.3em]"
          >
            {language === "en" ? "Try Direct Method" : "सीधी विधि आज़माएं"}
            <ArrowRight size={14} />
          </button>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 bg-red-500/5 border border-red-500/20 rounded-3xl flex items-start gap-4 text-left"
            >
              <AlertCircle size={20} className="text-red-500 shrink-0 mt-1" />
              <p className="text-sm text-red-400 font-medium leading-relaxed">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex justify-center gap-4 opacity-20">
        <Star size={12} />
        <Star size={12} />
        <Star size={12} />
      </div>
    </motion.div>
  );
};
