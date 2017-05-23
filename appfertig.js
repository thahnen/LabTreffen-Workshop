// Funktion die beim Aufrufen der Website aufgerufen wird
$(document).ready(function() {
    $.getJSON( "containerstandorte.json", function( data ) {
        create_map(data)
    });
});

// Unsere Funktion, die sich um alles kümmert
function create_map(json_data) {
    // Mittelpunkt der Karte auf Moers setzen -> auf Div verweisen
    var map = L.map('map').setView([52.201675, 10.507759], 7);

    // OpenStreetMap Daten einbinden, damit man eine Karte sieht
    L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Zoom-Level der Karte setzen (wie nah man dran ist)
    map._layersMinZoom = 5;

    // Das Müllicon für die Standordte hinzufügen
    var icon_container = L.icon({
        iconUrl: 'icons/leaflet_icon_own_kreis.png',
        iconSize:     [36, 36],
        popupAnchor: [0, -26]
    });


    var markers = L.markerClusterGroup();

    // Das wichtige, handhabt die Karte
    var geoJsonLayer = L.geoJson(json_data, {
        // Was soll an den Stellen (Koordinaten) passieren, wo etwas in der GeoJSON steht?
        pointToLayer: function(feature, latlng) {
            // Da soll unser schöner Marker auftauchen
            return L.marker(latlng, {
                icon: icon_container
            });
        },
        // Was soll passieren, wenn man auf eines dieser Icons klickt?
        // Ein einfaches Popup (in Leaflet integriert) öffnet sich und
        // Zeigt die in der GeoJSON gespeicherten Daten an :)
        onEachFeature: function (feature, layer) {
            var popup = `
                  <h2>` + feature.properties.NAME + `</h2>
                  <p>
                      <h3>Straße:</h3>    ` + feature.properties.STRASSE_HA + `<br /><br />
                      <h3>Bemerkung:</h3> ` + feature.properties.BEMERKUNG + `<br />
                  </p>
            `;
            layer.bindPopup(popup);
        }
    // Und was wird mit den ganzen Popups, Icons usw gemacht?
    // Zur Karte hinzugefügt
    }).addTo(map)
          .on('load', function () {
            map.fitBounds(regionsGeojson.getBounds());
          });

    map.fitBounds(geoJsonLayer.getBounds());
}
