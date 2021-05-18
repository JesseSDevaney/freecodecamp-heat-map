import * as d3 from "d3";
import "./app.scss";

export default function createHeatMap() {
  const width = 800;
  const height = 600;

  d3.select("#root")
    .append("svg")
    .attr("id", "chart")
    .attr("viewBox", `0 0 ${width} ${height}`);
}
