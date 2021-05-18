import "./index.scss";
import createHeatMap from "./app/app";

function ready() {
  createHeatMap();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
