import { definePinsStorage, saveLocationPins, getSavedPins } from './localStorage.js';
definePinsStorage();
import { getUserLocationName, buildLocations } from "./userLocation.js";
import { getPollenData } from './pollen.js';

const mapContainer = document.getElementById("app");

let map;
let curLat;
let curLong;

export const createMap = async (lat, long) => {
  mapContainer.innerHTML = "";

  // Temp map container
  const mapDiv = document.createElement("div");
  mapDiv.setAttribute("id", "map");
  mapDiv.style.width = "100%";
  mapDiv.style.height = "70vh"; // Adjust the height as needed

  // Append the map div to the mapContainer
  mapContainer.appendChild(mapDiv);

  console.log(`map cords: ${lat}, ${long}`);

  const currentLocation = await getUserLocationName(lat, long);

  const currentLocationName = currentLocation.address;

  console.log(currentLocationName);


  map = L.map("map").setView([lat, long], 13);

  console.log(map);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([lat, long]).addTo(map).bindPopup(
    `Current location:
     ${
       currentLocationName.city ||
       currentLocationName.town ||
       currentLocationName.village ||
       currentLocationName.hamlet
      }`
    ).openPopup();

  curLat = lat;
  curLong = long;

  //Calling function on map click
  map.on("click", onMapClick);
};

let popup = L.popup();

export const onMapClick = async ({ latlng }) => {
  const { lat, lng } = latlng; // Destructuring assignment to extract lat and lng

  const clickedLocation = await getUserLocationName(lat, lng);

  const clickedLocationName = clickedLocation.address;

  buildLocations();

  console.log(clickedLocationName);

  popup
    .setLatLng(latlng)
    .setContent(
      `You clicked the map at ${lat}, ${lng}, Location: ${
        clickedLocationName.city ||
        clickedLocationName.town ||
        clickedLocationName.village ||
        clickedLocationName.hamlet
      }`
    ) // Using lat and lng variables
    .openOn(map);

  let newMarker = L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      `Set location: Lat: ${lat}, Long: ${lng}, Location: ${
        clickedLocationName.city || 
        clickedLocationName.town ||
        clickedLocationName.village ||
        clickedLocationName.hamlet
      }`
    )
    .openPopup();

    console.log(newMarker);
    saveLocationPins(clickedLocationName, latlng);

  curLat = lat;
  curLong = lng;
};

