var CACHE_VERSION = 1;

// Shorthand identifier mapped to specific versioned cache.
var CURRENT_CACHES = {
  model: "model-cache-v" + CACHE_VERSION,
  lib: "lib-cache-v" + CACHE_VERSION,
  font: "font-cache-v" + CACHE_VERSION,
};

self.addEventListener("install", function (event) {
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
    return CURRENT_CACHES[key];
  });

  // Active worker won't be treated as activated until promise resolves successfully.
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (expectedCacheNames.indexOf(cacheName) == -1) {
            console.log("Deleting out of date cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

const isUrlCacheable = (url) => {
  if (url.includes(".bin")) return "model";
  if (url.includes("unpkg.com")) return "lib";
  if (url.includes("cdnjs.cloudflare.com")) return "lib";
  if (url.includes("gstatic.com")) return "font";
  return false;
};

async function handleRequest(event) {
  const cacheType = isUrlCacheable(event.request.url);

  if (!cacheType) {
    return self.fetch(event.request);
  }

  //console.log("[SW] get " + event.request.url);

  const cache = await caches.open(CURRENT_CACHES[cacheType]);

  const cacheMatch = await cache.match(event.request);

  if (cacheMatch) {
    //console.log("[SW] get from cache: " + event.request.url);
    return cacheMatch;
  }

  const response = await self.fetch(event.request);

  return cache.put(event.request, response);
}

self.addEventListener("fetch", async function (event) {
  event.respondWith(handleRequest(event));
});
