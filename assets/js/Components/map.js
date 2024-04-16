const mapBtn = document.getElementById("map");

// export const createMap = (lat, long) => {
//   let map = L.map("map").setView([lat, long], 13);

//   L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     maxZoom: 19,
//     attribution:
//       '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//   }).addTo(map);
// };

// mapBtn.addEventListener("click", createMap);

let map = L.map("map").fitWorld();

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);
