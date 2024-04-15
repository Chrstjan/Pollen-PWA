import { myFetchData } from "../Utils/apiUtils.js";
import { getPollenData } from "./pollen.js";

const saveLocationData = (locationData) => {
  let mySerializedData = JSON.stringify(locationData);
  localStorage.setItem("myLocations", mySerializedData);
};

const defineStorage = () => {
  let myLocations = localStorage.getItem("myLocations");

  if (!myLocations) {
    let newMyLocations = {
      locations: [],
    };

    saveLocationData(newMyLocations);
  } else {
    let myData = JSON.parse(myLocations);
  }
};

defineStorage();

const getSavedLocations = () => {
  let myLocationStr = localStorage.getItem("myLocations");
  let myLocationsData = JSON.parse(myLocationStr);
  return myLocationsData;
};

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
};

const showPositionError = (error) => {
  console.log(error.message);
};

const recivedLocationName = (locationName) => {
  console.log(locationName);
  console.log(locationName.address.town);

  saveLocationData(locationName.address); //.address.town || .address.city
};
