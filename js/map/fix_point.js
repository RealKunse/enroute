L.marker([51.5, -0.09]).addTo(map)
    .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();


let baseTree = {
    label: 'Controller',

    children: [
        {
            label: 'sector',
            selectAllCheckbox: true,
            children:
                [
                    // {label: '군산서부', layer: L.marker([])},
                ]

        },
        {
            label: '픽스점',
            selectAllCheckbox: true,
            layer: [L.layerGroup()],
        }
    ]
}

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
                for (i in res) {
                    fix_points.push(
                        L.marker(L.latLng(res[i].PointLng, res[i].PointLat), {icon: fix_icon}).bindTooltip(`${res[i].PointName}`)
                    );
                    fix_dicts[res[i].PointName] = L.latLng(res[i].PointLng, res[i].PointLat)
                    baseTree.children[1].layer.push({
                        label: res[i].PointName,
                        layer: L.marker([res[i].PointLng, res[i].PointLat], {icon: fix_icon}).bindTooltip(res[i].PointName),
                    })
                }
                // console.log(baseTree.children[1].layer);

                const fix_group = L.layerGroup(fix_points).addTo(map);
                layerControl.addOverlay(fix_group, "픽스점")
                // L.control.layers.tree(baseTree, null, null).addTo(map)
                // basetree 해결하기
            })


        }).catch(err => console.err(err))
}


drawRoutebyFix = (array, color) => {
    let latlngs = []
    for (i in array) {
        latlngs.push(fix_dicts[array[i]])
    }
    console.log(latlngs)
    L.polyline(latlngs, {color: color}).addTo(map);

}

drawRoutebyCoordinate = (array, color) => {
    let latlngs = []
    for (i in array) {
        latlngs.push(array[i])
    }
    console.log(latlngs)
    L.polyline(latlngs, {color: color}).addTo(map);

}


calculateCoordinate = () => {
    const siteSelect = document.getElementById("thirdLabel").innerText;
    const distance = document.getElementById('thirdDistance').value / 50;
    const angle = parseInt(document.getElementById('thirdAngle').value);

    // console.log(site)
    if (siteSelect == "선택") {
        alert("기준이 될 표지소를 선택해 주세요!");
        return;
    }

    if (distance == '') {
        alert("거리 값을 입력해주세요! \n기준은 100ft 입니다.");
        return;
    } else if (parseInt(distance) < 0 || parseInt(distance) > 300) {
        alert('거리 값을 0 과 300 이내로 입력해주세요! \n기준은 100ft 입니다.')
    }

    if (angle == '') {
        alert("각도를 입력해 주세요!");
        return;
    }

    let lng = markers[site.indexOf(siteSelect)][1] + Math.sin(angle * Math.PI / 180) * distance
    let lat = markers[site.indexOf(siteSelect)][0] + Math.cos(angle * Math.PI / 180) * distance

    //## distance 에 곱할 값 구해야함,,,,

    L.marker([lat, lng]).addTo(map);
    // console.log([markers[site.indexOf(siteSelect)], [lat,lng]])
    drawRoutebyCoordinate([markers[site.indexOf(siteSelect)], [lat, lng]], "red")


}