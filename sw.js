// sw.js — CyberX Service Worker for Offline App Caching
const CACHE_NAME = 'cyberx-cache-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/pages/learn/learn.html',
  '/pages/learn/roadmap.html',
  '/pages/learn/quiz.html',
  '/pages/tools/tools.html',
  '/pages/tools/commands.html',
  '/pages/tools/osint.html',
  '/pages/tools/ports.html',
  '/pages/security/attacks.html',
  '/pages/security/ctf.html',
  '/pages/ai/ai-chat.html',
  '/pages/ai/notes.html',
  '/css/style.css',
  '/js/main.js',
  '/js/api.js',
  '/js/hud.js',
  '/js/sync.js',
  '/manifest.json',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png'
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
