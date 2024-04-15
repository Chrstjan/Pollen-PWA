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

const recivedPollenData = async (pollenData) => {
  pollenDataArray = pollenData;
  let viewData = [];
  // pollenData.current.img = "";
  viewData.push(pollenDataArray.current);

  //   console.log(viewData);

  let timeStamps = pollenDataArray.hourly.time;

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
    hourDataObjects.alder_pollen = pollenDataArray.hourly.alder_pollen[index];
    hourDataObjects.birch_pollen = pollenDataArray.hourly.birch_pollen[index];
    hourDataObjects.grass_pollen = pollenDataArray.hourly.grass_pollen[index];
    hourDataObjects.mugwort_pollen =
      pollenDataArray.hourly.mugwort_pollen[index];
    hourDataObjects.olive_pollen = pollenDataArray.hourly.olive_pollen[index];
    hourDataObjects.ragweed_pollen =
      pollenDataArray.hourly.ragweed_pollen[index];

    hourData.push(hourDataObjects);
  });

  //Gets the current date
  const curDay = new Date();
  //Gets the current Hour
  const curHour = curDay.getHours();
  console.log(curHour);

  const filteredHourlyData = hourData.filter((data) => {
    const dataTime = new Date(data.time);
    const dataHour = dataTime.getHours();
    return dataHour >= curHour && dataHour <= curHour + 4;
  });

  //Build pollen view
  buildPollen(filteredHourlyData);
};

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

const pollenSettings = () => {
  console.log("hello");

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
  pollenContainer.innerHTML += settingElm;
};

//Temp code for testing
const settingsButton = document.getElementById("settings");
settingsButton.addEventListener("click", pollenSettings);

const homeBtn = document.getElementById("home");
homeBtn.addEventListener("click", () => {
  buildPollen(pollenDataArray);
});

console.log(pollenDataArray);
