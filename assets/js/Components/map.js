const mapParentContainer = document.getElementById("app");

// export const createMap = (lat, long) => {
//   mapParentContainer.innerHTML = "";

//   const mapContainer = document.createElement("div");
//   mapContainer.id = "map";

//   let map = L.map("map", {
//     center: [lat, long],
//     zoom: 13
//   });

//   console.log("Map!!");

//   console.log(lat, long);


//   mapParentContainer.appendChild(mapContainer);
// }
export const createMap = (lat, long) => {
  // Check if mapParentContainer exists
  const mapParentContainer = document.getElementById("app");
  if (!mapParentContainer) {
    console.error("mapParentContainer element not found!");
    return; // Do nothing if container doesn't exist
  }

  // Find the existing map container (assuming it has a different class or ID)
  const existingMapContainer = mapParentContainer.querySelector(".map-container"); // Replace with the actual selector

  if (existingMapContainer) {
    mapParentContainer.removeChild(existingMapContainer);
  }

  const mapContainer = document.createElement("div");
  mapContainer.id = "map";

  let map = L.map("map", {
    center: [long, lat],
    zoom: 13
  });

  console.log("Map!!");
  console.log(lat, long);

  mapParentContainer.appendChild(mapContainer);
}