let cacheData = "NextAppV1";

this.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheData).then((cache) => {
      cache.addAll([
        "/_next/static/chunks/main-app.js?v=1722200047851",
        "/_next/static/css/app/layout.css?v=1722200279366",
        "/_next/static/chunks/webpack.js?v=1722200279366",
        "/_next/static/chunks/app-pages-internals.js",
        "/_next/static/chunks/app/page.js",
        "/_next/static/chunks/app/layout.js",
        "/favicon.ico",
        "/next.svg",
        "/",
      ]);
    })
  );
});

this.addEventListener("fetch", (event) => {
  console.log(event.request.url);
  if (
    event.request.url ===
    `${process.env.NEXT_PUBLIC_URL}/_next/static/chunks/app/page.js`
  ) {
    event.waitUntil(
      this.registration.showNotification("Hello", {
        body: "Hello from push notification",
      })
    );
  }
  if (!navigator.onLine) {
    event.respondWith(
      caches.match(event.request).then((res) => {
        if (res) {
          return res;
        }
        // Fetch from network and cache the response
        return fetch(event.request).then((networkResponse) => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }

          let responseToCache = networkResponse.clone();

          caches.open(cacheData).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        });
      })
    );
  }
});

// Listen for push events
self.addEventListener("push", (event) => {
  const data = event.data.json();
  const title = data.title || "Default title";
  const body = data.body || "Default body";

  if (
    event.request.url ===
    "http://localhost:3000/_next/static/chunks/app/page.js"
  ) {
    event.waitUntil(
      self.registration.showNotification(title, {
        body: body,
      })
    );
  }
});

// Listen for messages from client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
    });
  }
});
