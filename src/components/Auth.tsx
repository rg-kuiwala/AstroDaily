import React, { useState } from "react";
import { auth, googleProvider, signInWithPopup } from "../firebase";
import { Language } from "../types";
import { LogIn, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthProps {
  language: Language;
}

export const Auth: React.FC<AuthProps> = ({ language }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Login failed:", err);
      
      // Handle specific Firebase Auth errors
      if (err.code === "auth/popup-blocked") {
        setError(language === "en" 
          ? "Popup blocked! Please allow popups for this site in your browser settings to sign in." 
          : "पॉपअप ब्लॉक हो गया! कृपया साइन इन करने के लिए अपनी ब्राउज़र सेटिंग्स में इस साइट के लिए पॉपअप की अनुमति दें।");
      } else if (err.code === "auth/cancelled-popup-request") {
        setError(language === "en" 
          ? "Login was cancelled. Please try again." 
          : "लॉगिन रद्द कर दिया गया था। कृपया पुनः प्रयास करें।");
      } else if (err.message?.includes("INTERNAL ASSERTION FAILED")) {
        setError(language === "en"
          ? "A technical error occurred. Please refresh the page and try again."
          : "एक तकनीकी त्रुटि हुई। कृपया पृष्ठ को रिफ्रेश करें और पुनः प्रयास करें।");
      } else {
        setError(language === "en" 
          ? "Sign in failed. Please check your connection and try again." 
          : "साइन इन विफल रहा। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।");
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-12 max-w-md mx-auto text-center space-y-8"
    >
      <div className="flex justify-center">
        <div className="p-4 bg-gold/20 rounded-full">
          <Sparkles size={48} className="text-gold" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-3xl font-serif gold-text">{l.title}</h2>
        <p className="text-sm opacity-60 leading-relaxed">{l.subtitle}</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-mystic-900 font-bold py-4 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <LogIn size={20} />
          )}
          {l.button}
        </button>

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
