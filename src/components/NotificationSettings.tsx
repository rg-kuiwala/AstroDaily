import React, { useState, useEffect } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { db, doc, updateDoc } from "../firebase";
import { UserProfile, Language } from "../types";

interface NotificationSettingsProps {
  userProfile: UserProfile;
  language: Language;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ userProfile, language }) => {
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  const labels = {
    en: {
      title: "Daily Notifications",
      description: "Receive your personalized horoscope every morning.",
      enable: "Enable Notifications",
      disable: "Disable Notifications",
      granted: "Notifications are active",
      denied: "Notifications are blocked by browser",
      request: "Allow in Browser",
    },
    hi: {
      title: "दैनिक सूचनाएं",
      description: "हर सुबह अपना व्यक्तिगत राशिफल प्राप्त करें।",
      enable: "सूचनाएं सक्षम करें",
      disable: "सूचनाएं अक्षम करें",
      granted: "सूचनाएं सक्रिय हैं",
      denied: "सूचनाएं ब्राउज़र द्वारा अवरुद्ध हैं",
      request: "ब्राउज़र में अनुमति दें",
    },
  };

  const l = labels[language];

  const requestPermission = async () => {
    if (typeof Notification === "undefined") return;
    
    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === "granted") {
      updateNotificationPreference(true);
    }
  };

  const updateNotificationPreference = async (enabled: boolean) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", userProfile.uid), {
        notificationsEnabled: enabled,
      });
    } catch (error) {
      console.error("Error updating notification preference:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${userProfile.notificationsEnabled ? 'bg-gold/20 text-gold' : 'bg-white/5 text-white/20'}`}>
            {userProfile.notificationsEnabled ? <Bell size={24} /> : <BellOff size={24} />}
          </div>
          <div>
            <h3 className="font-serif text-lg gold-text">{l.title}</h3>
            <p className="text-xs text-white/40">{l.description}</p>
          </div>
        </div>
        
        <button
          onClick={() => updateNotificationPreference(!userProfile.notificationsEnabled)}
          disabled={loading || permission === "denied"}
          className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
            userProfile.notificationsEnabled 
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
              : "bg-gold text-mystic-900 hover:scale-105"
          } disabled:opacity-30`}
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : (userProfile.notificationsEnabled ? l.disable : l.enable)}
        </button>
      </div>

      {permission !== "granted" && (
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest text-white/40">
            {permission === "denied" ? l.denied : "Browser permission required"}
          </p>
          {permission === "default" && (
            <button
              onClick={requestPermission}
              className="text-[10px] uppercase tracking-widest text-gold hover:underline"
            >
              {l.request}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
