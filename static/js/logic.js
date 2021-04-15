//// Store API inside queryUrl -using hour data for inital build
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
//   preform request on url and retrieve features from GEOJson
d3.json(queryUrl, function (data) {
  createFeatures(data.features);
});

// nested functions to create map

function createFeatures(earthquakeData) {
  // create pop ups for each location
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p>" + "Mag: " + feature.properties.mag + "</p>");
  }
  //Define radius of marker-day 1 activity 6
  function radiusSize(mag){
    return mag * 10000;
  }
  

}