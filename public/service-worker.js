/* eslint-disable no-console */




workbox.setConfig({
  debug: true,
});

workbox.core.setCacheNameDetails({
  prefix: 'd4'
})

const LATEST_VERSION = 'v17'

self.addEventListener('activate', (event) => {
  // console.log(`%c ${LATEST_VERSION} `, 'background: #ddd; color: #0000ff')
  if (caches) {
    caches.keys().then((arr) => {
      arr.forEach((key) => {
        if (key.indexOf('d4-precache') < -1) {
          caches.delete(key).then(() => {
            // console.log(`%c Cleared ${key}`,'background: #333; color: #ff0000')
          })
        } else {
          caches.open(key).then((cache) => {
            cache.match('version').then((res) => {
              if (!res) {
                cache.put('version', new Response(LATEST_VERSION, {
                  status: 200,
                  statusText: LATEST_VERSION
                }))
              } else if (res.statusText !== LATEST_VERSION) {
                caches.delete(key).then(() => {
                    // console.log(`%c Cleared Cache ${LATEST_VERSION}`,'background: #333; color: #ff0000')
                })
              } else {
                // console.log(`%c Great you have the latest version ${LATEST_VERSION}`,'background: #333; color: #00ff00')
              }
            })
          })
        }
      })
    })
  }
})

workbox.skipWaiting()
workbox.clientsClaim()

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.suppressWarnings()
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})
// workbox.precaching.precacheAndRoute(['service-worker.js','/','index.html'], {});



workbox.precaching.precacheAndRoute([]);

self.addEventListener('install', function (event) {
  // console.log('Service Worker Install...');
  // pre cache a load of stuff:
  event.waitUntil(
    caches.open(CURRENT_CACHES.prefetch)
    .then(function (cache) {
      return cache.addAll([
          '/index.html',
          '/service-worker.js'
        ])
        .then(function () {
          // console.log('Caches added');
        })
        .catch(function (error) {
          console.error('Error on installing');
          console.error(error);
        });
    })
  )
});

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate(),
);

// workbox.routing.registerRoute(
//   new RegExp('https://newsapi.org/v2/top-headlines(.*)'),
//   workbox.strategies.networkFirst({
//     cacheName: 'news-api',
//   }),
// );

workbox.googleAnalytics.initialize();

workbox.routing.registerRoute(
  new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
  workbox.strategies.cacheFirst({
    cacheName: 'googleapis',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
      }),
    ],
  }),
);


// Cache the Google Fonts stylesheets with a stale while revalidate strategy.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  }),
);

// Cache the Google Fonts webfont files with a cache first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  }),
);