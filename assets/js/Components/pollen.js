import { myFetchData } from "../Utils/apiUtils.js";

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

export const getPollenData = async (lat, long) => {
  console.log("Pollen!!");
  const endpoint = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${long}&current=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=Europe%2FBerlin&forecast_days=1`;
  const pollenData = await myFetchData(endpoint);
  //   console.log(pollenData);
  recivedPollenData(pollenData);
};

const recivedPollenData = (pollenData) => {
  console.log(pollenData);
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
};
