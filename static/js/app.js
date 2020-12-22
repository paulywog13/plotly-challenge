// Read in samples.json data for file
d3.json(samples.json, function(data) {
    console.log(data);
});    

    
// // Create an array of each sample's numbers
// var 940 = Object.values(names.940);
// // var uk = Object.values(data.uk);
// // var canada = Object.values(data.canada);

// // Create an array of music provider labels
// var labels = Object.keys(names.940);

// // Display the default plot
// function init() {
//     var data = [{
//       values: 940,
//       labels: labels,
//       type: "pie"
//     }];
  
//     var layout = {
//       height: 600,
//       width: 800
//     };
  
//     Plotly.newPlot("pie", data, layout);
//   }

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

// // Update the restyled plot's values
// function updatePlotly(newdata) {
//   Plotly.restyle("pie", "values", [newdata]);
// }
  
// init();
  