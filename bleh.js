async function init() {
  const data = await d3.csv("./data/sample.csv");
  console.log(data);

  const byhour = await d3.csv("./data/tweets_by_hour.csv");
  //   console.log(byhour);
  let hourlylists = [];
  for (i = 0; i < byhour.length; i++) {
    if (!hourlylists[byhour[i].hour]) {
      hourlylists[byhour[i].hour] = [];
    } else {
      hourlylists[byhour[i].hour].push(byhour[i]);
    }
  }

  console.log(hourlylists);

  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleBand().range([0, width]).padding(0.1);
  var y = d3.scaleLinear().range([height, 0]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3
    .select("#vis")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data in the domains
  x.domain([
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
  ]);
  y.domain([0, 5000]);

  // append the rectangles for the bar chart
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return x(d.salesperson);
    })
    .attr("width", x.bandwidth())
    .attr("y", function (d) {
      return y(d.sales);
    })
    .attr("height", function (d) {
      return height - y(d.sales);
    });

  // add the x Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g").call(d3.axisLeft(y));
}

init();
