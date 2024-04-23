//This caches what's in the cacheAssets array

//name of the cache version
const cacheName = "v1";

//Array with what we want to cache
const cacheAssets = [
    "index.html",
    "./assets/css/base.css",
    "./assets/css/header.css",
    "./assets/css/main.css",
    "./assets/css/footer.css",
    "./assets/js/bundles.js"
];

// calling the install event
self.addEventListener("install", (e) => {
    console.log("Service Worker: Installed");
    e.waitUntil(
        caches
          .open(cacheName)
          .then(cache => {
            console.log("Service Worker: Caching Files");
            cache.addAll(cacheAssets);
          })
          .then(() => self.skipWaiting())
    );
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
    //Checks if the live site is avaiable else load from the cache
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});