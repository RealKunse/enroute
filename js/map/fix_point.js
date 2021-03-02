L.marker([51.5, -0.09]).addTo(map)
    .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

let fix_points = [];
let fix_dicts = {};

let fix_icon = L.icon({
    iconUrl: 'css/images/Fix_point.png',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
})


loadFixPoints = () => {
    fetch("http://localhost:3000/fix_point", {method: "GET"})
        .then(res => {
            res.json().then(res => {
                console.log(res[0]);
                for (i in res) {
                    fix_points.push(
                        L.marker(L.latLng(res[i].PointLng, res[i].PointLat), {icon: fix_icon}).bindTooltip(`${res[i].PointName}`)
                    );
                    fix_dicts[res[i].PointName] = L.latLng(res[i].PointLng, res[i].PointLat)
                }

                console.log(fix_dicts)
                let fix_group = L.layerGroup(fix_points).addTo(map);
                layerControl.addOverlay(fix_group,"픽스점")
            })


        }).catch(err => console.err(err))
}


drawRoute = (array, color) => {
    let latlngs = []
    for(i in array){
        latlngs.push(fix_dicts[array[i]])
    }
    L.polyline(latlngs, {color: color}).addTo(map);
    console.log(latlngs)
}
