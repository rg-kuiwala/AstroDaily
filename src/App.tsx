import React, { useState, useEffect } from "react";
import { ZodiacGrid } from "./components/ZodiacGrid";
import { HoroscopeCard } from "./components/HoroscopeCard";
import { LanguageToggle } from "./components/LanguageToggle";
import { AdPlaceholder } from "./components/AdPlaceholder";
import { UserProfileForm } from "./components/UserProfileForm";
import { AstroChat } from "./components/AstroChat";
import { NotificationSettings } from "./components/NotificationSettings";
import { Auth } from "./components/Auth";
import { NotificationManager } from "./services/NotificationManager";
import { Language, ZodiacSign, HoroscopeData, UserProfile } from "./types";
import { fetchHoroscope } from "./services/geminiService";
import { auth, db, onAuthStateChanged, doc, setDoc, onSnapshot, signOut } from "./firebase";
import type { User } from "./firebase";
import { Moon, Star, Bell, Compass, Info, User as UserIcon, MessageCircle, Sparkles, LogOut, Loader2 } from "lucide-react";
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
    if (!user) {
      NotificationManager.getInstance().stop();
      return;
    }
    
    NotificationManager.getInstance().init(user.uid);
    
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (snapshot.exists()) {
        setUserProfile(snapshot.data() as UserProfile);
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const [horoscopeCache, setHoroscopeCache] = useState<Record<string, HoroscopeData>>({});

  const [error, setError] = useState<string | null>(null);

  const handleSignSelect = async (sign: ZodiacSign) => {
    console.log("Zodiac Sign Selected:", sign);
    setSelectedSign(sign);
    const cacheKey = `${sign}-${language}-${period}`;
    
    if (horoscopeCache[cacheKey]) {
      console.log("Using cached horoscope for:", cacheKey);
      setHoroscope(horoscopeCache[cacheKey]);
      setError(null);
      return;
    }

    setLoading(true);
    setHoroscope(null);
    setError(null);
    
    try {
      console.log("Fetching fresh horoscope for:", sign);
      const data = await fetchHoroscope(sign, language, period);
      console.log("Horoscope Fetch Success:", data);
      setHoroscope(data);
      setHoroscopeCache(prev => ({ ...prev, [cacheKey]: data }));
    } catch (err) {
      console.error("Error in handleSignSelect:", err);
      setError(language === "en" ? "The stars are currently hidden. Please try again in a moment." : "तारे वर्तमान में छिपे हुए हैं। कृपया कुछ क्षण बाद पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  // Notification Simulation
  useEffect(() => {
    if (userProfile?.notificationsEnabled && typeof Notification !== "undefined" && Notification.permission === "granted") {
      console.log("Notifications are enabled. Scheduling daily update simulation...");
      // Simulate a notification after 10 seconds for demo purposes
      const timer = setTimeout(() => {
        new Notification("NamsteAstro Daily Update", {
          body: `Good morning ${userProfile.name}! Your ${userProfile.sign} horoscope is ready.`,
          icon: "/favicon.ico"
        });
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [userProfile]);

  const handleSaveProfile = async (profile: UserProfile) => {
    if (!user) return;
    setLoading(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        ...profile,
        uid: user.uid,
        updatedAt: new Date().toISOString(),
      });
      // The onSnapshot listener will update userProfile state
      setView("chat");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-[#05020a]">
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
    <div className="min-h-screen flex flex-col relative selection:bg-gold/30 bg-mystic-950">
      <div className="atmosphere" />
      
      {/* Header */}
      <header className="p-6 md:p-12 flex flex-col md:flex-row items-center justify-between max-w-[1600px] mx-auto w-full gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-2 group cursor-pointer"
          onClick={() => setView("horoscope")}
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gold rounded-full text-mystic-900 shadow-2xl group-hover:rotate-[360deg] transition-transform duration-1000">
              <Moon size={24} />
            </div>
            <span className="micro-label text-gold">Celestial Guidance</span>
          </div>
          <h1 className="editorial-title gold-text">
            {l.title}
          </h1>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <LanguageToggle language={language} onToggle={setLanguage} />
          
          <nav className="flex glass p-1.5 rounded-full shadow-2xl">
            <button
              onClick={() => setView("horoscope")}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                view === "horoscope" ? "bg-gold text-mystic-900 shadow-lg" : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              {l.general}
            </button>
            <button
              onClick={() => setView(user ? (userProfile ? "chat" : "profile") : "chat")}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                view === "chat" || view === "profile" ? "bg-gold text-mystic-900 shadow-lg" : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              {l.personalized}
            </button>
          </nav>

          {user && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView("profile")}
                className={`p-3 glass rounded-full transition-all ${view === 'profile' ? 'bg-gold text-mystic-900' : 'hover:bg-white/10 text-white/60'}`}
                title={l.profile}
              >
                <UserIcon size={18} />
              </button>
              <button
                onClick={handleLogout}
                className="p-3 glass rounded-full hover:bg-red-500/20 transition-all text-red-400"
                title={l.logout}
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 md:px-12 py-8">
        <AnimatePresence mode="wait">
          {view === "horoscope" && (
            <motion.div
              key="general-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-16"
            >
              {!selectedSign ? (
                <div className="space-y-12">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-12">
                    <div className="max-w-2xl">
                      <span className="micro-label mb-4 block">Step 01</span>
                      <h2 className="text-6xl md:text-8xl font-display leading-none uppercase tracking-tighter">
                        {l.selectSign}
                      </h2>
                    </div>
                    <div className="flex gap-2 opacity-20">
                      <Star size={16} />
                      <Star size={16} />
                      <Star size={16} />
                    </div>
                  </div>
                  <ZodiacGrid
                    language={language}
                    onSelect={handleSignSelect}
                    selectedSign={selectedSign}
                  />
                  <AdPlaceholder type="native" className="mt-20" />
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/10 pb-12">
                    <button
                      onClick={() => setSelectedSign(null)}
                      className="group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-all"
                    >
                      <div className="p-2 border border-white/20 rounded-full group-hover:bg-white group-hover:text-black transition-all">
                        <Compass size={16} />
                      </div>
                      {l.back}
                    </button>

                    <div className="flex glass p-1.5 rounded-full shadow-2xl">
                      {(["daily", "weekly", "monthly"] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPeriod(p)}
                          className={`px-8 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                            period === p ? "bg-gold text-mystic-900 shadow-lg" : "opacity-40 hover:opacity-100"
                          }`}
                        >
                          {l[p]}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {(horoscope || loading || error) && (
                    <div className="space-y-12">
                      {error && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="glass p-12 text-center text-red-400 border-red-500/20 max-w-3xl mx-auto"
                        >
                          <p className="text-xl font-serif italic mb-8">"{error}"</p>
                          <button 
                            onClick={() => selectedSign && handleSignSelect(selectedSign)}
                            className="px-12 py-4 bg-gold text-mystic-900 font-bold rounded-full uppercase tracking-widest text-xs transition-all hover:scale-105"
                          >
                            Consult the Stars Again
                          </button>
                        </motion.div>
                      )}
                      {(horoscope || loading) && (
                        <HoroscopeCard data={horoscope!} language={language} loading={loading} />
                      )}
                    </div>
                  )}
                  <AdPlaceholder type="banner" className="mt-12" />
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
              className="space-y-8"
            >
              <UserProfileForm
                language={language}
                onSave={handleSaveProfile}
                initialProfile={userProfile}
              />
              {userProfile && (
                <div className="max-w-2xl mx-auto">
                  <NotificationSettings userProfile={userProfile} language={language} />
                </div>
              )}
            </motion.div>
          )}

          {view === "chat" && user && (
            <motion.div
              key="chat-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {!userProfile ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-gold" size={40} />
                  <p className="text-white/40 animate-pulse uppercase tracking-widest text-xs">Aligning with your stars...</p>
                </div>
              ) : (
                <>
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
                </>
              )}
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
