mapboxgl.accessToken =
"pk.eyJ1IjoibHVja3l6aGFuZzEyNiIsImEiOiJjbGNxYmx1dWcwNGYxM3Jtc2tjcWlwbHplIn0.3w6oZqYD1oz1RTGj-OJiRQ";

const Edinburgh_SIMD = "mapbox://styles/luckyzhang126/cldk8zd0t002901rnpfawnpxh"; 
const EdinburghAnnualDailyAverageCarFlow= "mapbox://styles/luckyzhang126/cldho0pbk001n01rn2784esc0";

const TheStatisticAndDataAtEachPoint="mapbox://styles/luckyzhang126/cle3j75pk000v01tfm26klckv";


const map = new mapboxgl.Map({
  container: "map", // container ID
  style: Edinburgh_SIMD,
  center: [ -3.184029,55.949412],
  zoom:10
});



const layerList = document.getElementById("menu");
const inputs = layerList.getElementsByTagName("input");

//On click the radio button, toggle the style of the map.
for (const input of inputs) {
  input.onclick = (layer) => {
    if (layer.target.id == "Edinburgh_SIMD") {
      map.setStyle(Edinburgh_SIMD);
    }
    if (layer.target.id == "EdinburghAnnualDailyAverageCarFlow") {
      map.setStyle(EdinburghAnnualDailyAverageCarFlow);
    }
    if (layer.target.id == "TheStatisticAndDataAtEachPoint") {
      map.setStyle(TheStatisticAndDataAtEachPoint);
     
    }
  };
}




map.on('load', () => {
  
  const layers = [
    "<10",
    "20 ",
    "30 ",
    "40 ",
    "50 ",
    "60 ",
    "70 ",
    "80 ",
    "90 ",
    "100"
  ];
  const colors = [
    "#7f3b08",
    "#b35806",
    "#e08214",
    "#fdb863",
    "#fedfb4",
    "#d8daeb",
    "#b2abd2",
    "#8073ac",
    "#542788",
    "#2d004b"
  ];

  // create legend
  const legend = document.getElementById("legend");

  layers.forEach((layer, i) => {
    const color = colors[i];
const key = document.createElement("div");
//place holder
    key.className = "legend-key";
    key.style.backgroundColor = color;
    key.innerHTML = `${layer}`;

    legend.appendChild(key);
     if (i <= 1 || i >= 8) {
      key.style.color = "white";
    }

   
  });
  

  
  
  map.on("render", () => {
  map.addSource("hover", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] }
  });

  map.addLayer({
    id: "dz-hover",
    type: "line",
    source: "hover",
    layout: {},
    paint: {
      "line-color": "Red",
      "line-width": 3
    }
  });
    
  //Slider interaction code goes below


  });

});    

const geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: "Search for places in Edinburgh", // Placeholder text for the search bar
  proximity: {
    longitude: 55.8642,
    latitude: 4.2518
  } 
});

map.addControl(geocoder, "top-right");

 map.addControl(new mapboxgl.NavigationControl(), "top-right")
map.setMinZoom(9.5)

map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
  }),
  "top-right"
);


 map.on("mousemove", (event) => {
  const dzone = map.queryRenderedFeatures(event.point, {
    layers: ["edinburgh-simd"]
  });
  document.getElementById("pd").innerHTML = dzone.length
    ? `<p> <strong> State:</strong> ${dzone[0].properties.DZName}</p>
    <p> <strong>Value:</strong> ${dzone[0].properties.Decilev2} ha</p>`
    : `<p>The base map is a Scottish Index of Multiple Deprivation(SIMD)  map of Edinburgh. Try to use the mouse to hover over the two layers and click the green iconsin the third map(Vehicle flow counting points). Summarize what did you find out?</p>`;

  map.getSource("hover").setData({
    type: "FeatureCollection",
    features: dzone.map(function (f) {
      return { type: "Feature", geometry: f.geometry };
    })
  });
 });
 
  
filterType = ['!=', ['get', 'year'], 'placeholder']
document.getElementById('filters').addEventListener('change', (event) => {
  const type = event.target.value;
    console.log(type);
  // update the map filter
  if (type == 'all') {
    filterType = ['!=', ['get', 'year'], 'placeholder'];
  }  else {
    console.log('error');
  }
  map.setFilter('crimes', ['all', filterType]);
});

map.on('click', (event) => {
// If the user clicked on one of your markers, get its information.
const features = map.queryRenderedFeatures(event.point, {
 layers: ['Data point'] // replace with your layer name
});
if (!features.length) {
 return;
}
const feature = features[0];
/*
 Create a popup, specify its options
 and properties, and add it to the map.
 */
const popup = new mapboxgl.Popup({ offset: [0, -15] })
.setLngLat(feature.geometry.coordinates)
.setHTML(`<h5>Road Name: ${feature.properties.road_name}</h5><p3>${feature.properties.all_motor_vehicles
}</p3>`
)
.addTo(map);
});