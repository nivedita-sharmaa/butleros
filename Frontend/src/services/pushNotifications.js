const VAPID_PUBLIC_KEY = "BGaySC-UONh90xMC_ttpLw_pLPZAIwF9OiHJD269hrWuWTEX5gZ88Oqe205Fq6Zpi2sh4R6E6DUv_Ml03gOuTxQ"; // from Phase 1

const API_URL = import.meta.env.VITE_API_URL;

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export async function registerPushNotifications() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.log("Push notifications not supported in this browser");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log("Service worker registered:", registration);

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      console.log("New push subscription created");
    }

    // Send this subscription to the backend, tied to the logged-in user
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`${API_URL}/push/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ subscription }),
    });

    console.log("Push subscription saved to backend");
  } catch (error) {
    console.error("Push registration error:", error);
  }
}