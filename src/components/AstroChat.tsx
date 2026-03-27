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
      placeholder: "Ask about your future, career, or love...",
      welcome: `Hello ${userProfile.name}, I am your celestial guide. How can I help you today?`,
    },
    hi: {
      placeholder: "अपने भविष्य, करियर या प्रेम के बारे में पूछें...",
      welcome: `नमस्ते ${userProfile.name}, मैं आपका खगोलीय मार्गदर्शक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?`,
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

  const handleRetry = () => {
    if (messages.length > 1) {
      const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
      if (lastUserMsg) {
        setInput(lastUserMsg.text);
        // Remove the last error message if it exists
        setMessages(prev => {
          const newMsgs = [...prev];
          if (newMsgs[newMsgs.length - 1].role === "model" && 
              (newMsgs[newMsgs.length - 1].text.includes("cloudy") || newMsgs[newMsgs.length - 1].text.includes("धुंधले"))) {
            newMsgs.pop();
          }
          return newMsgs;
        });
      }
    }
  };

  return (
    <div className="glass flex flex-col h-[600px] w-full max-w-2xl mx-auto overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
        <div className="p-2 bg-gold/20 rounded-full">
          <Sparkles size={20} className="text-gold" />
        </div>
        <div>
          <h3 className="font-serif gold-text">Astro Chat</h3>
          <p className="text-[10px] opacity-60 uppercase tracking-widest">Personalized Guidance</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-gold text-mystic-900 rounded-tr-none"
                    : "bg-white/10 text-white rounded-tl-none"
                }`}
              >
                {msg.text}
                {msg.role === "model" && (msg.text.includes("cloudy") || msg.text.includes("धुंधले")) && (
                  <button 
                    onClick={handleRetry}
                    className="mt-2 text-[10px] underline block hover:text-gold transition-colors"
                  >
                    {language === "en" ? "Retry" : "पुनः प्रयास करें"}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none">
              <Loader2 size={16} className="animate-spin text-gold" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white/5 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={l.placeholder}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-gold outline-none transition-all text-sm"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="p-2 bg-gold text-mystic-900 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
