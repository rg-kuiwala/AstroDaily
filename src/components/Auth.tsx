import React, { useState } from "react";
import { auth, googleProvider, signInWithPopup, signInWithRedirect } from "../firebase";
import { Language } from "../types";
import { LogIn, Sparkles, AlertCircle, Loader2, ArrowRight } from "lucide-react";
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-12 max-w-md mx-auto text-center space-y-10 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
      
      <div className="flex justify-center">
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="p-5 bg-gold/10 rounded-3xl border border-gold/20 shadow-[0_0_40px_rgba(212,175,55,0.1)]"
        >
          <Sparkles size={56} className="text-gold" />
        </motion.div>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-4xl font-serif font-bold gold-text leading-tight">{l.title}</h2>
        <p className="text-sm text-white/50 leading-relaxed px-4">{l.subtitle}</p>
      </div>

      <div className="space-y-6">
        <button
          onClick={() => handleLogin(false)}
          disabled={loading}
          className="w-full flex items-center justify-center gap-4 bg-white text-mystic-950 font-bold py-5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-[0_10px_30px_rgba(255,255,255,0.1)] group"
        >
          {loading ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <LogIn size={22} className="group-hover:translate-x-1 transition-transform" />
          )}
          <span className="text-lg">{l.button}</span>
        </button>

        {showRedirectOption && (
          <button
            onClick={() => handleLogin(true)}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-white/40 hover:text-white text-xs font-medium py-2 transition-all uppercase tracking-widest"
          >
            {language === "en" ? "Try Direct Method" : "सीधी विधि आज़माएं"}
            <ArrowRight size={14} />
          </button>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-left"
            >
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-400 leading-tight">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <p className="text-[10px] opacity-40 uppercase tracking-widest">
        Secure authentication via Google
      </p>
    </motion.div>
  );
};
