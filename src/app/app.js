import * as d3 from "d3";
import "./app.scss";

export default function createHeatMap(data) {
  const width = 800;
  const height = 600;

  const baseTemperature = data["baseTemperature"];
  const monthlyVariance = data["monthlyVariance"];

  const svg = d3
    .select("#root")
    .append("svg")
    .attr("id", "chart")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const padWidth = 0.13 * width;
  const padHeight = 0.1 * height;

  // x-axis
  const years = monthlyVariance.map(({ year }) => year);
  const minYear = d3.min(years);
  const maxYear = d3.max(years);
  const xScale = d3
    .scaleLinear()
    .domain([minYear - 0.5, maxYear + 0.5])
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
  const months = monthlyVariance.map(({ month }) => month);
  const minMonth = d3.min(months);
  const maxMonth = d3.max(months);
  const yScale = d3
    .scaleLinear()
    .domain([minMonth - 0.5, maxMonth + 0.5])
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

  // plot cells
  const cellWidth = (width - 2 * padWidth) / (maxYear - minYear + 1);
  const cellHeight = (height - 2 * padHeight) / (maxMonth - minMonth + 1);
  const cellColors = [
    "#002699",
    "#3366ff",
    "#ccd9ff",
    " #ffffff",
    "#ffcccc",
    "#ff3333",
    "#b30000",
  ];
  const temps = monthlyVariance.map(
    ({ variance }) => baseTemperature + variance
  );
  const minTemp = d3.min(temps);
  const maxTemp = d3.max(temps);

  svg
    .selectAll(".cell")
    .data(temps)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("x", (d, i) => xScale(years[i]) - cellWidth / 2)
    .attr("y", (d, i) => yScale(months[i]) - cellHeight / 2)
    .attr("width", cellWidth)
    .attr("height", cellHeight)
    .attr("fill", (d) => {
      const rangePercentile = (d - minTemp) / (maxTemp - minTemp);

      let colorIndex = Math.floor(cellColors.length * rangePercentile);
      if (colorIndex >= cellColors.length) {
        colorIndex = cellColors.length - 1;
      }

      return cellColors[colorIndex];
    })
    .attr("data-month", (d, i) => months[i])
    .attr("data-year", (d, i) => years[i])
    .attr("data-temp", (d) => d);

  // plot legend
  const legend = svg.append("svg").attr("id", "legend");

  // legend title
  const legendTitleY = height / 3;

  legend
    .append("text")
    .text("Temperature Ranges")
    .attr("id", "legend-title")
    .attr("x", width - padWidth / 2)
    .attr("y", legendTitleY)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle");

  // legend keys
  const legendCellWidth = 10;
  const legendCellHeight = 10;
  const keyPadding = 5;
  const keyX = width - 0.82 * padWidth;
  const keyYStart = legendTitleY + 3 * keyPadding;
  const keyYChange = keyPadding + legendCellHeight;

  legend
    .selectAll(".legend-key")
    .data(cellColors)
    .enter()
    .append("rect")
    .attr("class", "legend-key")
    .attr("x", keyX)
    .attr("y", (d, i) => keyYStart + i * keyYChange)
    .attr("width", legendCellWidth)
    .attr("height", legendCellHeight)
    .attr("fill", (d) => d);

  // legend values
  legend
    .selectAll(".legend-value")
    .data(cellColors)
    .enter()
    .append("text")
    .text((d, i) => {
      const startRange = (
        (i / cellColors.length) * (maxTemp - minTemp) +
        minTemp
      ).toFixed(3);
      const endRange = (
        ((i + 1) / cellColors.length) * (maxTemp - minTemp) +
        minTemp
      ).toFixed(3);

      return `(${startRange} - ${endRange})`;
    })
    .attr("class", "legend-value")
    .attr("x", keyX + 1.5 * legendCellWidth)
    .attr("y", (d, i) => keyYStart + legendCellHeight / 2 + i * keyYChange)
    .attr("dominant-baseline", "middle");
}
