//#region saving user location
export function defineStorage() {
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

// export function saveLocationData(locationData) {
//   let storedData = JSON.parse(localStorage.getItem("myLocations")) || {
//     currentLocation: {},
//     locations: [],
//   };

//   if (locationData.currentLocation && locationData.locations) {
//     storedData.locations.push(locationData.currentLocation);
//   } else {
//     const index = storedData.locations.findIndex(
//       (item) =>
//         item.cityOrTown === locationData.cityOrTown &&
//         item.houseOrRoadNumber === locationData.houseOrRoadNumber
//     );

//     if (index !== -1) {
//       storedData.locations[index] = locationData;
//     } else {
//       storedData.locations.push(locationData);
//     }

//     storedData.currentLocation = locationData;
//   }

//   // Serialize and save the updated data to localStorage
//   localStorage.setItem("myLocations", JSON.stringify(storedData));
// }

export function saveLocationData(locationData) {
  let storedData = JSON.parse(localStorage.getItem("myLocations")) || {
    currentLocation: {},
    locations: [],
  };

  if (locationData.currentLocation && locationData.locations) {
    storedData.locations.push(locationData.currentLocation);
  } else {
    const foundIndex = storedData.locations.findIndex(
      (item) =>
        item.cityOrTown === locationData.cityOrTown &&
        item.houseOrRoadNumber === locationData.houseOrRoadNumber
    );

    if (foundIndex !== -1) {
      // If the data object already exists in the locations array, update it
      storedData.locations[foundIndex] = locationData;
    } else {
      // If the data object doesn't exist, push it to the locations array
      storedData.locations.push(locationData);
    }

    // Update the currentLocation with the latest address data
    storedData.currentLocation = locationData;
  }

  // Serialize and save the updated data to localStorage
  localStorage.setItem("myLocations", JSON.stringify(storedData));
}

export function getSavedLocations() {
  let myLocationStr = localStorage.getItem("myLocations");
  let myLocationsData = JSON.parse(myLocationStr);
  return myLocationsData;
}
//#endregion saving user location

//#region saving user pollen selections
export function definePollenStorage() {
  let myPollen = localStorage.getItem("myPollen");

  if (!myPollen) {
    let newMyPollen = {
      selectedPollen: [],
    };

    savePollenData(newMyPollen);
  }
}

export function savePollenData(pollenData) {
  let storedData = JSON.parse(localStorage.getItem("myPollen")) || {
    selectedPollen: [],
  };

  // Push the pollen data into the selectedPollen array
  storedData.selectedPollen.push(pollenData);

  // Serialize and save the updated data to localStorage
  localStorage.setItem("myPollen", JSON.stringify(storedData));
}
//#endregion saving user pollen selections
