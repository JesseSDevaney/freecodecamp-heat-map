import "./index.scss";
import createHeatMap from "./app/app";

function ready() {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  )
    .then((response) => response.json())
    .then((data) => {
      createHeatMap(data);
    })
    .catch((error) => {
      alert("Error loading content");
      console.log(error);
    });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
