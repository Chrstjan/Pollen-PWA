import { myFetchData } from "../Utils/apiUtils.js";

export const getPollenData = async (lat, long) => {
  console.log("Pollen!!");
  const endpoint = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${long}&current=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=Europe%2FBerlin&forecast_days=1`;
  const pollenData = await myFetchData(endpoint);
  //   console.log(pollenData);
  recivedPollenData(pollenData);
};

const recivedPollenData = (pollenData) => {
  let viewData = [];
  pollenData.current.img = "";
  viewData.push(pollenData.current);

  //   console.log(viewData);

  let timeStamps = pollenData.hourly.time;

  let hourData = [];

  timeStamps.map((timestamp, index) => {
    let hourDataObjects = {};
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
    //Creating new data objects for each hourly pollen
    //Each data object get the pollen type and the corresponding timestamp from the 24 hour array
    hourDataObjects.time = timestamp;
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

  const filteredHourlyData = hourData.filter((data) => {
    const dataTime = new Date(data.time);
    const dataHour = dataTime.getHours();
    return dataHour >= curHour && dataHour <= curHour + 4;
  });

  //Build current pollen
  //   buildCurrentPollen(viewData);
  //Build hourly pollen
  //   buildHourlyPollen(hourData);
  buildHourlyPollen(filteredHourlyData);
};

const buildHourlyPollen = (pollen) => {
  console.log(pollen);
  const pollenContainer = document.getElementById("app");

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
