// Service Worker for CodeSmart PWA with Export/Import Feature
const CACHE_NAME = 'codesmart-lms-v2.2';
const RUNTIME_CACHE = 'codesmart-runtime-v2.2';
const FILES_CACHE = 'codesmart-files-v2.2';

// Files to cache on install
const PRECACHE_URLS = [
  '/index.html',
  '/src/css/index.css',
  '/src/css/module.css',
  '/src/css/admin.css',
  '/src/css/pwa.css',
  '/src/css/lms.css',
  '/src/js/index.js',
  '/src/js/auth.js',
  '/src/js/svm.js',
  '/src/js/pwa.js',
  '/src/js/export-import.js',
  '/src/data/database.js',
  '/src/images/JS-LOGO.png',
  '/src/pages/auth/login.html',
  '/src/pages/auth/register.html',
  '/src/pages/user/dashboard.html',
  '/src/pages/user/profile.html',
  '/src/pages/user/pretest.html',
  '/src/pages/modules/lms-user.html',
  '/src/pages/admin/dashboard.html',
  '/src/pages/assessor/dashboard.html',
  '/manifest.json',
  'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css',
  'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css',
  'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js',
  'https://unpkg.com/scrollreveal'
];

// Install event - cache files
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app shell...');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return cacheName.startsWith('codesmart-') &&
                   cacheName !== CACHE_NAME &&
                   cacheName !== RUNTIME_CACHE;
          })
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) &&
      !event.request.url.includes('boxicons') &&
      !event.request.url.includes('swiper') &&
      !event.request.url.includes('scrollreveal')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return caches.open(RUNTIME_CACHE).then(cache => {
        return fetch(event.request).then(response => {
          // Don't cache POST requests or non-successful responses
          if (event.request.method !== 'GET' || !response || response.status !== 200) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();
          cache.put(event.request, responseToCache);

          return response;
        }).catch(error => {
          console.log('Fetch failed; returning offline page instead.', error);

          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }

          throw error;
        });
      });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Background sync:', event.tag);

  if (event.tag === 'sync-pretest-results') {
    event.waitUntil(syncPretestResults());
  }
});

async function syncPretestResults() {
  // Implement sync logic here
  console.log('Syncing pretest results...');
}

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/src/images/icon-192x192.png',
    badge: '/src/images/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'codesmart-notification',
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'close', title: 'Close' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('CodeSmart', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handler for communication with main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE)
        .then(cache => cache.addAll(event.data.urls))
    );
  }
});
