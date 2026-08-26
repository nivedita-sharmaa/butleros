// // Runs independently of any open tab — this is what lets notifications
// // appear even when the app is fully closed.

// self.addEventListener("push", (event) => {
//   let data = {};

//   try {
//     data = event.data ? event.data.json() : {};
//   } catch (err) {
//     data = { title: "ButlerOS", body: "You have a new notification" };
//   }

//   const title = data.title || "ButlerOS";
//   const options = {
//     body: data.body || "",
//     icon: "/icons.svg",
//     badge: "/icons.svg",
//     tag: data.tag || "butleros-notification",
//     requireInteraction: data.requireInteraction || false,
//     data: {
//       url: data.url || "/",
//     },
//   };

//   event.waitUntil(self.registration.showNotification(title, options));
// });

// // Clicking the notification focuses/opens the app at the relevant page
// // self.addEventListener("notificationclick", (event) => {
// //   event.notification.close();

// //   const targetUrl = event.notification.data?.url || "/";

// //   event.waitUntil(
// //     clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
// //       for (const client of clientList) {
// //         if (client.url.includes(self.location.origin) && "focus" in client) {
// //           client.navigate(targetUrl);
// //           return client.focus();
// //         }
// //       }
// //       if (clients.openWindow) {
// //         return clients.openWindow(targetUrl);
// //       }
// //     })
// //   );
// // });
// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();

//   const targetUrl = event.notification.data?.url || "/";

//   event.waitUntil(
//     clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
//       // If an existing window is open, focus it AND force reload
//       for (const client of clientList) {
//         if (client.url.includes(self.location.origin) && "focus" in client) {
//           return client.focus().then(() => {
//             // navigate + reload ensures useEffect actually re-runs
//             return client.navigate(targetUrl).then((navigatedClient) => {
//               if (navigatedClient && "postMessage" in navigatedClient) {
//                 navigatedClient.postMessage({ type: "RELOAD_APP" });
//               }
//             });
//           });
//         }
//       }

//       // No existing window — open a brand new one (always a fresh load)
//       if (clients.openWindow) {
//         return clients.openWindow(targetUrl);
//       }
//     })
//   );
// });

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// self.addEventListener("push", (event) => {
//   let data = {};
//   try {
//     data = event.data ? event.data.json() : {};
//   } catch (err) {
//     data = { title: "ButlerOS", body: "You have a new notification" };
//   }

//   const title = data.title || "ButlerOS";
//   const options = {
//     body: data.body || "",
//     icon: "/icons.svg",
//     badge: "/icons.svg",
//     tag: data.tag || "butleros-notification",
//     requireInteraction: data.requireInteraction || false,
//     data: { url: data.url || "/" },
//   };

//   event.waitUntil(self.registration.showNotification(title, options));
// });

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (err) {
    data = { title: "ButlerOS", body: "You have a new notification" };
  }

  const isUrgent = data.tag === "quick-call";

  const title = data.title || "ButlerOS";
  const options = {
    body: data.body || "",
    icon: "/icons.svg",
    badge: "/icons.svg",
    tag: data.tag || "butleros-notification",
    requireInteraction: data.requireInteraction || false,
    vibrate: isUrgent
      ? [300, 100, 300, 100, 300, 100, 500] // sharp triple-buzz, repeated — reads as urgent
      : [200, 100, 200], // gentle double-buzz — standard notification
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus().then(() => {
            return client.navigate(targetUrl).then((navigatedClient) => {
              if (navigatedClient && "postMessage" in navigatedClient) {
                navigatedClient.postMessage({ type: "RELOAD_APP" });
              }
            });
          });
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});