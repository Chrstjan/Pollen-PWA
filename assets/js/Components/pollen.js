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

const createRetardedCheckboxes = () => {
  pollenContainer.innerHTML = "";
  // Iterate over each pollen type
  Object.keys(filteredHourlyData[0]).forEach((pollenType) => {
    // Skip iteration if the current key is 'time' or 'formattedTime'
    if (pollenType === "time" || pollenType === "formattedTime") return;

    // **Declare included here**
    let included = filteredHourlyData[0].hasOwnProperty(pollenType);

    if (included) {
      // Create a p tag for the current pollen type
      let pTag = document.createElement("p");
      pTag.textContent = pollenType.replace("_pollen", "");
      pollenContainer.appendChild(pTag);

      // Add a checkbox for each pollen type
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = pollenType;
      checkbox.classList.add("pollen-checkbox");
      checkbox.setAttribute("data-pollen", pollenType);
      // Get saved state from local storage or default to true if not found
      let myPollen = JSON.parse(localStorage.getItem("myPollen")) || {};
      checkbox.checked = myPollen[pollenType] === false ? false : true;
      pollenContainer.appendChild(checkbox);

      // Add event listener to save checkbox state
      checkbox.addEventListener("change", (event) => {
        const isChecked = event.target.checked;
        const pollenType = event.target.getAttribute("data-pollen");
        saveCheckboxState(pollenType, isChecked);
      });
    }
  });
};

const saveCheckboxState = (pollenType, isChecked) => {
  const myPollen = JSON.parse(localStorage.getItem("myPollen")) || {};
  myPollen[pollenType] = isChecked;
  localStorage.setItem("myPollen", JSON.stringify(myPollen));
};

const buildPollen = (pollen) => {
  if (!pollen || pollen.length === 0) {
    console.error("pollenDataArray is empty");
    return; // Exit the function if no data
  }

  console.log(pollen);

  pollenContainer.innerHTML = "";
  // Iterate over each pollen type
  Object.keys(pollen[0]).forEach((pollenType) => {
    // Skip iteration if the current key is 'time' or 'formattedTime'
    if (pollenType === "time" || pollenType === "formattedTime") return;

    // **Declare included here**
    let included = pollen[0].hasOwnProperty(pollenType);

    if (included) {
      // Create a figure for the current pollen type (if data is included)
      let pollenFigure = document.createElement("figure");
      pollenFigure.classList.add("pollen-figure");
      pollenFigure.classList.add(pollenType); // Add the pollenType as a class to the figure

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
        let p2 = document.createElement("p");
        p2.textContent = currentPollen[pollenType];
        span.appendChild(p1);
        span.appendChild(p2);
        figcaption.appendChild(span);
      });

      // Append figcaption to figure
      pollenFigure.appendChild(figcaption);

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

const settingsIcon = document.getElementById("settings");
settingsIcon.addEventListener("click", () => {
  createRetardedCheckboxes();
});

//Building the pollen view (same as before)
const homeBtn = document.getElementById("home");
homeBtn.addEventListener("click", () => {
  buildPollen(filteredHourlyData);
  console.log("Building pollen!");
});
