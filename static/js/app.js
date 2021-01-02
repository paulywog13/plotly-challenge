// Writing main dashboard fuction
function dashboard() {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");

// Use the D3 library to read in `samples.json`.
d3.json("data/samples.json").then((importedData) => {
    var data = importedData;
    console.log(data);
    data.names.forEach(d =>{
        dropdownMenu.append("option").text(d).property("value");
    });
    optionChanged(data.names[0])
});   
};
dashboard() 

// Creating a function for the main function based upon the Subject ID change
function optionChanged(subjectId) {
    d3.json("data/samples.json").then((data) => {
    var demoInfo = data.metadata.filter(md => md.id == subjectId)
    var firstDemoInfo = demoInfo[0]
    
    // Recording the Demographic Info for original Subject and Changed Subject
    console.log(firstDemoInfo)
    console.log(demoInfo)
    // Saving the Washing Frequency from the Demographic Info of the Subject for the Gauge Chart
    var washfreq = firstDemoInfo['wfreq']
    console.log(washfreq)

    var demographInfo = d3.select("#sample-metadata");
    // Needing to clear the list for the change
    demographInfo.html("")
    // Appending the demographic info box 
    Object.entries(firstDemoInfo).forEach(([key, value]) => {
        demographInfo.append("p").text(`${key}:${value}`)
    })
    // Create a horizontal bar chart with a dropdown menu to display the top 10
    // OTUs found in that individual.

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
        title: "<b>Top 10 OTU IDs Belly Button Bar Chart</b>"
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
        xaxis: {title: {text: "OTU ID"}},
        height: 700, 
        width: 1200
    }
    Plotly.newPlot("bubble", trace_bubble, layout)

    // Creating a function for the gauge chart and gauge needle    
    function gaugePointer(value){
        
    // Trig to calc meter point moving meter 20 degrees for each wash
    var degrees = 180 - (20 * value),
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Create a path for the pointer to define pointer shape
    var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);
        
        return path;

    };
    // Designing the gauge features for the chart
    var wash_gauge = [{ 
        // Defining location and size of the pointer cap in the gauge
        type: 'scatter',
        x: [0], 
        y: [0],
        marker: {size: 18, color:'850000'},
        showlegend: false,
        name: 'washfreq',
        text: washfreq,
        hoverinfo: 'text+name'},
    // Assigning the number and width of each wedge segment for the gauge chart
    {values: [180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180],
    rotation: 90,
    // Adding the inner text and color to each wedge and which direction the text will display
    direction: 'clockwise',
    text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9', ''],
    textinfo: 'text',
    textposition:'inside',	  
    marker: {colors:[
          'rgb(190, 188, 182)',
          'rgb(183, 188, 175)',
          'rgb(176, 188, 156)',
          'rgb(170, 188, 137)',
          'rgb(163, 188, 118)',
          'rgb(156, 188, 100)',
          'rgb(149, 188, 81)',
          'rgb(142, 188, 62)',
          'rgb(130, 188, 45)',
          'white']},
    labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
    }];
    // Creating the layout for the pointer position based upon the wash frequency for the chosen subject
    var layout = {
    shapes:[{
        type: 'path',
        path: gaugePointer(washfreq),
        fillcolor: '850000',
        line: {
            color: '850000'
        }
        }],
        title: '<b>Belly Button Washing Frequency</b>' + '<br>' + 'Scrubs per Week',
        autosize:true,
    
    xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', wash_gauge, layout);

})};