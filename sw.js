// 家用進銷存 service worker : 離線可用 (程式檔快取 , 資料在 IndexedDB 不經過這裡)
const CACHE = 'homeinv-v18';
const FILES = ['./', './index.html', './manifest.json', './firebase-config.js', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// 先用網路取最新版 , 沒網路時用快取
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  // 雲端同步程式庫 (Firebase SDK , 固定版本) : 先用快取 , 離線也能開
  if (e.request.method === 'GET' && u.hostname === 'www.gstatic.com' && u.pathname.startsWith('/firebasejs/')) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
    })));
    return;
  }
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
