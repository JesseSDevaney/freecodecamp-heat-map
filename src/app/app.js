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
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`);

  // border
  svg
    .append("rect")
    .attr("id", "chart-border")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height);

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

  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat((year) => year)
    .tickSizeOuter(0);

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

  const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

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
    "#ffffff",
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
    .attr("data-temp", (d) => d.toFixed(3))
    .on("mouseover", (event) => {
      const { target, x, y } = event;

      let targetColor = target.getAttribute("fill");
      const { month, year, temp } = target.dataset;

      const tooltip = document.createElement("div");
      tooltip.setAttribute("id", "tooltip");
      tooltip.setAttribute("data-year", year);
      tooltip.style.left = `${x + 20}px`;
      tooltip.style.top = `${y + 20}px`;
      tooltip.style.color = targetColor;
      tooltip.appendChild(
        document.createTextNode(
          `Year: ${year}` + `\nMonth: ${month}` + `\nTemperature: ${temp}`
        )
      );
      document.body.appendChild(tooltip);
    })
    .on("mouseout", () => {
      document.getElementById("tooltip").remove();
    });

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

  // title
  svg
    .append("text")
    .text("Temperature Trends over the Last 3 Centuries")
    .attr("id", "title")
    .attr("x", "50%")
    .attr("y", "3%")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle");

  // description
  svg
    .append("text")
    .text(
      "Temperature values over the last 3 centuries indicate a warming trend with fewer cold anomalies and on average, warmer temperatures."
    )
    .attr("id", "description")
    .attr("x", "50%")
    .attr("y", "6.5%")
    .attr("fill", "rgba(0, 0, 0, 0.6)")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle");
}
