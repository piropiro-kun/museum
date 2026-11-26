// Change the version number whenever any file is replaced.
const CACHE = 'museum-calendar-v1';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {cache: 'reload'})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('museum-calendar-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// saved copy first, so the app opens without a connection
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, {ignoreSearch: true});
    if (hit) return hit;
    try { return await fetch(e.request); }
    catch (err) { if (e.request.mode === 'navigate') return c.match('./index.html'); throw err; }
  }));
});
