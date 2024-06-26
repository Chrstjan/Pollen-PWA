import { definePinsStorage, saveLocationPins, getSavedPins } from './localStorage.js';

definePinsStorage();

import { getUserLocationName, buildLocations } from "./userLocation.js";

const mapContainer = document.getElementById("app");

let map;
let curLat;
let curLong;
let savedLocationName;
let savedLocationNameArray = [];

export const createMap = (lat, long) => {
  mapContainer.innerHTML = "";

  // Temp map container
  const mapDiv = document.createElement("div");
  mapDiv.setAttribute("id", "map");
  mapDiv.style.width = "100%";
  mapDiv.style.height = "70vh"; // Adjust the height as needed

  // Append the map div to the mapContainer
  mapContainer.appendChild(mapDiv);

  let savedPinsLocation = getSavedPins();
  console.log(savedPinsLocation[1]);

  console.log(`map cords: ${lat}, ${long}`);

  map = L.map("map").setView([lat, long], 13);

  console.log(map);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([lat, long]).addTo(map).bindPopup("Current location").openPopup();

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
        clickedLocationName.city || clickedLocationName.town
      }`
    ) // Using lat and lng variables
    .openOn(map);

  let newMarker = L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      `Set location: Lat: ${lat}, Long: ${lng}, Location: ${
        clickedLocationName.city || clickedLocationName.town
      }`
    )
    .openPopup();

    console.log(newMarker);
    saveLocationPins(newMarker);

  curLat = lat;
  curLong = lng;
};

