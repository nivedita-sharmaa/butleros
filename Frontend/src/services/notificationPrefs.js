// src/utils/notificationPrefs.js
//
// Small shared module so notification preferences (set on the Notifications
// page) can be read from anywhere in the app — in particular by
// NotificationPopup.jsx, which is the global listener that shows alerts
// no matter which page the user is on.

// Preferences are namespaced per user id, so switching accounts on the same
// browser doesn't leak one person's settings into another's.
function storageKey(userId) {
  return `notificationPrefs_${userId}`;
}

const DEFAULT_PREFS = {
  newTaskAlerts: true,
  alertTone: true,
  emailNotifications: true,
  browserNotifications: true,
  highPriorityOnly: false,
};

export function getPrefs(userId) {
  if (!userId) return DEFAULT_PREFS;

  try {
    const stored = JSON.parse(localStorage.getItem(storageKey(userId)));
    return { ...DEFAULT_PREFS, ...(stored || {}) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePrefs(userId, prefs) {
  if (!userId) return;
  localStorage.setItem(storageKey(userId), JSON.stringify(prefs));
}

// Heuristic only — checks the notification's own text, since there's no
// dedicated priority field on the notification record itself.
export function isHighPriority(notification) {
  const text = `${notification.title || ""} ${notification.message || ""}`.toLowerCase();
  return text.includes("high") || text.includes("urgent");
}

// Plays a short two-tone chime using the Web Audio API — no audio file needed.
export function playAlertTone() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      console.log("Web Audio API not supported in this browser");
      return;
    }

    const ctx = new AudioCtx();

    const scheduleTones = () => {
      const now = ctx.currentTime;

      [880, 1174.66].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.value = freq;

        const start = now + i * 0.12;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.3, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.3);
      });

      // Close the context after the tones finish playing, to avoid leaking
      // AudioContext instances if the popup fires often.
      setTimeout(() => ctx.close(), 500);
    };

    // IMPORTANT: browsers create AudioContext in a "suspended" state until
    // there's been direct user interaction. Since alerts are often triggered
    // by a WebSocket event (not a click), we must explicitly resume() first
    // or no sound will play — silently, with no error.
    if (ctx.state === "suspended") {
      ctx.resume().then(scheduleTones).catch((err) => {
        console.log("AudioContext resume failed (likely blocked until the page is clicked at least once):", err);
      });
    } else {
      scheduleTones();
    }
  } catch (error) {
    console.log("Alert tone playback error:", error);
  }
}

// Requests permission for desktop notifications. Call this from a real user
// gesture (like toggling a checkbox) — browsers ignore permission requests
// that aren't triggered by user interaction.
export function requestBrowserPermission() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

export function showBrowserNotification(notification) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  try {
    new Notification(notification.title || "ButlerOS", {
      body: notification.message || "",
    });
  } catch (error) {
    console.log("Browser notification error:", error);
  }
}