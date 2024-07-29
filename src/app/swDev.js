
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function determineAppServerKey() {
  const vapidKeys = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  return urlBase64ToUint8Array(vapidKeys);
}

export default function swDev() {
  const convertedVapidKey = determineAppServerKey();
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    const registerServiceWorker = () => {
      const swUrl = `${process.env.NEXT_PUBLIC_URL}/sw.js`;
      console.log("Service Worker URL:", swUrl);
      navigator.serviceWorker
        .register(swUrl)
        .then(async (registration) => {
          console.warn("Service Worker Registered", registration);

          // Ensure the service worker is active
          if (registration.active) {
            try {
              let subscription = await registration.pushManager.getSubscription();
              if (subscription === null) {
                console.log("No subscription detected, subscribing...");
                subscription = await registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: convertedVapidKey,
                });
                console.log("Subscribed successfully:", subscription);
              } else {
                console.log("Already subscribed:", subscription);
              }
            } catch (err) {
              console.error("Failed to subscribe to push notifications", err);
            }
          } else {
            console.log("Service worker not active yet.");
          }
        })
        .catch((err) => {
          console.error("Service Worker Registration Failed", err.message);
        });
    };

    if (document.readyState === "complete") {
      registerServiceWorker();
    } else {
      window.addEventListener("load", registerServiceWorker);
    }
  }
}
