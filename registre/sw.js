/* Registre Maison Saint Sauveur : l'application reste disponible sans réseau. */
const V = "mss-registre-v7";
const SHELL = ["./", "index.html", "lib/supabase.js", "lib/591.supabase.js", "lib/qrcode.js", "cabellou.jpg", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-180.png", "catalogue.html", "lib/catalogue.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k.startsWith("mss-")).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (/\.(mp4|pdf)$/.test(u.pathname)) return;
  // Pages : réseau d'abord (nouvelle version), mémoire si pas de réseau
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(x => x.put("index.html", c)); return res; }).catch(() => caches.match("index.html")));
    return;
  }
  // Fichiers de l'application
  if (u.origin === location.origin) { e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(V).then(x => x.put(r, c)); } return res; }))); return; }
  // Visuels des œuvres et polices : gardés après la première consultation
  if (/\/storage\/v1\/object\/public\//.test(u.pathname) || /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) {
    e.respondWith(caches.open("mss-medias").then(c => c.match(r).then(m => { const net = fetch(r).then(res => { if (res.ok || res.type === "opaque") c.put(r, res.clone()); return res; }).catch(() => m); return m || net; })));
  }
});
