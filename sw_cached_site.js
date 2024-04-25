//This caches everything

//name of the cache version
const cacheName = "v2";

// calling the install event
self.addEventListener("install", (e) => {
    console.log("Service Worker: Installed");
})

// calling the activate event
self.addEventListener("activate", (e) => {
    console.log("Service Worker: Activated");
    //Remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName) {
                        console.log("Service Worker: Clearing Old Cache");
                        return caches.delete(cache); 
                    }
                })
            )
        })
    );
});

//Call fetch event
self.addEventListener("fetch", (e) => {
    console.log("Service Worker: Fetching");
    //Checks if the live site is available else load from the cache
    e.respondWith(
        fetch(e.request)
          .then(res => {
            //Make a clone copy of response
            const resClone = res.clone();
            //Open cache
            caches
              .open(cacheName)
              .then(cache => {
                // Add response to cache
                cache.put(e.request, resClone);
              });
              return res;
          })
          .catch(err => caches.match(e.request).then(res => res))
    )
});