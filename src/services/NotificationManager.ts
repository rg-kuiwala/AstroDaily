import { db, doc, onSnapshot } from "../firebase";
import { UserProfile } from "../types";

export class NotificationManager {
  private static instance: NotificationManager;
  private unsubscribe: (() => void) | null = null;

  private constructor() {}

  static getInstance() {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  init(uid: string) {
    if (this.unsubscribe) this.unsubscribe();

    console.log("Initializing Notification Manager for:", uid);
    
    this.unsubscribe = onSnapshot(doc(db, "users", uid), (snapshot) => {
      if (snapshot.exists()) {
        const profile = snapshot.data() as UserProfile;
        if (profile.notificationsEnabled) {
          this.scheduleDailyUpdate(profile);
        }
      }
    });
  }

  private scheduleDailyUpdate(profile: UserProfile) {
    if (typeof Notification === "undefined" || Notification.permission !== "granted") {
      console.warn("Notifications not allowed in browser.");
      return;
    }

    console.log("Scheduling daily horoscope for:", profile.name);
    
    // In a real app, this would be handled by a service worker and a backend cron job.
    // For this demo, we'll simulate a notification check every hour.
    const checkInterval = 60 * 60 * 1000; // 1 hour
    
    const check = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Send notification at 8 AM
      if (hour === 8) {
        new Notification("NamsteAstro Daily Update", {
          body: `Good morning ${profile.name}! Your ${profile.sign} horoscope for today is ready.`,
          icon: "/favicon.ico",
          tag: "daily-horoscope"
        });
      }
    };

    // Run initial check
    check();
    
    // Set interval for future checks
    const intervalId = setInterval(check, checkInterval);
    
    // Cleanup logic would go here if this was a hook
  }

  stop() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}
