//// Store API inside queryUrl -using hour data for inital build
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
//   preform request on url and retrieve features from GEOJson
d3.json(queryUrl, function (data) {
  createFeatures(data.features);
});

// define each feature function
function createFeatures(earthquakeData) {
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
    },
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {
          radius: radiusSize(feature.properties.mag),
          fillColor: circleColor(feature.properties.mag),
          fillOpacity: .75,
          color: "",
        })
    }
  });
  createMap(earthquakes)
};

function createMap(earthquakes) {
  // Define map layers
  var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });
  var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });
  // define base maps
  var baseMaps = {
    "Outdoors Map": outdoorsmap,
    "Dark Map": darkmap,
    "Satellite Map": satmap
  };
  // -----------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------
  //  create overlay object
  var overlayMaps = {
    "Earthquakes": earthquakes
    // -----------------------
    // -----------------------
  };
  // Create our map, giving it the layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [outdoorsmap, earthquakes]
  });
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}


// marker functions:
function radiusSize(mag) {
  return mag * 50000
}
// function circleColor(mag){
//   if (mag<1){
//     return "#e6f5ff"
//   }
//   else if (mag<2){
//     return "#b3e0ff"
//   } 
//   else if (mag<3){
//     return "#80ccff"
//   }
//   else if (mag<4){
//     return "#4db8ff"
//   } else {
//     return "#1aa3ff"
//   }
// }
function circleColor(d) {
  return d > 1 ? '#800026' :
        d > 2 ? '#BD0026' :
        d > 3 ? '#E31A1C' :
        d > 4 ? '#FC4E2A' :
        d > 5 ? '#FD8D3C' :
        '#FFEDA0';
}