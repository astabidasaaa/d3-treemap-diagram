const DATASETS = [
{
  ID: "videogames",
  TITLE: "Video Game Sales",
  DESCRIPTION: "Top 100 Most Sold Video Games Grouped by Platform",
  FILE_PATH:
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json" },

{
  ID: "movies",
  TITLE: "Movie Sales",
  DESCRIPTION: "Top 100 Highest Grossing Movies Grouped By Genre",
  FILE_PATH:
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json" },

{
  ID: "kickstarter",
  TITLE: "Kickstarter Pledges",
  DESCRIPTION:
  "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
  FILE_PATH:
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json" }];



const colorRange = [
"#a6cee3",
"#1f78b4",
"#b2df8a",
"#33a02c",
"#fb9a99",
"#e31a1c",
"#fdbf6f",
"#ff7f00",
"#cab2d6",
"#6a3d9a",
"#ffff99",
"#b15928"];


const color = d3.scaleOrdinal(d3.schemeCategory20);

const svgContainerWidth = 1200,
svgContainerHeight = 600;

// CHANGE HERE = { 1, 2, 3 }
let defaultState = 0;

const source = DATASETS[defaultState];
let data_id, data_title, data_description, data_content;

const drawMap = () => {
  // HEADING
  const heading = d3.select("#container").append("heading");

  heading.append("h1").attr("id", "title").html(data_title);

  heading.append("div").attr("id", "description").html(data_description);

  heading.append("div").attr("id", "author").
  html(`<p>Coded & Designed by<br><a href="https://sngkr.netlify.app/" target="_blank">
          Sangkara
        </a></p>`);

  const svgContainer = d3.
  select("#container").
  append("div").
  attr("id", "svgContainer");

  const svg = d3.
  select("#svgContainer").
  append("svg").
  attr("width", svgContainerWidth).
  attr("height", svgContainerHeight);

  const tooltip = d3.
  select("#container").
  append("div").
  attr("id", "tooltip").
  style("opacity", 0);

  const treemap = d3.
  treemap().
  size([svgContainerWidth, svgContainerHeight]).
  paddingInner(2);

  const root = d3.
  hierarchy(data_content).
  sum((datum, index) => datum.value).
  sort((a, b) => {
    return b.height - a.height || b.value - a.value;
  });

  treemap(root);

  const tile = svg.
  selectAll("g").
  data(root.leaves()).
  enter().
  append("g").
  attr("class", "group").
  attr("transform", datum => {
    return "translate(" + datum.x0 + "," + datum.y0 + ")";
  });

  //   TILE RECT
  tile.
  append("rect").
  classed("tile", true).
  attr("width", (datum, index) => {
    return datum.x1 - datum.x0;
  }).
  attr("height", (datum, index) => {
    return datum.y1 - datum.y0;
  }).
  attr("data-name", (datum, index) => {
    return datum.data.name;
  }).
  attr("data-category", (datum, index) => {
    return datum.data.category;
  }).
  attr("data-value", (datum, index) => {
    return datum.data.value;
  })
  // .style("stroke", "black")
  .attr("fill", (datum, index) => {
    return color(datum.data.category);
  }).
  on("mouseover", function (datum, index) {
    d3.select(this).attr("fill", "#ccc");

    tooltip.
    style("opacity", 0.9).
    style("top", event.pageY + "px").
    style("left", event.pageX + 30 + "px").
    attr("data-value", (d, index) => datum.data.value).
    html(
    "Name: " +
    datum.data.name +
    "<br>Category: " +
    datum.data.category +
    "<br>Value: " +
    d3.format(",")(datum.data.value));

  }).
  on("mouseout", function (datum, index) {
    d3.select(this).attr("fill", (datum, index) => {
      return color(datum.data.category);
    });
    tooltip.style("opacity", 0);
  });

  //   TILE TEXT
  tile.
  append("text").
  attr("class", "tile-text").
  selectAll("tspan").
  data(datum => {
    return datum.data.name.split(/(?=[A-Z][^A-Z])/g);
  }).
  enter().
  append("tspan").
  attr("x", 4).
  attr("y", (datum, index) => {
    return 12 + index * 12;
  }).
  text((datum, index) => {
    return datum;
  });

  //   LEGENDS
  let categories = root.leaves().map(nodes => {
    return nodes.data.category;
  });
  categories = categories.filter((category, index, self) => {
    return self.indexOf(category) === index;
  });

  const legendWidth = 500;
  const LEGEND_OFFSET = 10;
  const LEGEND_RECT_SIZE = 15;
  const LEGEND_H_SPACING = 150;
  const LEGEND_V_SPACING = 10;
  const LEGEND_TEXT_X_OFFSET = 8;
  const LEGEND_TEXT_Y_OFFSET = -2.5;
  const legendElemsPerRow = Math.floor(legendWidth / LEGEND_H_SPACING);

  const legend = d3.
  select("#container").
  append("svg").
  attr("id", "legend").
  attr("width", legendWidth);

  const legendElem = legend.
  append("g").
  attr("transform", "translate(60," + LEGEND_OFFSET + ")").
  selectAll("g").
  data(categories).
  enter().
  append("g").
  attr("transform", (datum, index) => {
    return (
      "translate(" +
      index % legendElemsPerRow * LEGEND_H_SPACING +
      "," + (
      Math.floor(index / legendElemsPerRow) * LEGEND_RECT_SIZE +
      LEGEND_V_SPACING * Math.floor(index / legendElemsPerRow)) +
      ")");

  });

  legendElem.
  append("rect").
  attr("width", LEGEND_RECT_SIZE).
  attr("height", LEGEND_RECT_SIZE).
  attr("class", "legend-item").
  attr("fill", datum => {
    return color(datum);
  });

  legendElem.
  append("text").
  attr("x", LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET).
  attr("y", LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET).
  text(datum => {
    return datum;
  });
};

d3.json(source.FILE_PATH, function (error, data) {
  if (error) {
    console.log(error);
  } else {
    data_id = source.ID,
    data_title = source.TITLE,
    data_description = source.DESCRIPTION,
    data_content = data;

    drawMap();
    console.log(data);
  }
});