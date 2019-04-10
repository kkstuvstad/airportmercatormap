//map created
var planemap = L.map('map', {
  center: [],
  zoom: 5,
  maxZoom: 15,
  minZoom: 2,
  detectRetina: true
});

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(planemap);
