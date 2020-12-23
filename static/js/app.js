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
    // Inputting data for bar chart
    var graphInfo = data.samples.filter(sd => sd.id == subjectId)
    var firstGraphInfo = graphInfo[0]
    // Slice for the top ten otu values
    var otuIds = firstGraphInfo.otu_ids.slice(0, 10).reverse().map(otus => `otu Id:${otus}` )
    var sampVals = firstGraphInfo.sample_values.slice(0, 10).reverse()
    var otuLabels = firstGraphInfo.otu_labels.slice(0, 10).reverse() 
    // Creating trace for bar chart setup
    trace1 = [{
        x: sampVals, 
        y: otuIds, 
        text: otuLabels,
        type: 'bar',
        orientation: "h"
    }]
    layout = {
        title: "Belly Button Bar Chart"
    }
    Plotly.newPlot("bar", trace1, layout)
    // Trace for the bubble charts
    trace2 = [{
        x: firstGraphInfo.otu_ids, 
        y: firstGraphInfo.sample_values,
        text: firstGraphInfo.otu_label,
        mode: "markers",
        marker: {color: firstGraphInfo.otu_ids, size:  firstGraphInfo.sample_values}
    }]
    Plotly.newPlot("bubble", trace2)
    })};


// // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
// // Sort the otu data by samples
// data.sort(
//     function(a, b) {
//         if (a.names === b.) 
//     }
//     )

// // Call updatePlotly() when a change takes place to the DOM
// d3.selectAll("#selDataset").on("change", getData);

// // This function is called when a dropdown menu item is selected
// function getData() {
//     // Use D3 to select the dropdown menu
//     var dropdownMenu = d3.select("#selDataset");
//     // Assign the value of the dropdown menu option to a variable
//     var dataset = dropdownMenu.property("value");
//     // Initialize an empty array for the sample's data
//     var data = [];

//     if (dataset == "940") {
//         names = 940;
//     }
//     updatePlotly(data);
// }

// // // Update the restyled plot's values
// // function updatePlotly(newdata) {
// //   Plotly.restyle("pie", "values", [newdata]);
// // }
  
// // init();
  