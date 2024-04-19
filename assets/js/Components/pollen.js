//GLOBALS
import { myFetchData } from "../Utils/apiUtils.js";
import { definePollenStorage } from "./localStorage.js";
import { buildLocations } from "./userLocation.js";

definePollenStorage();

const pollenContainer = document.getElementById("app");

let currentData = [];
let filteredHourlyData = [];

export const getPollenData = async (lat, long) => {
  console.log("Pollen!!");
  const endpoint = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${long}&current=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=Europe%2FBerlin&forecast_days=1`;
  const pollenData = await myFetchData(endpoint);
  //  console.log(pollenData);
  recivedPollenData(pollenData);
};

//Sorting pollen data into hours & current
const recivedPollenData = (pollenData) => {
  console.log(pollenData);

  currentData.push(pollenData.current);

  console.log(currentData);

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

  console.log(hourData);

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

  //Build current pollen view
  buildCurrentPollen(currentData);
};

//#region creating settings checkbox
const createRetardedCheckboxes = () => {
  pollenContainer.innerHTML = "";

  let checkboxParentContainer = document.createElement("div");
  checkboxParentContainer.classList.add("checkboxes-container");

  let settingsHeader = `<header class="settings"><h2>Mine Allergier</h2></header>`;

  checkboxParentContainer.innerHTML += settingsHeader;
  // Iterate over each pollen type
  Object.keys(filteredHourlyData[0]).forEach((pollenType) => {
    // Skip iteration if the current key is 'time' or 'formattedTime'
    if (
      pollenType === "time" ||
      pollenType === "formattedTime" ||
      pollenType === "interval"
    )
      return;

    // **Declare included here**
    let included = filteredHourlyData[0].hasOwnProperty(pollenType);

    if (included) {
      let checkboxContainer = document.createElement("span");
      checkboxContainer.classList.add("pollen-container");
      // Create a p tag for the current pollen type
      let pTag = document.createElement("p");
      pTag.textContent = pollenType.replace("_pollen", "");
      checkboxContainer.appendChild(pTag);

      // Add a checkbox for each pollen type
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = pollenType;
      checkbox.classList.add("pollen-checkbox");
      checkbox.setAttribute("data-pollen", pollenType);
      // Get saved state from local storage or default to true if not found
      let myPollen = JSON.parse(localStorage.getItem("myPollen")) || {};
      checkbox.checked = myPollen[pollenType] === false ? false : true;
      checkboxContainer.appendChild(checkbox);

      checkboxParentContainer.appendChild(checkboxContainer);

      pollenContainer.appendChild(checkboxParentContainer);

      // Add event listener to save checkbox state
      checkbox.addEventListener("change", (event) => {
        const isChecked = event.target.checked;
        const pollenType = event.target.getAttribute("data-pollen");
        saveCheckboxState(pollenType, isChecked);
      });
    }
  });
};

//#endregion creating settings checkbox

//Saving checkboxes states to local storage
const saveCheckboxState = (pollenType, isChecked) => {
  const myPollen = JSON.parse(localStorage.getItem("myPollen")) || {};
  myPollen[pollenType] = isChecked;
  localStorage.setItem("myPollen", JSON.stringify(myPollen));
};

//#region building current pollen
const buildCurrentPollen = (pollen) => {
  if (!pollen || pollen.length === 0) {
    console.error("pollenDataArray is empty");
    return; // Exit the function if no data
  }

  console.log(pollen);

  pollenContainer.innerHTML = "";
  const pollenHeader = `<header class="pollen-header"><h2>Current Pollen</h2></header>`;
  pollenContainer.innerHTML += pollenHeader;

  // Iterate over each pollen type
  Object.keys(pollen[0]).forEach((pollenType) => {
    // Skip iteration if the current key is 'time' or 'formattedTime'
    if (
      pollenType === "time" ||
      pollenType === "formattedTime" ||
      pollenType === "interval"
    )
      return;

    // **Declare included here**
    let included = pollen[0].hasOwnProperty(pollenType);

    if (included) {
      // Create a figure for the current pollen type (if data is included)
      let pollenFigure = document.createElement("figure");
      pollenFigure.classList.add("current-pollen-figure", pollenType);
      pollenFigure.addEventListener("click", () => {
        hourlyPollenCallback(pollenType);
      });

      // Building hourly pollen data on figure click
      let figCaption = document.createElement("figcaption");
      figCaption.classList.add("current-pollen");
      let header = document.createElement("header");
      let h3 = document.createElement("h3");
      h3.textContent = pollenType.replace("_pollen", "");
      header.appendChild(h3);
      figCaption.appendChild(header);

      // Iterate over hourly data to populate
      pollen.forEach((currentPollen) => {
        let span = document.createElement("span");
        let p2 = document.createElement("div");
        p2.classList.add("pollen-amount-box");
        p2.textContent = currentPollen[pollenType];

        // Set background color based on pollen amount
        let pollenAmount = parseInt(currentPollen[pollenType]);
        let pollenClass = "";
        if (pollenAmount <= 10) {
          pollenClass = "low-pollen";
        } else if (pollenAmount >= 20 && pollenAmount < 60) {
          pollenClass = "mid-pollen";
        } else if (pollenAmount >= 60) {
          pollenClass = "high-pollen";
        }
        p2.classList.add(pollenClass);

        span.appendChild(p2);
        figCaption.appendChild(span);
      });

      // Append figcaption to figure
      pollenFigure.appendChild(figCaption);

      // Append the figure to the container
      pollenContainer.appendChild(pollenFigure);

      // Add display style based on saved checkbox state
      let myPollen = JSON.parse(localStorage.getItem("myPollen")) || {};
      if (myPollen[pollenType] === false) {
        pollenFigure.style.display = "none";
      } else {
        pollenFigure.style.display = "block";
      }
    }
  });
};

//#endregion building current pollen

//#region building hourly pollen
const buildHourlyPollen = (pollen) => {
  if (!pollen || pollen.length === 0) {
    console.error("pollenDataArray is empty");
    return; // Exit the function if no data
  }

  pollenContainer.innerHTML = "";
  const pollenHeader = `<header class="pollen-header"><h2>Hourly Pollen</h2></header>`;
  pollenContainer.innerHTML += pollenHeader;

  // Iterate over each pollen type
  Object.keys(pollen[0]).forEach((pollenType) => {
    // Skip iteration if the current key is 'time' or 'interval'
    if (
      pollenType === "time" ||
      pollenType === "formattedTime" ||
      pollenType === "interval"
    )
      return;

    let included = pollen[0].hasOwnProperty(pollenType);

    if (included) {
      // Creates a figure for the hourly pollen type
      let pollenFigure = document.createElement("figure");
      pollenFigure.classList.add("pollen-figure", pollenType);
      pollenFigure.addEventListener("click", currentCallback);

      let header = document.createElement("header");
      let h3 = document.createElement("h3");
      h3.textContent = pollenType.replace("_pollen", "");
      header.appendChild(h3);
      pollenFigure.appendChild(header);

      let figcaption = document.createElement("figcaption");

      // Iterate over hourly data to populate
      pollen.forEach((currentPollen) => {
        let span = document.createElement("span");
        let p1 = document.createElement("p");
        p1.textContent = currentPollen.formattedTime;
        let p2 = document.createElement("div");
        p2.classList.add("pollen-amount-box");
        p2.textContent = currentPollen[pollenType];

        // Set background color based on pollen amount
        let pollenAmount = parseInt(currentPollen[pollenType]);
        if (pollenAmount <= 10) {
          p2.classList.add("low-pollen");
        } else if (pollenAmount >= 20 && pollenAmount < 60) {
          p2.classList.add("mid-pollen");
        } else if (pollenAmount >= 60) {
          p2.classList.add("high-pollen");
        }

        span.appendChild(p1);
        span.appendChild(p2);
        figcaption.appendChild(span);
      });

      // Appending figcaption to figure
      pollenFigure.appendChild(figcaption);

      // Appending the figure to the container
      pollenContainer.appendChild(pollenFigure);

      // Add display style based on saved checkbox state
      let myPollen = JSON.parse(localStorage.getItem("myPollen")) || {};
      if (myPollen[pollenType] === false) {
        pollenFigure.style.display = "none";
      } else {
        pollenFigure.style.display = "block";
      }
    }
  });
};

//#endregion building hourly pollen

//Building settings
const settingsIcon = document.getElementById("settings");
settingsIcon.addEventListener("click", () => {
  createRetardedCheckboxes();
});

//Building the current
const homeBtn = document.getElementById("home");
homeBtn.addEventListener("click", () => {
  buildCurrentPollen(currentData);
  buildLocations();
  console.log("Building pollen!");
});

//Building the hourly pollen view on figure click
const hourlyPollenCallback = (pollenType) => {
  console.log(pollenType);

  console.log(filteredHourlyData);

  /*
  Filtering so that it only get's the key value pairs of the pollen type name recived from buildCurrentPollen
  Also includes the time & formattedTime key values
  Makes a new array with data objects from the current hour & 4 hours forward 
  */
  const clickedPollenData = filteredHourlyData.map((data) => ({
    time: data.time,
    formattedTime: data.formattedTime,
    [pollenType]: data[pollenType],
  }));
  console.log(clickedPollenData);
  // Build the clicked hourly pollen figure
  buildHourlyPollen(clickedPollenData);
};

//Building the current pollen view on figure click
const currentCallback = () => {
  buildCurrentPollen(currentData);
};
