//projection specified for map (WGS 1984 Web Mercator)
var mycrs = new L.Proj.CRS('SR-ORG:45', //change projection for fitting U.S.
    '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +units=m +no_defs',
    {
        resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64]
    }
);

//map created
var planemap = L.map('map', {
  crs: mycrs,
  center: [39.828371, -98.579480],
  zoom: 1,
  maxZoom: 7,
  minZoom: 1,
  detectRetina: true
});

//adds airport points
var airports = null;
airports = L.geoJson.ajax("assets/airports.geojson",{
  attribution: 'US States &copy; Mike Bostock, D3 | Airports &copy; Data.gov | Base Map &copy; CartoDB | Made By Kristoffer Stuvstad',
  pointToLayer: function (feature, latlng) {
      var id = 0;
      if (feature.properties.CNTL_TWR == "Y") { id = 0; }
      else if (feature.properties.CNTL_TWR == "N")  { id = 1; }
      else { id = 2; }
      //paper plane icon from Font Awesome displayed
      return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-paper-plane marker-color-' + (id + 1).toString() })});
    },
  onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.AIRPT_NAME); //displays airport name upon clicking on feature
  }
}).addTo(planemap);

//adds color to airport locations
var colors = chroma.scale('PRGn').mode('lch').colors(2);

for (i = 0; i < 2; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}

colors = chroma.scale('YlOrRd').colors(6); //sets scale of airports from yellow (light) to red (multiple)

//assigns color to state based on number of airports
function setColor(density) {
    var id = 0;
    if (density > 50) { id = 5; }
    else if (density > 40 && density <= 50) { id = 4; }
    else if (density > 30 && density <= 40) { id = 3; }
    else if (density > 20 && density <= 30) { id = 2; }
    else if (density > 10 &&  density <= 20) { id = 1; }
    else  { id = 0; }
    return colors[id];
}

function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4'
    };
}

//adds states to map
L.geoJson.ajax("assets/us-states.geojson", {
    style: style
}).addTo(planemap);

//adds legend to the map
var legend = L.control({position: 'topright'});

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b>Number of Airports</b><br />';
    div.innerHTML += '<i style="background: ' + colors[5] + '; opacity: 0.5"></i><p>50+</p>';
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>41-50</p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>31-40</p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>21-30</p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p>11-20</p>';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p>0-10</p>';
    div.innerHTML += '<hr><b>Airport Type<b><br />';
    div.innerHTML += '<i class="fa fa-paper-plane marker-color-1"></i><p> Contains Control Tower</p>';
    div.innerHTML += '<i class="fa fa-paper-plane marker-color-2"></i><p> No Control Tower</p>';
    return div;
};

legend.addTo(planemap);

//graticule added to map
L.latlngGraticule({
    showLabel: true,
    opacity: 0.8,
    weight: 1.5,
    color: "#008000", //set color to green
    font: "16px Ubuntu",
    fontColor: "#800080", //set font color to purple
    zoomInterval: [
        {start: 1, end: 1.5, interval: 2},   //sets interval to 2 degrees for initial zoom level of 1
        {start: 2, end: 3, interval: 1},     //sets interval of graticule to 1 degree for higher view
        {start: 4, end: 5, interval: 0.5},   //sets interval to 0.5 degrees for closer space
        {start: 6, end: 7, interval: 0.25}   //sets interval to 0.25 degrees for closest space
    ]
}).addTo(planemap);

var hideLabel = function(label){ label.labelObject.style.opacity = 0;}; //used to hide labels if necessary
var showLabel = function(label){ label.labelObject.style.opacity = 1;}; //used to show labels if necessary
var labelEngine = new labelgun.default(hideLabel, showLabel);
var labels = [];

//creates the state labels
var states = null;
states = L.geoJson.ajax("assets/us-states.geojson", {
    style: style,
    onEachFeature: function (feature, label) {
        //assigns state name to label
        label.bindTooltip(feature.properties.name, {className: 'feature-label', permanent:true, direction: 'center'});
        labels.push(label);
    }
}).addTo(planemap);

//adds state labels
function addLabel(layer, id) {
    var label = layer.getTooltip()._source._tooltip._container;
    if (label) {
        //bounding box created
        var rect = label.getBoundingClientRect();

        var bottomLeft = planemap.containerPointToLatLng([rect.left, rect.bottom]);
        var topRight = planemap.containerPointToLatLng([rect.right, rect.top]);
        var boundingBox = {
            bottomLeft : [bottomLeft.lng, bottomLeft.lat],
            topRight   : [topRight.lng, topRight.lat]
        };

        labelEngine.ingestLabel(
            boundingBox,
            id,
            parseInt(Math.random() * (5 - 1) + 1),
            label,
            label.innerText,
            false
        );

        //adds label in case it has not already been added
        if (!layer.added) {
            layer.addTo(planemap);
            layer.added = true;
        }
    }

}

//adjusts viewing zoom level
planemap.on("zoomend", function(){
    var i = 0;
    states.eachLayer(function(label){
        addLabel(label, ++i);
    });
    labelEngine.update();
});
