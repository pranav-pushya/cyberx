// sw.js — CyberX Service Worker for Offline App Caching
const CACHE_NAME = 'cyberx-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './learn.html',
  './tools.html',
  './attacks.html',
  './commands.html',
  './ports.html',
  './quiz.html',
  './ai-chat.html',
  './roadmap.html',
  './notes.html',
  './ctf.html',
  './osint.html',
  './css/style.css',
  './js/main.js',
  './js/api.js',
  './js/hud.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[CyberX SW] Pre-caching static assets for offline use');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[CyberX SW] Clearing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Never cache API calls (Groq AI calls require live network)
  if (event.request.url.includes('/api/') || event.request.url.includes('groq.com')) {
    return;
  }

  // Network-First with Cache fallback strategy
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
