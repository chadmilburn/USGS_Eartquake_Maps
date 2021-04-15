//// Store API inside queryUrl -using hour data for inital build
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
//   preform request on url and retrieve features from GEOJson
d3.json(queryUrl, function (data) {
  createFeatures(data.features);
});

// map componet creation:

function createFeatures(earthquakeData) {
  // create pop ups for each location
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p>" + "Mag: " + feature.properties.mag + "</p>");
  }
  //Define radius of marker-day 1 activity 6
  function radiusSize(mag) {
    return mag * 10000;
  }
  // Define marker color -day 1 activity 7-use w3 html color picker https://www.w3schools.com/colors/colors_picker.asp
  function circleColor(mag) {
    if (mag < 1) {
      return "#e6f5ff"
    }
    else if (mag < 3) {
      return "#b3e0ff"
    }
    else if (mag < 4) {
      return "#80ccff"
    }
    else if (mag < 5) {
      return "#4db8ff"
    }
    else {
      return "#1aa3ff"
    }

  }
  // create GeoJSON layer
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (earthquakeData, latlng) {
      return L.circle(latlng, {
        radiusSize: (earthquakeData.properties.mag),
        color: circleColor(earthquakeData.properties.mag),
        fillOpacity: .75
      })
    },
    onEachFeature: onEachFeature
  })
  //  moving into next function
  createMap(earthquakes)
}

function createMap(earthquakes) {
  // define map layers-outdoors/topo, stellite, light
  var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });
  // fault layer
  var faultLine = new L.LayerGroup();

  // base maps
  var baseMaps ={
    "Outdoor Map" : outdoorsmap,
    "Light Map" : lightmap,
    "Satellite" : satmap
  }
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    FaultLines: faultLine
  };

  // Create our map, giving it the outdoors and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [outdoorsmap, earthquakes, faultLine]
  });
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  

}
