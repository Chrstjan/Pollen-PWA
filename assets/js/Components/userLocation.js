import { myFetchData } from "../Utils/apiUtils.js";
import { getPollenData } from "./pollen.js";
// import { createMap } from "./map.js";

function defineStorage() {
  let myLocations = localStorage.getItem("myLocations");

  if (!myLocations) {
    let newMyLocations = {
      currentLocation: {},
      locations: [],
    };

    saveLocationData(newMyLocations);
  } else {
    let myData = JSON.parse(myLocations);
  }
}

defineStorage();

function saveLocationData(locationData) {
  let storedData = JSON.parse(localStorage.getItem("myLocations")) || {
    currentLocation: {},
    locations: [],
  };

  // Check if locationData is already in the format of currentLocation and locations
  if (locationData.currentLocation && locationData.locations) {
    // Push just the address data to the locations array
    storedData.locations.push(locationData.currentLocation);
  } else {
    // Check if the address already exists in the locations array
    const index = storedData.locations.findIndex(
      (item) => item.address === locationData.address
    );

    if (index !== -1) {
      // If the address exists, update it
      storedData.locations[index] = locationData;
    } else {
      // If the address doesn't exist, push it
      storedData.locations.push(locationData);
    }

    // Also update the currentLocation with the latest address data
    storedData.currentLocation = locationData;
  }

  // Serialize and save the updated data to localStorage
  localStorage.setItem("myLocations", JSON.stringify(storedData));
}

function getSavedLocations() {
  let myLocationStr = localStorage.getItem("myLocations");
  let myLocationsData = JSON.parse(myLocationStr);
  return myLocationsData;
}

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

const getUserLocationName = async (lat, long) => {
  console.log(lat);
  console.log(long);

  const userLocEndpoint = `https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=65fbef1c16355178751609wmp6b195b`;
  const userLocationData = await myFetchData(userLocEndpoint);
  recivedLocationName(userLocationData);
};

const recivedPosition = (position) => {
  //   console.log("latitude:" + position.coords.latitude);
  //   console.log("longitude:" + position.coords.longitude);

  getUserLocationName(position.coords.latitude, position.coords.longitude);
  getPollenData(position.coords.latitude, position.coords.longitude);
  // createMap(position.coords.latitude, position.coords.longitude);
};

const showPositionError = (error) => {
  console.log(error.message);
};

const recivedLocationName = (locationName) => {
  console.log(locationName);
  console.log(locationName.address.town);

  saveLocationData(locationName.address); //.address.town || .address.city
};

const buildLocations = () => {
  const locationContainer = document.getElementById("locationContainer");
  const locationContainerElm = document.createElement("div");
  locationContainerElm.classList.add("location");

  let savedLocalLocations = getSavedLocations();
  console.log(savedLocalLocations);

  let currentLocationElm = `
    <header>
      <h2>${savedLocalLocations.currentLocation.town}</h2>
    </header>`;

  let locationsSelect = "<select>";
  let emptyOption = "<option></option>";
  locationsSelect += emptyOption;
  savedLocalLocations.locations.forEach((location) => {
    locationsSelect += `<option>${location.town}</option>`;
  });
  locationsSelect += "</select>";

  locationContainerElm.innerHTML += currentLocationElm;
  locationContainerElm.innerHTML += locationsSelect;
  locationContainer.appendChild(locationContainerElm);
};

buildLocations();
