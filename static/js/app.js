// Load metadata for the selected sample and update the info panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    const metadata = data.metadata;

    // Find the metadata object that matches the selected sample
    const result = metadata.find(sampleObj => sampleObj.id == sample);

    // Select the panel and clear existing content
    const PANEL = d3.select("#sample-metadata");
    PANEL.html("");

    // Add each key-value pair from the metadata to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Load sample data and build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    const samples = data.samples;
    const result = samples.find(sampleObj => sampleObj.id == sample);

    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    // ---------- Bubble Chart ----------
    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" },
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

    // ---------- Bar Chart (Top 10 OTUs) ----------
    const yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();

    const barData = [{
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    const barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 },
      xaxis: { title: "Number of Bacteria" }
    };

    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Set up the dashboard on page load
function init() {
  const selector = d3.select("#selDataset");

  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    const sampleNames = data.names;

    // Populate dropdown menu with sample names
    sampleNames.forEach(name => {
      selector
        .append("option")
        .text(name)
        .property("value", name);
    });

    // Use the first sample to kick things off
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Handle new sample selection from dropdown
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Load the dashboard
init();
