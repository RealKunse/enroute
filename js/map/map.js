var map = L.map('mapId', {
    drawControl: true,
    maxBounds: [
        [29.54, 120.9539],
        [41, 135],
    ],
    maxBoundsViscosity: 1,
    addControl: {position: 'bottomright'},
}).setView([36, 127], 12);

// const layerControl = L.control.layers().addTo(map); // 레이어컨트롤 단일화 중

let p1 = L.latLng(26, 120),
    p2 = L.latLng(50, 137),
    bound = L.latLngBounds(p1, p2);

let center = L.latLng(36, 127);
L.tileLayer('css/Layer/{z}/{x}/{y}.png', {
    center: center,
    minZoom: 4,
    maxZoom: 12,
    attribution: 'Enroute Map v0.1.9',
    id: 'mapbox/streets-v11',
    tileSize: 256,
    zoomOffset: 0,
    // maxBounds:[[26,120],[40,135]],
}).addTo(map);

L.marker([51.5, -0.09])
    .addTo(map)
    .bindPopup('<b>Hello world!</b><br />I am a popup.')
    .openPopup();

// L.circle([51.508, -0.11], 500, {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5
// }).addTo(mymap).bindPopup("I am a circle.");

map.fitBounds([
    [26, 120],
    [40, 135],
]);

L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047],
])
    .addTo(map)
    .bindPopup('I am a polygon.');

var popup = L.popup();
// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent('' + e.latlng.toString())
//         .openOn(map);
// }
//
// map.on('click', onMapClick);


map.on('contextmenu', (e) => {
    const latlng = e.latlng;
    const context = `<div>${latlng}</div><div class="contextmenu-Popup-Item" onclick="testfunction(this)">pin</div><div class="contextmenu-Popup-Item" >2</div>`
    const popup = L.popup({closeButton: false, className: "contextmenu-Popup"});
    if (document.getElementsByClassName("contextmenu-Popup").length == 0) {
        popup.setLatLng(latlng)
            .setContent(
                context
            )
            .addTo(map);

        console.log(popup.isOpen())
    } else {
        document.getElementsByClassName("contextmenu-Popup")[0].remove()
    }

    testfunction = (ev) => {
        // console.log(ev.innerText);
        // console.log(e.latlng);
        map.closePopup(popup);
        const maponclick = map.on('click', e => {
                pl.disable();

        })
        const pl = new L.Draw.Polyline(map, drawControl.options.polyline);

        pl.enable();

        pl.addVertex(e.latlng);






    }
})


// map.on('draw:created', (e) => {
// 	console.log(e)
// 	let linetype = e.layerType,
// 		layer = e.layer;
// 	layer.addTo(map)
// })

// 우클릭 시 좌표 기능
// let isCalculating = false;
// let beforeCoordinateCalculate = [];
// map.on('contextmenu', function (e) {
//     let after = [];
//     // const mouseMoveListener = function
//
//     if (!isCalculating) {
//
//     	// map.addLayer()
//         const trackerDiv = document.createElement('div');
//         trackerDiv.id = 'trackerDiv';
//         document.getElementById('mapId').appendChild(trackerDiv);
//         trackerDiv.innerText = 'hdddi';
//
//         beforeCoordinateCalculate.push((e.latlng.lat).toFixed(6));
//         beforeCoordinateCalculate.push((e.latlng.lng).toFixed(6));
//
//         console.log(beforeCoordinateCalculate)
//         trackerDiv.addEventListener('mousemove', (e) => {
//
//         })
//
//
//         isCalculating = true;
//     } else {
//         after.push((e.latlng.lat).toFixed(6));
//         after.push((e.latlng.lng).toFixed(6));
//
//         console.log('before', beforeCoordinateCalculate, 'after', after)
//         console.log(Math.abs(Math.sqrt((Math.pow(beforeCoordinateCalculate[0] - after[0], 2))
//             + (Math.pow(beforeCoordinateCalculate[1] - after[1], 2)))) * 60)
//         isCalculating = false;
//         // trackerDiv.removeEventListener('mousemove', (e) => {
//         //     document.getElementById('trackerDiv').style.transform = 'translateY(' + (e.clientY - 80) + 'px)';
//         //     document.getElementById('trackerDiv').style.transform += 'translateX(' + (e.clientX - 100) + 'px)';
//         // })
//         const polline = L.polyline([beforeCoordinateCalculate, after], {color: '#ff7070', weight:5}).addTo(editableLayers);
// 		polline.on("click", (e) => {console.log(e.target); e.target.remove()})
// 		polline.on("mouseover", (e) => {e.target.setStyle({color:'red', weight:8 })});
// 		polline.on("mouseout", (e) => {e.target.setStyle({color:'#ff7070', weight:5})});
//
// 		beforeCoordinateCalculate = [];
//         document.getElementById('mapId').removeChild(trackerDiv)
//
//
//     }
//
// });

map.on("layeradd",(e) => {

})

