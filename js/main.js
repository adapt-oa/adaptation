
//////////////////////////////////////////////////////////////////////////
// Scene 1: Hatchery

var colors = chroma.scale(['#A5BF15', '#C9F5F6']).mode('lch').colors(6);

for (i = 0; i < 6; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 16px; text-shadow: 1px 1px 1px #000000; opacity: 0.5;} </style>"));
}

var colors2 = ['#2c7bb6', '#abd9e9', '#ffffbf', '#fdae61', '#d7191c'];

for (i = 0; i < 5; i++) {
    $('head').append($("<style> .marker-color2-" + (i + 1).toString() + " { color: " + colors2[i] + "; font-size: 16px; opacity: 0.5; text-shadow: 1px 1px 1px #000000;} </style>"));
}

// Layer, Scene, and Storymap Management
var layers = {
    netarts: {
        layer: L.geoJson.ajax('assets/netarts.geojson', {
            color: 'black',
            weight: 2,
            opacity: 0.3,
            onEachFeature: onEachFeature
        })
    },
    stakeholders: {
        layer: L.geoJson.ajax('assets/stakeholders.geojson', {
            pointToLayer: function (feature, latlng) {
                var id = 0;
                var ico = "users";
                if (feature.properties.type === "HATCHERY") { id = 0; ico = "fas fa-database"; }
                else if (feature.properties.type === "GROWER") { id = 1; ico = "fab fa-pagelines"; }
                else if (feature.properties.type === "TRIBE") { id = 2; ico = "fas fa-leaf"; }
                else if (feature.properties.type === "PROCESSOR") { id = 3; ico = "fas fa-industry"; }
                else if (feature.properties.type === "DISTRIBUTOR") { id = 4; ico = "fas fa-shipping-fast"; }
                else { id = 5; ico = "fas fa-exchange-alt"} // "RETAILER"
                return L.marker(latlng, {icon: L.divIcon({className: ico + " " + 'marker-color-1'})});
            }
        })
    },
    stakeholders2: {
        layer: L.geoJson.ajax('assets/stakeholders.geojson', {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: L.divIcon({className: "fas fa-ban stakeholders-warning"})});
            }
        })
    },
    whiskey_lines: {
        layer: L.geoJson.ajax('assets/whiskey_network.geojson', {
            style: function(feature) {
                return {
                    color: 'green',
                    dashArray: "20, 10",
                    weight: 4,
                    opacity: 0.15
                };
            }
        })
    },
    hatchery: {
        layer: L.geoJson.ajax('assets/hatchery.geojson', {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: L.divIcon({
                        className: "fas fa-database fa-5x hatchery"})});
            },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip(feature.properties.name, {sticky: true, className: "feature-tooltip"});
            }
        })
    },
    hatchery2: {
        layer: L.geoJson.ajax('assets/hatchery.geojson', {
            color: 'black',
            weight: 2,
            opacity: 0.3,
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: L.divIcon({
                        className: "fas fa-database fa-2x hatchery"})});  // changed from 5x to 2x size
            },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip(feature.properties.name, {sticky: true, className: "feature-tooltip"});
            }
        })
    },
    hatchery3: {
        layer: L.geoJson.ajax('assets/hatchery.geojson', {
            color: 'black',
            weight: 2,
            opacity: 0.3,
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: L.divIcon({
                        className: "fas fa-exclamation-triangle fa-2x blinking hatchery-warning"})});
            },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip(feature.properties.name, {sticky: true, className: "feature-tooltip"});
            }
        })
    },
    funded_projects: {
        layer: L.geoJson.ajax('assets/funded_projects.geojson', {
            style: function (feature, layer) {
                return {
                    weight: 10,
                    opacity: 0.5
                };
            },
            pointToLayer: function (feature, latlng) {
                var id = 0;
                if (feature.properties.funding_agency === "National Oceanic and Atmospheric Administration") { id = 0; }
                else if (feature.properties.funding_agency === "National Science Foundation") { id = 1; }
                else if (feature.properties.funding_agency === "Environmental Protection Agency") { id = 2; }
                else if (feature.properties.funding_agency === "Oregon State General Fund") { id = 3; }
                else { id = 4; } // "Bonneville Power Adminstration"
                return L.marker(latlng, {icon: L.divIcon({className: "fas fa-flask projects" + " " + 'marker-color2-' + (id + 1).toString() })});
            },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip(feature.properties.asset, {sticky: true, className: "feature-tooltip"});
            }
        })
    },
    funding_lines: {
        layer: L.geoJson.ajax('assets/funding_lines.geojson', {
            style: function(feature) {
                return {
                    color: 'gray',
                    dashArray: "20, 10",
                    weight: 4,
                    opacity: 0.15
                };
            }
        })
    },
    shellfish: {
        layer: L.tileLayer('https://api.mapbox.com/styles/v1/katzbr/cji2mcqbx0t4q2rqxu3vxok9s/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2F0emJyIiwiYSI6ImNqOHhmMnBucDIwZm4ycW8ya2d5cHF0cmsifQ.8rcjz0DyWs_ncWfOZ0VwKA')
    }
};

var scenes = {
    overview: {lat: 45.408, lng: -123.960140, zoom: 13, name: 'Overview', layers: []},
    whiskey: {lat: 45.408, lng: -123.950140, zoom: 13, name: 'Whiskey Creek', layers: [layers.hatchery, layers.netarts, layers.shellfish]},
    network: {lat: 46, lng: -124, zoom: 7, name: 'Importance to Network', layers: [layers.hatchery2, layers.stakeholders, layers.whiskey_lines, layers.shellfish]},
    seed: {lat: 46, lng: -124, zoom: 7, name: 'Oyster Seed Crisis', layers: [layers.hatchery3, layers.stakeholders2, layers.shellfish]},
    adaptation: {lat: 46, lng: -124, zoom: 7, name: 'Adaptive Capacity', layers: [layers.funded_projects, layers.funding_lines, layers.shellfish]},
    success: {lat: 45.408, lng: -123.960140, zoom: 13, name: 'Successful Adaptation', layers: [layers.hatchery, layers.shellfish]},
    end: {lat: 45.408, lng: -123.960140, zoom: 13, name: 'The End', layers: []}
};

$('#storymap').storymap({
    scenes: scenes,
    layers: layers,
    baselayer: layers.shellfish,
    legend: true,
    credits: "",
    loader: true,
    scalebar: false,
    navwidget: true,

    createMap: function () {
        // create a map in the "map" div, set the default view and zoom level
        var map = L.map($(".storymap-map")[0], {
            zoomControl: false,
            scrollWheelZoom: false
        }).setView([45.408, -123.960140], 13);

        return map;
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////
// Interactive Features.

// function highlightFeature(e) {
//     var layer = e.target;
//     layer.setStyle({
//         weight: 8,
//         opacity: 0.8,
//         color: '#ffffff',
//         fillColor: '#9FD3DB',
//         fillOpacity: 0.5
//     });
//     layer.bringToFront();
// }

// function resetHighlight(e) {
//     e.resetStyle(layers.netarts);
// }

function onEachFeature(feature, layer) {
    // layer.on({
    //     mouseover: highlightFeature
    //     mouseout: resetHighlight
    // });
    layer.bindTooltip(feature.properties.name, {sticky: true, className: "feature-tooltip"});
}
