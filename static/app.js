// Update the demographic info panel based on the selected sample
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    const metadata = data.metadata;

    // Find the metadata for the current sample
    const result = metadata.find(entry => entry.id == sample);

    // Select the panel and clear anything that was there
    const PANEL = d3.select("#sample-metadata");
    PANEL.html("");

    // Add each detail to the panel, all caps for that clinical flair
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Build both bubble and bar charts based on sample selection
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    const samples = data.samples;
    const result = samples.find(entry => entry.id == sample);

    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    // ------ Bubble Chart: Visual Bacterial Mayhem ------
    const bubbleLayout = {
      title: "Life Unseen: A Bacterial Bloom",
      hovermode: "closest",
      xaxis: { title: "Microscopic Aliens?" },
      yaxis: { title: "Tiny Lifeforms Counted" },
      margin: { t: 30 }
    };

    const bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // ------ Bar Chart: The Usual Suspects ------
    const yticks = otu_ids.map(id => `Colony ${id}`);

    const barData = [{
      y: yticks.slice(0, 10).reverse(),
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    const barLayout = {
      title: "Who’s Who in Your Bellybutton",
      margin: { t: 30, l: 150 },
      xaxis: { title: "How Many Friends Live Here?" }
    };

    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Dashboard setup on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    const sampleNames = data.names;
    const selector = d3.select("#selDataset");

    // Populate the dropdown menu with sample options
    sampleNames.forEach(name => {
      selector.append("option").text(name).property("value", name);
    });

    // Pick the first one and show the initial visuals
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// What happens when the user picks a new sample
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Fire it up!
init();
