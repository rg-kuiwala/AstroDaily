import React, { useState, useEffect } from "react";
import { ZodiacGrid } from "./components/ZodiacGrid";
import { HoroscopeCard } from "./components/HoroscopeCard";
import { LanguageToggle } from "./components/LanguageToggle";
import { AdPlaceholder } from "./components/AdPlaceholder";
import { UserProfileForm } from "./components/UserProfileForm";
import { AstroChat } from "./components/AstroChat";
import { StarfieldBackground } from "./components/StarfieldBackground";
import { Auth } from "./components/Auth";
import { Language, ZodiacSign, HoroscopeData, UserProfile } from "./types";
import { fetchHoroscope } from "./services/geminiService";
import { auth, db, onAuthStateChanged, doc, setDoc, onSnapshot, signOut } from "./firebase";
import type { User } from "./firebase";
import { Moon, Star, Bell, Compass, Info, User as UserIcon, MessageCircle, Sparkles, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [view, setView] = useState<"horoscope" | "chat" | "profile">("horoscope");
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Auth Listener
  useEffect(() => {
    console.log("Initializing Auth Listener...");
    
    // Fallback timeout: If auth doesn't respond in 5 seconds, show the UI anyway
    const timeout = setTimeout(() => {
      console.warn("Auth listener timed out. Forcing ready state.");
      setIsAuthReady(true);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser ? "User logged in" : "No user");
      clearTimeout(timeout);
      setUser(currentUser);
      setIsAuthReady(true);
      if (!currentUser) {
        setUserProfile(null);
        if (view !== "horoscope") setView("horoscope");
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // Firestore Profile Listener
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (snapshot.exists()) {
        setUserProfile(snapshot.data() as UserProfile);
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const handleSignSelect = async (sign: ZodiacSign) => {
    setSelectedSign(sign);
    setLoading(true);
    try {
      const data = await fetchHoroscope(sign, language, period);
      setHoroscope(data);
    } catch (error) {
      console.error("Error fetching horoscope:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (profile: UserProfile) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), {
        ...profile,
        uid: user.uid,
        updatedAt: new Date().toISOString(),
      });
      setView("chat");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Re-fetch if language or period changes
  useEffect(() => {
    if (selectedSign) {
      handleSignSelect(selectedSign);
    }
  }, [language, period]);

  const labels = {
    en: {
      title: "NamasteAstro",
      subtitle: "Your daily celestial guidance",
      selectSign: "Choose Your Zodiac Sign",
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      notifications: "Notify Me",
      back: "Back to Signs",
      personalized: "Personalized",
      general: "General",
      chat: "Astro Chat",
      profile: "My Profile",
      logout: "Logout",
    },
    hi: {
      title: "नमस्तेएस्ट्रो",
      subtitle: "आपका दैनिक खगोलीय मार्गदर्शन",
      selectSign: "अपनी राशि चुनें",
      daily: "दैनिक",
      weekly: "साप्ताहिक",
      monthly: "मासिक",
      notifications: "सूचना प्राप्त करें",
      back: "राशियों पर वापस जाएं",
      personalized: "व्यक्तिगत",
      general: "सामान्य",
      chat: "एस्ट्रो चैट",
      profile: "मेरी प्रोफ़ाइल",
      logout: "लॉगआउट",
    },
  };

  const l = labels[language];

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8">
        <StarfieldBackground />
        <div className="atmosphere" />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-6 bg-gold rounded-3xl text-mystic-900 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
        >
          <Moon size={48} className="animate-pulse" />
        </motion.div>
        <div className="flex flex-col items-center gap-4">
          <p className="text-white/60 text-sm font-medium tracking-[0.2em] uppercase animate-pulse">
            Reading the Stars
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-gold/30">
      <StarfieldBackground />
      <div className="atmosphere" />
      
      {/* Header */}
      <header className="p-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <div className="p-3 bg-gold rounded-2xl text-mystic-900 shadow-lg group-hover:rotate-12 transition-transform duration-500">
            <Moon size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight gold-text">
              {l.title}
            </h1>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-medium">
              Celestial Insights
            </p>
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          <LanguageToggle language={language} onToggle={setLanguage} />
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView("profile")}
                className={`p-3 glass rounded-2xl transition-all ${view === 'profile' ? 'bg-gold text-mystic-900' : 'hover:bg-white/10 text-white/60'}`}
                title={l.profile}
              >
                <UserIcon size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="p-3 glass rounded-2xl hover:bg-red-500/20 transition-all text-red-400"
                title={l.logout}
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setView("chat")}
              className="px-8 py-3 bg-gold text-mystic-900 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] text-sm"
            >
              {l.personalized}
            </button>
          )}
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto w-full px-8 mb-12">
        <div className="flex glass p-1.5 rounded-3xl w-fit shadow-xl">
          <button
            onClick={() => setView("horoscope")}
            className={`px-8 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all flex items-center gap-3 ${
              view === "horoscope" ? "bg-gold text-mystic-900 shadow-lg" : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <Compass size={18} /> {l.general}
          </button>
          <button
            onClick={() => setView(user ? (userProfile ? "chat" : "profile") : "chat")}
            className={`px-8 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all flex items-center gap-3 ${
              view === "chat" || view === "profile" ? "bg-gold text-mystic-900 shadow-lg" : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <Sparkles size={18} /> {l.personalized}
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-4">
        <AnimatePresence mode="wait">
          {view === "horoscope" && (
            <motion.div
              key="general-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {!selectedSign ? (
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <h2 className="text-4xl font-serif gold-text">{l.selectSign}</h2>
                    <div className="flex justify-center gap-2 opacity-40">
                      <Star size={12} />
                      <Star size={12} />
                      <Star size={12} />
                    </div>
                  </div>
                  <ZodiacGrid
                    language={language}
                    onSelect={handleSignSelect}
                    selectedSign={selectedSign}
                  />
                  <AdPlaceholder type="native" className="mt-12" />
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <button
                      onClick={() => setSelectedSign(null)}
                      className="text-sm flex items-center gap-2 opacity-60 hover:opacity-100 transition-all"
                    >
                      <Compass size={16} />
                      {l.back}
                    </button>

                    <div className="flex glass p-1 rounded-full">
                      {(["daily", "weekly", "monthly"] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPeriod(p)}
                          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                            period === p ? "bg-gold text-mystic-900" : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          {l[p]}
                        </button>
                      ))}
                    </div>
                  </div>
                  {horoscope && (
                    <HoroscopeCard data={horoscope} language={language} loading={loading} />
                  )}
                  <AdPlaceholder type="banner" className="mt-8" />
                </div>
              )}
            </motion.div>
          )}

          {(view === "chat" || view === "profile") && !user && (
            <motion.div
              key="auth-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Auth language={language} />
            </motion.div>
          )}

          {view === "profile" && user && (
            <motion.div
              key="profile-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <UserProfileForm
                language={language}
                onSave={handleSaveProfile}
                initialProfile={userProfile}
              />
            </motion.div>
          )}

          {view === "chat" && user && userProfile && (
            <motion.div
              key="chat-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center max-w-2xl mx-auto">
                <h2 className="text-2xl font-serif gold-text flex items-center gap-2">
                  <MessageCircle size={24} /> {l.chat}
                </h2>
                <button
                  onClick={() => setView("profile")}
                  className="text-xs opacity-60 hover:opacity-100 flex items-center gap-1"
                >
                  <UserIcon size={12} /> {l.profile}
                </button>
              </div>
              <AstroChat userProfile={userProfile} language={language} />
              <AdPlaceholder type="banner" />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-8 border-t border-white/5 mt-12 bg-mystic-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 text-xs">
          <p>© 2026 NamasteAstro. All celestial rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold transition-colors flex items-center gap-1">
              <Info size={12} /> Privacy Policy
            </a>
            <a href="#" className="hover:text-gold transition-colors flex items-center gap-1">
              <Info size={12} /> Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
