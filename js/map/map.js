var map = L.map('mapId', {
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


let testFunction = () => {
    var originalOnTouch = L.Draw.Polyline.prototype._onTouch;
    L.Draw.Polyline.prototype._onTouch = function (e) {
        if (e.originalEvent.pointerType != 'mouse') {
            return originalOnTouch.call(this, e);
        }
    }
};

class RangeBearing {
    rangeBearing = L.popup({closeButton: false, className: "contextmenu-Popup", autoPan:false});
    rangeBearingBool = false;
    firstLatLng;
    lastLatLng;
    polyLine;

    deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    calculate = (fl, ll) => {
        const x = this.deg2rad(ll['lng'] - fl['lng']);
        const y = this.deg2rad(ll['lat'] - fl['lat']);
        // console.log((Math.atan2(y,x)) * 180 / Math.PI);
        let degree = Math.round((Math.atan2(x, y)) * 180 / Math.PI);
        if (degree >= 0) {
            return {distance: ((L.CRS.Earth.distance(fl, ll) / 1000 * 0.62).toFixed(1)), angle: degree};
        } else {
            return {distance: ((L.CRS.Earth.distance(fl, ll) / 1000 * 0.62).toFixed(1)), angle: degree + 360};
        }
    }


}

const rb = new RangeBearing();

map.on('contextmenu', (e) => {
    if (!rb.rangeBearingBool) {
        rb.firstLatLng = e.latlng;
        const calcresult = rb.calculate(rb.firstLatLng, rb.firstLatLng);
        const context = `<div>Distance : ${calcresult['distance']}</div><div>Angle : ${calcresult['angle']}</div>`;
        rb.rangeBearingBool = true;

        rb.rangeBearing.setLatLng(e.latlng)
            .setContent(context)
            .addTo(map);

        console.log(rb.firstLatLng)

    } else {
        rb.rangeBearingBool = false;
    }
});

map.on("click", (e) => {
    if(rb.rangeBearingBool) {
        if (confirm('해당 커서 위치에 마커를 추가할까요?')) {
            L.marker(rb.lastLatLng).on('click', e => {
                e.target.remove();
            }).addTo(map);
        }
        rb.rangeBearingBool = false;
        $('.leaflet-rangeBearing').remove();
    }
});

map.on("mousemove", e => {
    if (rb.rangeBearingBool) {
        $('.leaflet-rangeBearing').remove();
        rb.lastLatLng = e.latlng;
        // rb.polyLine.remove();
        rb.polyLine = L.polyline([rb.firstLatLng, rb.lastLatLng],
            {pane: 'rangeBearing', className: 'leaflet-rangeBearing', color: '#e292d6'}
        ).addTo(map);
        const calcresult = rb.calculate(rb.firstLatLng, rb.lastLatLng);
        const context = `<div>거리 : ${calcresult['distance']}</div><div>각도 : ${calcresult['angle']}</div>`;
        rb.rangeBearing.setLatLng(e.latlng)
            .setContent(context);
    }
});


// map.on('draw:created draw:edited draw:deleted draw:drawstart draw:drawstop draw:drawvertex ', (event) => {
//     MarkerEventHandler(event)
// })

MarkerEventHandler = (e) => {
    console.log(e);
}
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

map.createPane('sector');
map.createPane('test_result_marker');
map.createPane('rangeBearing');
map.createPane('sitePane');
map.createPane('resultMarkerPane');

map.getPane('rangeBearing').style.zIndex = '600';
map.getPane('sector').style.zIndex = '300';
map.getPane('tooltipPane').style.zIndex = '800';
map.getPane('sitePane').style.zIndex = '350';
map.getPane('resultMarkerPane').style.zIndex = '550';
map.on("layeradd", (e) => {
    // console.log(e.layer.options.className);
    // console.log(e);
})


