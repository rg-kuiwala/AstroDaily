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
      
      // Handle specific Firebase Auth errors
      if (err.code === "auth/popup-blocked") {
        setError(language === "en" 
          ? "Popup blocked! Please allow popups or use the redirect method below." 
          : "पॉपअप ब्लॉक हो गया! कृपया पॉपअप की अनुमति दें या नीचे दिए गए रीडायरेक्ट तरीके का उपयोग करें।");
      } else if (err.code === "auth/unauthorized-domain") {
        setError(language === "en"
          ? "Unauthorized domain! Please add this URL to your Firebase Console 'Authorized Domains' list."
          : "अनधिकृत डोमेन! कृपया इस यूआरएल को अपने फायरबेस कंसोल 'अधिकृत डोमेन' सूची में जोड़ें।");
      } else if (err.code === "auth/cancelled-popup-request") {
        setError(language === "en" 
          ? "Login was cancelled. Please try again." 
          : "लॉगिन रद्द कर दिया गया था। कृपया पुनः प्रयास करें।");
      } else {
        setError(language === "en" 
          ? `Sign in failed (${err.code || "unknown error"}). Please check your connection.` 
          : `साइन इन विफल रहा (${err.code || "अज्ञात त्रुटि"})। कृपया अपना कनेक्शन जांचें।`);
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
          onClick={() => handleLogin(false)}
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

        {showRedirectOption && (
          <button
            onClick={() => handleLogin(true)}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-white/60 hover:text-white text-xs py-2 transition-all"
          >
            {language === "en" ? "Try Redirect Method (Better for Mobile)" : "रीडायरेक्ट विधि आज़माएं (मोबाइल के लिए बेहतर)"}
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
