import { myFetchData } from "../Utils/apiUtils.js";
import { definePollenStorage } from "./localStorage.js";

definePollenStorage();

const pollenContainer = document.getElementById("app");

// let pollenDataArray = [];
let filteredHourlyData = [];

export const getPollenData = async (lat, long) => {
  console.log("Pollen!!");
  const endpoint = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${long}&current=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=Europe%2FBerlin&forecast_days=1`;
  const pollenData = await myFetchData(endpoint);
  //  console.log(pollenData);
  recivedPollenData(pollenData);
};

let selectedPollenTypes = []; //Used for storing selected pollens (potentially unused now)

const recivedPollenData = (pollenData) => {
  console.log(pollenData);
  let viewData = [];
  viewData.push(pollenData.current);

  //  console.log(viewData);

  let timeStamps = pollenData.hourly.time;

  let hourData = [];

  timeStamps.map((timestamp, index) => {
    let hourDataObjects = {};
    //Used for getting the current hour and minute for a new time format
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
    //Creating new data objects for each hourly pollen
    //Each data object get the pollen type and the corresponding timestamp from the 24 hour array
    hourDataObjects.time = timestamp;
    //Time format for view code
    hourDataObjects.formattedTime = formattedTime;
    hourDataObjects.alder_pollen = pollenData.hourly.alder_pollen[index];
    hourDataObjects.birch_pollen = pollenData.hourly.birch_pollen[index];
    hourDataObjects.grass_pollen = pollenData.hourly.grass_pollen[index];
    hourDataObjects.mugwort_pollen = pollenData.hourly.mugwort_pollen[index];
    hourDataObjects.olive_pollen = pollenData.hourly.olive_pollen[index];
    hourDataObjects.ragweed_pollen = pollenData.hourly.ragweed_pollen[index];

    hourData.push(hourDataObjects);
  });

  //Gets the current date
  const curDay = new Date();
  //Gets the current Hour
  const curHour = curDay.getHours();
  console.log(curHour);

  filteredHourlyData = hourData.filter((data) => {
    const dataTime = new Date(data.time);
    const dataHour = dataTime.getHours();
    return dataHour >= curHour && dataHour <= curHour + 4;
  });

  //Build pollen view
  buildPollen(filteredHourlyData);
};

// console.log(pollenDataArray);

const buildPollen = (pollen) => {
  if (!pollen || pollen.length === 0) {
    console.error("pollenDataArray is empty");
    return; // Exit the function if no data
  }

  console.log(pollen);

  pollenContainer.innerHTML = "";
  // Iterate over each pollen type
  Object.keys(pollen[0]).forEach((pollenType) => {
    // Skip iteration if the current key is 'time'
    if (pollenType === "time") return;

    // **Declare included here**
    let included = pollen[0].hasOwnProperty(pollenType);

    if (included) {
      // Create a figure for the current pollen type (if data is included)
      let pollenFigure = `<figure>
        <header>
          <h3>${pollenType.replace("_pollen", "")}</h3>
        </header>
        <figcaption>`;

      // Iterate over hourly data to populate
      pollen.forEach((currentPollen) => {
        pollenFigure += `
          <span>
            <p>${currentPollen.formattedTime}</p>
            <p>${currentPollen[pollenType]}</p> 
          </span>`;
      });

      // Close figure tag
      pollenFigure += `
        </figcaption>
      </figure>`;

      // Append the figure to the container
      pollenContainer.innerHTML += pollenFigure;
    }
  });
};

// Filter data based on selected pollen types (commented out as selectedPollenTypes might be unused)
// function filterDataByCheckbox(data, selectedTypes) {
//   return data.filter((dataObject) => {
//     // Check if all selected pollen types are present in the current data object
//     return selectedTypes.every((pollenType) =>
//       dataObject.hasOwnProperty(pollenType)
//     );
//   });
// }

// function updateData(data) {
//   // Use filterDataByCheckbox for filtering based on selectedPollenTypes
//   return filterDataByCheckbox(data, selectedPollenTypes);
// }

// Building the settings view (removed)

//Building the pollen view (same as before)
const homeBtn = document.getElementById("home");
homeBtn.addEventListener("click", () => {
  buildPollen(filteredHourlyData);
  console.log("Building pollen!");
});
