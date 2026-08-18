/* Learno - service worker
   Objectif : que l'application s'ouvre et fonctionne sans reseau.
   Strategie : reseau d'abord pour la page, cache d'abord pour les
   ressources fixes. Le cache est purge a chaque nouvelle version.   */
const V = "learno-v4";
const FIXE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(V)
      .then(c => c.addAll(FIXE).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const url = new URL(r.url);

  /* on ne met jamais en cache les appels a la base : la progression
     doit toujours venir du serveur, jamais d'une copie perimee */
  if (url.hostname.endsWith("supabase.co")) return;

  /* la page principale : reseau d'abord, cache en secours */
  if (r.mode === "navigate" || url.pathname.endsWith("index.html") || url.pathname.endsWith("/")) {
    e.respondWith(
      fetch(r)
        .then(rep => {
          const copie = rep.clone();
          caches.open(V).then(c => c.put(r, copie)).catch(() => {});
          return rep;
        })
        .catch(() => caches.match(r).then(m => m || caches.match("./index.html")))
    );
    return;
  }

  /* le reste : cache d'abord, puis reseau */
  e.respondWith(
    caches.match(r).then(m => m || fetch(r).then(rep => {
      if (rep && rep.status === 200 && (rep.type === "basic" || rep.type === "cors")) {
        const copie = rep.clone();
        caches.open(V).then(c => c.put(r, copie)).catch(() => {});
      }
      return rep;
    }).catch(() => m))
  );
});

/* un clic sur un rappel ouvre l'application plutot qu'un nouvel onglet */
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(l => {
      for (const c of l) if ("focus" in c) return c.focus();
      if (self.clients.openWindow) return self.clients.openWindow("./");
    })
  );
});
