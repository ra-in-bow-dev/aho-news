const cacheName = 'ahonews-' + Date.now();
const filesToCache = [
  './',
  'manifest.json',
  'index.html',
  // 'global.css',
  'bundle.css',
  'bundle.css.map',
  'bundle.js',
  'bundle.js.map',
  'icons/favicon.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
        .filter(thisCacheName => thisCacheName.startsWith('nostalgia') && thisCacheName !== cacheName)
        .map(thisCacheName => caches.delete(thisCacheName))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(matches => {
      const newData = fetch(event.request)
      .then(async response => {
        const cache = await caches.open(cacheName)
        cache.put(event.request, response.clone())
        return response
      })
      .catch(error => {
        console.warn('Could not fetch', event.request, error);
      });
      return matches || newData;
    })
  );
});