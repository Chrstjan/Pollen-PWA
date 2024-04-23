import { myFetchData } from "../Utils/apiUtils.js";
import { getPollenData } from "./pollen.js";
import { createMap } from "./map.js";
import {
  defineStorage,
  saveLocationData,
  getSavedLocations,
} from "./localStorage.js";

defineStorage();

export const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      recivedPosition,
      showPositionError
    );
  } else {
    alert("Geolocation is not supported by this browser");
  }
};

export const getUserLocationName = async (lat, long) => {
  console.log(lat);
  console.log(long);

  const userLocEndpoint = `https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=65fbef1c16355178751609wmp6b195b`;
  const userLocationData = await myFetchData(userLocEndpoint);
  recivedLocationName(userLocationData);
  return userLocationData;
};

const recivedPosition = (position) => {
  const mapBtn = document.getElementById("map");
  //   console.log("latitude:" + position.coords.latitude);
  //   console.log("longitude:" + position.coords.longitude);

  getUserLocationName(position.coords.latitude, position.coords.longitude);
  getPollenData(position.coords.latitude, position.coords.longitude);
  mapBtn.addEventListener("click", () => {
    createMap(position.coords.latitude, position.coords.longitude);
  });
};

const showPositionError = (error) => {
  console.log(error.message);
};

const recivedLocationName = (locationName) => {
  console.log(locationName);
  console.log(locationName.address.town || locationName.address.city);

  saveLocationData(locationName.address || locationName.town); //.address.town || .address.city
};

export const buildLocations = () => {
  const locationContainer = document.getElementById("locationContainer");
  locationContainer.innerHTML = "";

  const locationContainerElm = document.createElement("div");
  locationContainerElm.classList.add("location");

  let savedLocalLocations = getSavedLocations();
  console.log(savedLocalLocations);

  let currentLocationElm = `
    <header>
      <h2>${
        savedLocalLocations.currentLocation.city ||
        savedLocalLocations.currentLocation.town ||
        savedLocalLocations.currentLocation.village ||
        savedLocalLocations.currentLocation.hamlet
      }</h2>
    </header>`;

  let locationsSelect = "<select>";
  let emptyOption = "<option></option>";
  locationsSelect += emptyOption;
  savedLocalLocations.locations.forEach((location) => {
    locationsSelect += `<option>${location.city || location.town}</option>`;
  });
  locationsSelect += "</select>";

  locationContainerElm.innerHTML += currentLocationElm;
  locationContainerElm.innerHTML += locationsSelect;
  locationContainer.appendChild(locationContainerElm);
};

buildLocations();
