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
  const total_num_with_exc = data.length - bins["0"];
  let perc_with_excl = ((total_num_with_exc / data.length) * 100).toFixed(0);
  numTweetsSpan.innerHTML = data.length;
  percExclSpan.innerHTML = `${perc_with_excl}%`;
  console.log(perc_with_excl);
  console.log(bins);
}

init();
