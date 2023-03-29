const data_url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

d3.json(data_url).then(function(data) {
    var selDataset = d3.select("#selDataset");
    var names = data.names;
    names.forEach( (name) => {
        selDataset.append("option").text(name).property("value",name)
    });

    const name = names[0];
    updateChart(name);
    updateMetadata(name);
});

function updateChart(sample) {
    d3.json(data_url).then((data) => {
        var samples = data.samples;
        var filterArray = samples.filter(sampleObject => sampleObject.id == sample);
        var result = filterArray[0];
        var sample_values = result.sample_values;
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        // console.log(otu_labels)
        // console.log(otu_ids)

        // Create a horizontal bar chart
        var trace1 = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            name: "Greek",
            type: "bar",
            orientation: "h"
        };
        var data = [trace1];
        var layout = {
            title: "Top Ten OTUs for Individual " +sample,
        };
        Plotly.newPlot("bar", data, layout); 


        // Create Bubble Chart
        trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
            size: sample_values,
            color: otu_ids,
            colorscale:"Electric"
            }
        };
        data = [trace1];
        layout = {
            showlegend: false,
            hovermode: 'closest',
            xaxis: {title:"OTU ID"},
        };
        Plotly.newPlot('bubble', data, layout);


    });
}

function updateMetadata(sample) {
    d3.json(data_url).then((data) => {
        var metadata = data.metadata;
        var filterArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var result = filterArray[0];
        // Data in Demographic Info
        var metaPanel = d3.select("#sample-metadata");
        metaPanel.html("");
        Object.entries(result).forEach(([key, value]) => {
            metaPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
        })

        

    });
}

function optionChanged(newSample) {
    updateCharts(newSample);
    updateMetadata(newSample);
}