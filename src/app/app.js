import * as d3 from "d3";
import "./app.scss";

export default function createHeatMap(data) {
  const width = 800;
  const height = 600;

  const svg = d3
    .select("#root")
    .append("svg")
    .attr("id", "chart")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const padWidth = 0.1 * width;
  const padHeight = 0.1 * height;

  // x-axis
  const years = data["monthlyVariance"].map(({ year }) => parseInt(year, 10));
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(years) - 0.5, d3.max(years) + 0.5])
    .range([padWidth, width - padWidth]);

  const xAxis = d3.axisBottom(xScale).tickFormat((y) => y);

  // Plot x-axis
  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padHeight})`);

  // x-axis label
  svg
    .append("text")
    .text("Year")
    .attr("id", "x-label")
    .attr("class", "axis-label")
    .attr("x", "85%")
    .attr("y", "97%");
}
