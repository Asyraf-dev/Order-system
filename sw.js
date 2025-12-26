self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open("restaurant-v1").then(c=>
      c.addAll(["dashboard.html","auth.html"])
    )
  );
});

self.addEventListener("fetch",e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request))
  );
});
