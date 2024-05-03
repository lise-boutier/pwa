"use strict";

// Set files to cache
const version = "v10";
const cacheName = `myapp-${version}`;
const filesToCache = [
    "index.html",
    "style.css",
    "main.js"
];

// When installing the service worker,
// Cache assets.
self.addEventListener("insall", (e) => {
    console.log("[SW] install");
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        console.log("[SW] Caching files");
        await cache.addAll(filesToCache);
    })());
});

// Add a middleware to fetch,
// Use cache to avoid network usage.
// And cache cacheable requests.
self.addEventListener("fetch", (e) => {
    console.log("[SW] Fetching url: ", e.request.url);
    e.respondWith((async () => {
        // If the request has already been cached,
        // return the cached value to avoid unnecessary
        // network usage.
        const match = await caches.match(e.request);
        if (match) return match;

        const response = await fetch(e.request);
        if (e.request.url.toString().endsWith("sw.js")) return response;
        if (e.request.method !== "GET") return response;
        if (["no-cache", "no-store"].includes(e.request.headers.get("Cache-Control"))) return response;

        if (filesToCache.includes(e.request.url.pathname)) {
            const cache = await caches.open(cacheName);
            console.log("[SW] Caching new resource: ", e.request.url);
            cache.put(e.request, response.clone());
        }

        return response;
    })())
});

// Remove old content from cache to free disk space
self.addEventListener("activate", (e) => {
    e.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => {
            if (key === cacheName) return;
            return caches.delete(key);
        }));
    })());
});

// // Fetch XKCD daily
self.addEventListener("periodicsync", (event) => {
    if (event.tag === "get-latest-comic") {
        event.waitUntil(fetchAndCacheLatestComic())
    }
});

async function fetchAndCacheLatestComic() {
    const weatherData = await fetch("https://my.meteoblue.com/packages/basic-1h_basic-day?apikey=NKEu72fl3RBGYLHT&lat=50.5012&lon=2.69708&asl=27&format=json").then(r => r.json());
    return weatherData;
}

self.addEventListener('fetch', function(e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    var dataUrl = 'https://my.meteoblue.com/packages/basic-1h_basic-day?apikey=NKEu72fl3RBGYLHT&lat=50.5012&lon=2.69708&asl=27&format=json';
    if (e.request.url.indexOf(dataUrl) === 0) {
      e.respondWith(
        fetch(e.request)
          .then(function(response) {
            return caches.open(dataCacheName).then(function(cache) {
              cache.put(e.request.url, response.clone());
              console.log('[ServiceWorker] Fetched&Cached Data');
              return response;
            });
          })
      );
    } else {
      e.respondWith(
        caches.match(e.request).then(function(response) {
          return response || fetch(e.request);
        })
      );
    }
  });



        