async function init() {
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

  let createArrofSubArrayLengths = (arr) => {
    let output = [];
    for (i = 0; i < arr.length; i++) {
      output.push(arr[i].length);
    }
    return output;
  };

  calcNewValues = (data, i) => {
    let exclaimationChecked = document.getElementById("exclaimation").checked;
    let golfChecked = document.getElementById("golf").checked;
    let sincePresident = document.getElementById("since_president").checked;
    if (
      exclaimationChecked == false &&
      golfChecked == false &&
      sincePresident == false
    ) {
      return hourlylists[i];
    }
    return hourlylists[i].filter(
      (v) =>
        (exclaimationChecked ? parseInt(v.has_exclaimation) > 0 : true) &&
        (golfChecked ? parseInt(v.mentions_golf) > 0 : true) &&
        (sincePresident ? v.since_president == "True" : true)
    );
  };

  calcYdomain = (arr) => {
    return [0, Math.max(...arr)];
  };

  let checkFilter = (e, i) => {
    var u = svg.selectAll("rect").data(hourlylists);

    currFilterArr = [];
    for (i = 0; i < hourlylists.length; i++) {
      currFilterArr.push(calcNewValues(0, i));
    }

    y.domain(calcYdomain(createArrofSubArrayLengths(currFilterArr)));
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    u.enter()
      .append("rect")
      .merge(u)
      .transition()
      .duration(1000)
      .attr("x", function (d, i) {
        return x(times[i]);
      })
      .attr("width", x.bandwidth())
      .attr("y", function (d, i) {
        let filteredData = calcNewValues(d, i);
        return y(filteredData.length);
      })
      .attr("height", function (d, i) {
        let filteredData = calcNewValues(d, i);
        return height - y(filteredData.length);
      });
  };

  document
    .getElementById("exclaimation")
    .addEventListener("change", checkFilter);

  document.getElementById("golf").addEventListener("change", checkFilter);
  document
    .getElementById("since_president")
    .addEventListener("change", checkFilter);

  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 800 - margin.left - margin.right,
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

  let times = [
    "12a",
    "1a",
    "2a",
    "3a",
    "4a",
    "5a",
    "6a",
    "7a",
    "8a",
    "9a",
    "10a",
    "11a",
    "12p",
    "1p",
    "2p",
    "3p",
    "4p",
    "5p",
    "6p",
    "7p",
    "8p",
    "9p",
    "10p",
    "11p",
  ];

  // Scale the range of the data in the domains
  x.domain(times);
  y.domain(calcYdomain(createArrofSubArrayLengths(hourlylists)));

  // append the rectangles for the bar chart
  svg
    .selectAll(".bar")
    .data(hourlylists)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d, i) {
      return x(times[i]);
    })
    .attr("width", x.bandwidth())
    .attr("y", function (d, i) {
      value = hourlylists[i].length;
      return y(value);
    })
    .attr("height", function (d, i) {
      value = hourlylists[i].length;
      return height - y(value);
    });

  // add the x Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // add the y Axis
  yAxis = svg.append("g").call(d3.axisLeft(y));
}

init();
