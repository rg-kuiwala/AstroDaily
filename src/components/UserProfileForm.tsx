import React, { useState } from "react";
import { UserProfile, Language, ZodiacSign } from "../types";
import { ZODIAC_SIGNS } from "../constants";
import { motion } from "framer-motion";
import { User, Calendar, Clock, MapPin, Sparkles } from "lucide-react";

interface UserProfileFormProps {
  language: Language;
  onSave: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({
  language,
  onSave,
  initialProfile,
}) => {
  const [formData, setFormData] = useState<UserProfile>(
    initialProfile || {
      uid: "",
      name: "",
      dob: "",
      tob: "",
      pob: "",
      sign: "Aries",
      notificationsEnabled: false,
    }
  );

  const labels = {
    en: {
      title: "Your Celestial Profile",
      name: "Full Name",
      dob: "Date of Birth",
      tob: "Time of Birth",
      pob: "Place of Birth",
      sign: "Zodiac Sign",
      save: "Save Profile",
    },
    hi: {
      title: "आपकी खगोलीय प्रोफाइल",
      name: "पूरा नाम",
      dob: "जन्म तिथि",
      tob: "जन्म का समय",
      pob: "जन्म स्थान",
      sign: "राशि",
      save: "प्रोफ़ाइल सहेजें",
    },
  };

  const l = labels[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="glass p-8 w-full max-w-lg mx-auto space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif gold-text">{l.title}</h2>
        <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent w-full mt-2"></div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs opacity-60 flex items-center gap-2">
            <User size={14} /> {l.name}
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-gold outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs opacity-60 flex items-center gap-2">
              <Calendar size={14} /> {l.dob}
            </label>
            <input
              type="date"
              required
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-gold outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs opacity-60 flex items-center gap-2">
              <Clock size={14} /> {l.tob}
            </label>
            <input
              type="time"
              required
              value={formData.tob}
              onChange={(e) => setFormData({ ...formData, tob: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-gold outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs opacity-60 flex items-center gap-2">
            <MapPin size={14} /> {l.pob}
          </label>
          <input
            type="text"
            required
            value={formData.pob}
            onChange={(e) => setFormData({ ...formData, pob: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-gold outline-none transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs opacity-60 flex items-center gap-2">
            <Sparkles size={14} /> {l.sign}
          </label>
          <select
            value={formData.sign}
            onChange={(e) =>
              setFormData({ ...formData, sign: e.target.value as ZodiacSign })
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-gold outline-none transition-all appearance-none"
          >
            {ZODIAC_SIGNS.map((s) => (
              <option key={s.id} value={s.id} className="bg-mystic-900">
                {language === "en" ? s.id : s.hindiName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gold text-mystic-900 font-bold py-3 rounded-xl hover:scale-[1.02] transition-all active:scale-95"
      >
        {l.save}
      </button>
    </motion.form>
  );
};
