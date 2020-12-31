// Writing main fuction
function dashboard() {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");

// Use the D3 library to read in `samples.json`.
d3.json("/data/samples.json").then((importedData) => {
    var data = importedData;
    console.log(data);
    data.names.forEach(d =>{
        dropdownMenu.append("option").text(d).property("value");
    });
    optionChanged(data.names[0])

});   
};
dashboard() 


function optionChanged(subjectId) {
    d3.json("/data/samples.json").then((data) => {
    var demoInfo = data.metadata.filter(md => md.id == subjectId)
    var firstDemoInfo = demoInfo[0]
    console.log(firstDemoInfo)
    console.log(demoInfo)
    var demographInfo = d3.select("#sample-metadata");
    // Needing to clear the list for the change
    demographInfo.html("")
    // Appending the demographic info box 
    Object.entries(firstDemoInfo).forEach(([key, value]) => {
        demographInfo.append("p").text(`${key}:${value}`)
    })
    // Create a horizontal bar chart with a dropdown menu to 
    // display the top 10 OTUs found in that individual.

    // Inputting data for bar chart
    var graphInfo = data.samples.filter(sd => sd.id == subjectId)
    var firstGraphInfo = graphInfo[0]
    // Slice for the top ten otu values
    var otuIds = firstGraphInfo.otu_ids.slice(0, 10).reverse().map(otus => `OTU ID:${otus}`)
    var sampVals = firstGraphInfo.sample_values.slice(0, 10).reverse()
    var otuLabels = firstGraphInfo.otu_labels.slice(0, 10).reverse() 
    // Creating trace for bar graph
    trace_bar = [{
        x: sampVals, 
        y: otuIds, 
        text: otuLabels,
        type: 'bar',
        marker: {color: ['rgb(145, 81, 17)',
                         'rgb(145, 17, 17)',
                         'rgb(145, 17, 81)',
                         'rgb(145, 17, 145)',
                         'rgb(81, 17, 145)',
                         'rgb(17, 17, 145)',
                         'rgb(17, 81, 145)',
                         'rgb(17, 145, 145)',
                         'rgb(17, 145, 81)',
                         'rgb(17, 145,17)']},
        orientation: "h"
    }]
    layout = {
        title: "Belly Button Bar Chart"
    }
    Plotly.newPlot("bar", trace_bar, layout)
    // Creating a trace for the bubble chart
    trace_bubble = [{
        x: firstGraphInfo.otu_ids, 
        y: firstGraphInfo.sample_values,
        text: firstGraphInfo.otu_label,
        mode: "markers",
        marker: {color: firstGraphInfo.otu_ids, 
                 size:  firstGraphInfo.sample_values,
                 colorscale: 'Earth'}
    }]
    layout = {
        xaxis: {title: {text: "OTU ID"}}
    }
    Plotly.newPlot("bubble", trace_bubble, layout)

    // Creating a trace for the gauge chart
    var washfreq = data.metadata.wfreq;
    var traceGauge = {
        type: 'pie',
        showlegend: false,
        hole: 0.4,
        rotation: 90,
        values: [ 20, 20, 20, 20, 20, 20, 20, 20, 20, 180],
        text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
        direction: 'clockwise',
        textinfo: 'text',
        textposition: 'inside',
        marker: {
          colors: ['','','','','','','','','','white'],
          labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
          hoverinfo: 'label'
        }
      }
        // let weight = 0;
        // if (washfreq == 2 || washfreq == 3){
        //     weight = 3;
        // } else if (washfreq == 4){
        //     weight = 1;
        // } else if (washfreq == 5){
        //     weight = -.5;
        // } else if (washfreq == 6){
        //     weight = -2;
        // } else if (washfreq == 7){
        //     weight = -3;
        // }
      // needle
      var degrees = 180-(20 * washfreq),
      radius = .5;
      var radians = degrees * Math.PI / 180;
      var x = radius * Math.cos(radians);
      var y = radius * Math.sin(radians);
  
      var gaugeLayout = {
        shapes: [{
          type: 'line',
          x0: radius,
          y0: radius,
          x1: x,
          y1: y,
          line: {
            color: 'red',
            width: 5
          }
        }],
        title: 'Belly Button Washing Frequency: Scrubs per Week',
        xaxis: {zeroline: false, range: [-1, 1],  fixedrange: true},
        yaxis: {zeroline: false, range: [-1, 1],  fixedrange: true}
      }
  
      var dataGauge = [traceGauge]
  
      Plotly.plot('gauge', dataGauge, gaugeLayout)
    })};
