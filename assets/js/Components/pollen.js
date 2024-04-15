import { myFetchData } from "../Utils/apiUtils.js";

const pollenContainer = document.getElementById("app");

let pollenDataArray = [];

export const getPollenData = async (lat, long) => {
  console.log("Pollen!!");
  const endpoint = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${long}&current=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=Europe%2FBerlin&forecast_days=1`;
  const pollenData = await myFetchData(endpoint);
  //   console.log(pollenData);
  recivedPollenData(pollenData);
};

let pollenTypesToFilter = [];
console.log(pollenTypesToFilter);

let filteredPollenData = [];

let filteredHourlyData = [];

const recivedPollenData = (pollenData) => {
  let viewData = [];
  viewData.push(pollenData.current);

  //   console.log(viewData);

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

  pollenDataArray.push(filteredHourlyData);

  //Build pollen view
  buildPollen(filteredHourlyData);
};

console.log(pollenDataArray);

const buildPollen = (pollen) => {
  console.log(pollen);

  pollenContainer.innerHTML = "";
  // Iterate over each pollen type
  Object.keys(pollen[0]).forEach((pollenType) => {
    // Skip iteration if the current key is 'time'
    if (pollenType === "time") return;

    // Create a figure for the current pollen type
    let pollenFigure = `<figure>
      <header>
          <h3>${pollenType.replace("_pollen", "")}</h3>
      </header>
      <figcaption>`;

    // Iterate over hourly data to populate the pollen values for the current type
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
  });
};

const updateFilteredPollen = () => {
  filteredPollenData = filteredHourlyData.filter((data) => {
    return pollenTypesToFilter.every((pollenType) => {
      // Get the checkbox status for the current pollen type
      const checkboxId = `${pollenType}Checkbox`;
      const isChecked = document.getElementById(checkboxId).checked;

      // Include the data if the checkbox is checked, exclude otherwise
      return isChecked;
    });
  });

  buildPollen(filteredPollenData);
};

const pollenSettings = () => {
  pollenContainer.innerHTML = "";

  let settingElm = `
    <div>
      <header>
        <h2>Mine Allergier</h2>
      </header>
      <span>
        <p>alder pollen</p>
        <input type="checkbox" id="alderCheckbox" checked>
      </span>
      <span>
        <p>birch pollen</p>
        <input type="checkbox" id="birchCheckbox" checked>
      </span>
      <span>
        <p>grass pollen</p>
        <input type="checkbox" id="grassCheckbox" checked>
      </span>
      <span>
        <p>mugwort pollen</p>
        <input type="checkbox" id="mugwortCheckbox" checked>
      </span>
      <span>
        <p>olive pollen</p>
        <input type="checkbox" id="oliveCheckbox" checked>
      </span>
      <span>
        <p>ragweed pollen</p>
        <input type="checkbox" id="ragweedCheckbox" checked>
      </span>
    </div>`;
  pollenContainer.innerHTML = settingElm;

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const pollenType = checkbox.id.replace("Checkbox", ""); // Extract the pollen type from the checkbox ID
      const isChecked = checkbox.checked;

      if (!isChecked) {
        // Remove the pollen type from the array if unchecked
        const index = pollenTypesToFilter.indexOf(pollenType);
        if (index !== -1) {
          pollenTypesToFilter.splice(index, 1);
        }
      } else {
        // Add the pollen type to the array if checked
        pollenTypesToFilter.push(pollenType);
      }

      // Call a function to update the pollen view with the filtered data
      updateFilteredPollen();
    });
  });
};

//Building the settings view
const settingsButton = document.getElementById("settings");
settingsButton.addEventListener("click", pollenSettings);

//Building the pollen view
const homeBtn = document.getElementById("home");
homeBtn.addEventListener("click", () => {
  buildPollen(pollenDataArray[0]);
});
