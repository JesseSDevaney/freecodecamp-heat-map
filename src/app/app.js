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

  const xAxis = d3.axisBottom(xScale).tickFormat((year) => year);

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

  // y-axis
  const months = data["monthlyVariance"].map(({ month }) =>
    parseInt(month, 10)
  );
  const yScale = d3
    .scaleLinear()
    .domain([d3.min(months) - 0.5, d3.max(months) + 0.5])
    .range([height - padHeight, padHeight]);

  const yAxis = d3.axisLeft(yScale);

  // Plot y-axis
  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padWidth}, 0)`);

  // y-axis label
  svg
    .append("text")
    .text("Month")
    .attr("id", "y-label")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", "-18%")
    .attr("y", "6%");
}
