async function init() {
  const data = await d3.csv("./data/most_frequent_tweets.csv");
  // console.log(data);

  let tweetsAppendDiv = document.getElementById("appendTweetData");

  let innerTweets = data.map((d) => {
    return `
        <tr>
          <td>${d.count}</td>
          <td>${d.tweet_text}</td>
        </tr>
    `;
  });

  tweetsAppendDiv.innerHTML = innerTweets.join("");

  const width = 500;
  const height = 500;

  //where to center bubbles
  const centre = { x: width / 2, y: height / 2.5 };
  const forceStrength = 0.03;

  // charge is dependent on size of the bubble, so bigger towards the middle
  function charge(d) {
    return Math.pow(d.radius, 2.0) * 0.01;
  }

  // create a force simulation and add forces to it
  const simulation = d3
    .forceSimulation()
    .force("charge", d3.forceManyBody().strength(charge))
    .force("center", d3.forceCenter(centre.x, centre.y))
    .force("x", d3.forceX().strength(forceStrength).x(centre.x))
    .force("y", d3.forceY().strength(forceStrength).y(centre.y))
    .force(
      "collision",
      d3.forceCollide().radius((d) => d.radius + 1)
    );

  // force simulation starts up automatically, which we don't want as there aren't any nodes yet
  simulation.stop();

  const fillColour = d3
    .scaleOrdinal()
    .domain(["1", "2", "3", "5", "99"])
    .range(d3.schemeDark2);

  const maxSize = d3.max(data, (d) => +d.count);

  // bubble sizes
  const radiusScale = d3.scaleSqrt().domain([0, maxSize]).range([0, 100]);

  // use map() to convert raw data into node data
  const nodes = data.map((d) => ({
    ...d,
    radius: radiusScale(+d.count),
    size: +d.size,
    x: Math.random() * 900,
    y: Math.random() * 800,
  }));

  svg = d3
    .select("#vis")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // bind nodes data to circle elements
  const elements = svg
    .selectAll(".bubble")
    .data(nodes, (d) => d.id)
    .enter()
    .append("g");

  // Define the div for the tooltip
  var div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  bubbles = elements
    .append("circle")
    .classed("bubble", true)
    .attr("r", (d) => d.radius)
    .attr("fill", (d) => fillColour(d.id))
    .on("mouseover", function (d, i) {
      d3.select(this).transition().duration("50").attr("opacity", ".85");
      div.transition().duration(50).style("opacity", 1);
      div
        .html(`<div>${d.tweet_text}</div>`)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function (d, i) {
      d3.select(this).transition().duration("50").attr("opacity", "1");
      div.transition().duration("50").style("opacity", 0);
    });

  // labels
  labels = elements
    .append("text")
    .attr("dy", ".3em")
    .style("text-anchor", "middle")
    .style("font-size", (d, i) => {
      if (i == 0) return 12;
      if (i == 2 || i == 6) return 10;
      return 14;
    })
    .text((d, i) => {
      if (i == 0 || i == 2 || i == 6) return `${d.tweet_text}`;
      return `${d.count}`;
    });

  // set simulation's nodes to our newly created nodes array
  // simulation starts running automatically once nodes are set
  simulation.nodes(nodes).on("tick", ticked).restart();

  function ticked() {
    bubbles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
  }
}

init();
