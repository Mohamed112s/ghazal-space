const C = "gz-v2";
const cfg = (() => { try { return JSON.parse(new URL(self.location.href).searchParams.get("c")); } catch (e) { return null; } })();
if (cfg && cfg.apiKey) {
  try {
    importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js", "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");
    firebase.initializeApp(cfg);
    firebase.messaging();
  } catch (e) {}
}
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(["./", "manifest.webmanifest", "icon-192.png"])).catch(() => {})); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)).catch(() => {}); return res; })
    .catch(() => caches.match(r).then(m => m || caches.match("./"))));
});
