// sw.js — CyberX Service Worker for Offline App Caching
const CACHE_NAME = 'cyberx-cache-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/learn.html',
  '/tools.html',
  '/attacks.html',
  '/commands.html',
  '/ports.html',
  '/quiz.html',
  '/ai-chat.html',
  '/roadmap.html',
  '/notes.html',
  '/ctf.html',
  '/osint.html',
  '/css/style.css',
  '/js/main.js',
  '/js/api.js',
  '/js/hud.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => console.warn('[CyberX SW] Pre-cache non-critical warning:', err));
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[CyberX SW] Deleting obsolete cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // NEVER cache dynamic env configs or API calls
  if (url.includes('env.json') || url.includes('/api/') || url.includes('groq.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Network-First strategy (always fresh from network, fallback to cache if offline)
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
