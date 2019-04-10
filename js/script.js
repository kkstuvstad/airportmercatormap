//map created
var planemap = L.map('map', {
  center: [39.828371, -98.579480],
  zoom: 5,
  maxZoom: 15,
  minZoom: 2,
  detectRetina: true
});

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(planemap);

//adds airport points
var airports = null;
airports = L.geoJson.ajax("assets/airports.geojson",{
  attribution: 'Airport data credentials'
});
airports.addTo(planemap);

//adding color
//var colors = chroma.scale('').mode('').colors();
