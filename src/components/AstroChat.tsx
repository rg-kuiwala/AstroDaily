import React, { useState, useRef, useEffect } from "react";
import { UserProfile, Language, ChatMessage } from "../types";
import { chatWithAstrologer } from "../services/geminiService";
import { Send, User, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AstroChatProps {
  userProfile: UserProfile;
  language: Language;
}

export const AstroChat: React.FC<AstroChatProps> = ({ userProfile, language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const labels = {
    en: {
      placeholder: "Ask about your destiny...",
      welcome: `Greetings ${userProfile.name}. I am your celestial guide. What secrets of the cosmos shall we explore today?`,
    },
    hi: {
      placeholder: "अपने भाग्य के बारे में पूछें...",
      welcome: `नमस्ते ${userProfile.name}, मैं आपका खगोलीय मार्गदर्शक हूँ। आज हम ब्रह्मांड के किन रहस्यों की खोज करेंगे?`,
    },
  };

  const l = labels[language];

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "model", text: l.welcome }]);
    }
  }, [language]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await chatWithAstrologer(userProfile, [...messages, userMsg], language);
      setMessages((prev) => [...prev, { role: "model", text: response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { 
          role: "model", 
          text: language === "en" 
            ? "The stars are cloudy. Please check your connection or try again." 
            : "तारे धुंधले हैं। कृपया अपना कनेक्शन जांचें या पुनः प्रयास करें।" 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-dark flex flex-col h-[650px] w-full max-w-2xl mx-auto overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border-white/5">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-3xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gold/10 rounded-2xl border border-gold/20">
            <Sparkles size={24} className="text-gold" />
          </div>
          <div>
            <h3 className="font-serif text-xl gold-text tracking-tight">Celestial Oracle</h3>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[10px] opacity-40 uppercase tracking-[0.2em] font-bold">Connected to the Stars</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-gradient-to-b from-transparent to-black/20">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-lg ${
                  msg.role === "user"
                    ? "bg-gold text-mystic-950 rounded-tr-none font-medium"
                    : "bg-white/5 text-white/90 rounded-tl-none border border-white/5 backdrop-blur-md"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/5 p-4 rounded-3xl rounded-tl-none border border-white/5">
              <div className="flex gap-1.5">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-gold/40 rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-gold/40 rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-gold/40 rounded-full" />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-6 bg-black/40 border-t border-white/5 backdrop-blur-3xl">
        <div className="flex gap-3 items-center bg-white/5 p-2 rounded-2xl border border-white/10 focus-within:border-gold/50 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={l.placeholder}
            className="flex-1 bg-transparent px-4 py-2 outline-none text-sm placeholder:text-white/20"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-3 bg-gold text-mystic-950 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 shadow-lg"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
