//makes sure service worker is supported
export const serviceWorker = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register('../../../sw.js')
        .then(reg => console.log(`Service Worker: Registered: ${reg}`))
        .catch(err => console.log(`Service Worker: Error: ${err}`))
    });
  }
}
