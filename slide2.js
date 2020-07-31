async function init() {
  const data = await d3.csv("./data/has_exclaimation.csv");
  let numTweetsSpan = document.getElementById("num-tweets");
  let percExclSpan = document.getElementById("perc-excl");
  let bins = {};
  for (i = 0; i < data.length; i++) {
    bins[data[i].has_exclaimation] = bins[data[i].has_exclaimation]
      ? bins[data[i].has_exclaimation] + 1
      : 1;
  }

  let pieData = {
    "0": bins[0],
    "1": bins[1],
    ">2":
      bins[2] +
      bins[3] +
      bins[4] +
      bins[5] +
      bins[6] +
      bins[7] +
      bins[8] +
      bins[9] +
      bins[10] +
      bins[11] +
      bins[12] +
      bins[13] +
      // bins[14] +
      bins[15] +
      // bins[16] +
      bins[17],
  };

  const total_num_with_exc = data.length - bins["0"];
  let perc_with_excl = ((total_num_with_exc / data.length) * 100).toFixed(0);
  numTweetsSpan.innerHTML = data.length;
  percExclSpan.innerHTML = `${perc_with_excl}%`;
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#my_dataviz")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // set the dimensions and margins of the graph
  var width = 450;
  height = 450;
  margin = 40;

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  var radius = Math.min(width, height) / 2 - margin;

  // append the svg object to the div called 'my_dataviz'
  var svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // Create dummy data
  // var data2 = { a: 9, b: 20, c: 30, d: 8, e: 12 };

  // set the color scale
  var color = d3.scaleOrdinal().domain(pieData).range(d3.schemeDark2);

  // Compute the position of each group on the pie:
  var pie = d3.pie().value(function (d) {
    return d.value;
  });
  var data_ready = pie(d3.entries(pieData));

  var arc = d3
    .arc()
    .innerRadius(radius * 0.5) // This is the size of the donut hole
    .outerRadius(radius * 0.8);

  // Another arc that won't be drawn. Just for labels positioning
  var outerArc = d3
    .arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg
    .selectAll("whatever")
    .data(data_ready)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", function (d) {
      return color(d.data.key);
    })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7);

  // Add the polylines between chart and labels:
  svg
    .selectAll("allPolylines")
    .data(data_ready)
    .enter()
    .append("polyline")
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr("points", function (d) {
      var posA = arc.centroid(d); // line insertion in the slice
      var posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
      var posC = outerArc.centroid(d); // Label position = almost the same as posB
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC];
    });

  // Add the polylines between chart and labels:
  svg
    .selectAll("allLabels")
    .data(data_ready)
    .enter()
    .append("text")
    .text(function (d) {
      return d.data.value;
    })
    .attr("transform", function (d) {
      var pos = outerArc.centroid(d);
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
      return "translate(" + pos + ")";
    })
    .style("text-anchor", function (d) {
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      return midangle < Math.PI ? "start" : "end";
    });
}

init();
