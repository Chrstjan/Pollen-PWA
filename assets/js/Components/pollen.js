import { myFetchData } from "../Utils/apiUtils.js";

const pollenContainer = document.getElementById("app");

// let pollenDataArray = [];
let filteredHourlyData = [];

export const getPollenData = async (lat, long) => {
  console.log("Pollen!!");
  const endpoint = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${long}&current=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=Europe%2FBerlin&forecast_days=1`;
  const pollenData = await myFetchData(endpoint);
  //   console.log(pollenData);
  recivedPollenData(pollenData);
};

let pollenTypesToFilter = [];
console.log(pollenTypesToFilter);

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

  console.log(filteredHourlyData);

  // pollenDataArray.push(filteredHourlyData);

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
    }
  });
};

function updateData(data, pollenType, isChecked) {
  // Make a copy to avoid modifying original data
  const updatedData = [...data];

  if (isChecked) {
    // Add the key-value pair only if checked
    updatedData.forEach((dataPoint) => {
      if (!dataPoint.hasOwnProperty(pollenType)) {
        dataPoint[pollenType] = true; // Or any placeholder value indicating data is present
      }
    });
  } else {
    // Remove the key-value pair if unchecked (logic remains the same)
    updatedData.forEach((dataPoint) => {
      if (dataPoint.hasOwnProperty(pollenType) && dataPoint[pollenType]) {
        delete dataPoint[pollenType];
      }
    });
  }

  return updatedData;
}

const pollenSettings = async () => {
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
    checkbox.addEventListener("change", async () => {
      const pollenType = checkbox.id.replace("Checkbox", "");
      const isChecked = checkbox.checked;

      filteredHourlyData = await updateData(
        filteredHourlyData,
        pollenType,
        isChecked
      );
      buildPollen(filteredHourlyData); // Update view with modified data after checkbox change
    });
  });
};

pollenSettings();

//Building the settings view
const settingsButton = document.getElementById("settings");
settingsButton.addEventListener("click", pollenSettings);

//Building the pollen view
const homeBtn = document.getElementById("home");
homeBtn.addEventListener("click", () => {
  buildPollen(filteredHourlyData);
  console.log("Building pollen!");
});
