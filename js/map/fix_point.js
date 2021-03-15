L.marker([51.5, -0.09]).addTo(map)
    .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();


let baseTree = {
    label: '오버레이',
    selectAllCheckbox: 'Un/select all',
    children: [
        {
            label: '표지소',
            selectAllCheckbox: true,
            collapsed: true,
            children: [
                {
                    label: 'France',
                    layer: L.marker([34.8582441, 135.2944775]),
                }, {
                    label: 'Germany',
                    selectAllCheckbox: true,
                    children: [
                        {label: 'Branderburger Tor', layer: L.marker([52.5162542, 13.3776805])},
                        {label: 'Kölner Dom', layer: L.marker([50.9413240, 6.9581201])},
                    ]
                }, {
                    label: 'Spain',
                    selectAllCheckbox: 'De/seleccionar todo',
                    children: [
                        {label: 'Palacio Real', layer: L.marker([40.4184145, -3.7137051])},
                        {label: 'La Alhambra', layer: L.marker([37.1767829, -3.5892795])},
                    ]
                }
            ]
        }, {
            label: 'Map',
            // collapsed: true,
            selectAllCheckbox: true,
            children: [
                {
                    label: '대구FIR',
                    selectAllCheckbox: true,
                    children: [
                        {label: 'Petra', layer: L.marker([30.3292215, 35.4432464])},
                        {label: 'Wadi Rum', layer: L.marker([29.6233486, 35.4390656])}
                    ]
                }, {
                    label: '인천FIR',
                    selectAllCheckbox: true,
                    children: [
                        {label: 'Petra', layer: L.marker([30.3292215, 35.4432464])},
                        {label: 'Wadi Rum', layer: L.marker([29.6233486, 35.4390656])}
                    ]
                    /* ... */
                }, {
                    label: '항로',
                    selectAllCheckbox: true,
                    children: [
                        {
                            label: 'A593',
                            selectAllCheckbox: true,
                            children: [
                                {
                                    label: 'test',
                                    layer: L.marker([29.6233486, 35.4390656])
                                }
                            ],
                        },
                        {
                            label: 'B572',
                            selectAllCheckbox: true,
                            children: [
                                {
                                    label: 'test',
                                    layer: L.marker([29.6233486, 35.4390656])
                                }
                            ],

                        }
                    ]
                }
            ]
        },
    ]
}

const ctl = L.control.layers.tree(null, baseTree, {collapsed: true})

ctl.addTo(map).collapseTree()

let accumulatePin = true;

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
                    baseTree.children[1].children[2].children[1].children.push({
                        label: res[i].PointName,
                        layer: L.marker([res[i].PointLng, res[i].PointLat], {icon: fix_icon}).bindTooltip(res[i].PointName),
                    })
                }

                // const fix_group = L.layerGroup(fix_points).addTo(map);
                // layerControl.addOverlay(fix_group, "픽스점")
                ctl.setOverlayTree(baseTree)
                // basetree 해결하기
            })


        }).catch(err => console.error(err))
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
    L.polyline(latlngs, {color: color}).addTo(map);

}


calculateCoordinate = () => {
    const siteSelect = document.getElementById("thirdLabel").innerText;
    const distance = document.getElementById('thirdDistance').value;
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

    if (angle == '' && angle != 0) {
        alert("각도를 입력해 주세요!");
        return;
    }

    let lng = markers[site.indexOf(siteSelect)][1] + Math.sin(angle * Math.PI / 180) * distance / 48
    let lat = markers[site.indexOf(siteSelect)][0] + Math.cos(angle * Math.PI / 180) * distance / 60

    //## distance 에 곱할 값 구해야함,,,,
    console.log(lat, lng);

    L.marker([lat, lng]).addTo(map);
    // console.log([markers[site.indexOf(siteSelect)], [lat,lng]])
    drawRoutebyCoordinate([markers[site.indexOf(siteSelect)], [lat, lng]], "red")

}


accumulatePins = (cb) => {
    if (cb.checked) {
        accumulatePin = true;
    } else {
        accumulatePin = false;
    }
}

remap = (value) => {
    // in_min_x : -187.05, in_max_x : 285.28
    // in_min_y : -359.7, in_max_y : 133.39

    console.log([(value[0] - (-187.05)) * (133.39 - 124.0) / (285.28 - (-187.05)) + 124.0,
        (value[1] - (-359.7)) * (38.38 - 30) / (163.47 - (-359.7)) + 30])

    L.marker([(value[1] - (-359.7)) * (38.38 - 30) / (163.47 - (-359.7)) + 30,
        (value[0] - (-187.05)) * (133.39 - 124.0) / (285.28 - (-187.05)) + 124.0]).addTo(map);

    // return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


onRouteUpload = (e) => {
    e.preventDefault();
        const file = document.getElementById('firstRouteUpload').files[0]
        const fileData = new FormData();

        if (!file) return;
        fileData.append('dat', file);

        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/dat',
            processData: false,
            contentType: false,
            data: fileData,
            timeout: 3000,
            cache: false,
            encode: true,
        });

}
//
// $(document).ready(() => {
//     try {
//         $(() => {
//             console.log('ajax');
//             $('#firstUploadForm').on('submit',(event) => {
//                 event.preventDefault();
//
//                 const file = document.getElementById('firstRouteUpload').files[0]
//                 const fileData = new FormData(event.target);
//                 console.log(file)
//                 console.log(fileData)
//                 console.log(event.target)
//                 if (!file) return;
//                 fileData.append('dat', document.getElementById('firstRouteUpload').files[0]);
//
//                 $.ajax({
//                     type: 'POST',
//                     url: 'http://localhost:3000/dat2',
//                     processData: false,
//                     contentType: false,
//                     data: fileData,
//                     timeout: 3000,
//                     cache: false,
//                     encode: true,
//                 });
//             })
//         })
//     } catch (error) {
//         console.log(error)
//     }
// })