var map = L.map('mapId',{
    maxBounds: [[29.54,120.9539],[41,135]],
    maxBoundsViscosity:1,
    addControl:{position:'bottomright'}
}).setView([36,127], 12);

const layerControl = L.control.layers().addTo(map);



let p1 = L.latLng(26,120),
    p2 = L.latLng(50,137),
    bound = L.latLngBounds(p1, p2);

let center = L.latLng(36,127);
L.tileLayer(
    'css/Layer/{z}/{x}/{y}.png', {
        center: center,
        minZoom: 4,
        maxZoom: 12,
        attribution: 'Enroute Map v0.1.1',
        id: 'mapbox/streets-v11',
        tileSize: 256,
        zoomOffset: 0,
        // maxBounds:[[26,120],[40,135]],
    }).addTo(map);



L.marker([51.5, -0.09]).addTo(map)
    .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

// L.circle([51.508, -0.11], 500, {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5
// }).addTo(mymap).bindPopup("I am a circle.");

map.fitBounds([
    [26,120],
    [40,135]
]);



L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map).bindPopup("I am a polygon.");


var popup = L.popup();

// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent('' + e.latlng.toString())
//         .openOn(map);
// }
//
// map.on('click', onMapClick);


