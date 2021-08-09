L.marker([51.5, -0.09])
    .addTo(map)
    .bindPopup('<b>Hello world!</b><br />I am a popup.')
    .openPopup();

/*

const areas = {
    "서해북부": westSeaNorth,
    "서해남부": westSeaSouth,
    "강릉": gangneung,
    "동해": eastSea,
    "군산동부": gunsanEast,
    "군산서부": gunsanWest,
    "광주서부": gwangjuWest,
    "광주동부": gwangjuEast,
    "제주서부": jejuWest,
    "제주중부": jejuMiddle,
    "제주동부": jejuEast,
    "남해": namhae,
    "포항": pohang,
    "대구": daegu
}
 */

let numeric = 1;
let baseTree = {
    label: 'Overlays',
    selectAllCheckbox: 'select all',
    children: [
        {
            label: '섹터',
            selectAllCheckbox: true,
            collapsed: true,
            children: [
                // {
                //     label: '서해북부',
                //     layer: westSeaNorth,
                // },
                // {
                //     label: '서해남부',
                //     layer: westSeaSouth,
                // },
                // {
                //     label: '강릉',
                //     layer: gangneung,
                // },
                // {
                //     label: '동해',
                //     layer: eastSea,
                // },
                // {
                //     label: '군산동부',
                //     layer: gunsanEast,
                // },
                // {
                //     label: '군산서부',
                //     layer: gunsanWest,
                // },
                // {
                //     label: '광주서부',
                //     layer: gwangjuWest,
                // },
                // {
                //     label: '광주동부',
                //     layer: gwangjuEast,
                // },
                // {
                //     label: '제주서부',
                //     layer: jejuWest,
                // },
                // {
                //     label: '제주중부',
                //     layer: jejuMiddle,
                // },
                // {
                //     label: '제주동부',
                //     layer: jejuEast,
                // },
                // {
                //     label: '남해',
                //     layer: namhae,
                // },
                // {
                //     label: '포항',
                //     layer: pohang,
                // },
                // {
                //     label: '대구',
                //     layer: daegu,
                // },
            ],
        },
        {
            label: '표지소',
            selectAllCheckbox: 'unselect all',
            collapsed: true,
            eventedClasses: {
                selectAll: true,
            },
            children: [],
        },
        {
            label: '저고도',
            selectAllCheckbox: 'unselect all',
            collapsed: true,
            eventedClasses: {
                selectAll: true,
            },
            children: [],
        },
        {
            label: 'VORTAC',
            selectAllCheckbox: 'unselect all',
            collapsed: true,
            eventedClasses: {
                selectAll: true,
            },
            children: [],
        },
        {
            label: 'Map Assets',
            collapsed: true,
            selectAllCheckbox: true,
            children: [
                {
                    label: '항로',
                    collapsed: true,
                    selectAllCheckbox: true,
                    children: [],
                },
            ],
        },
    ],
};

const ctl = L.control.layers.tree(null, baseTree);


let accumulatePin = true;

let fix_points = [];
let fix_dicts = {};


loadFixPoints = () => {
    fetch('http://localhost:3000/api/fix_point', {method: 'GET'})
        .then((res) => {
            res.json().then((_res) => {
                for (let i in _res) {
                    // fix_points.push(
                    //     L.marker(L.latLng(res[i].PointLng, res[i].PointLat), {
                    //         icon: fix_icon,
                    //     }).bindTooltip(`${res[i].PointName}`),
                    // );
                    fix_dicts[_res[i].PointName] = L.latLng(
                        _res[i].PointLng,
                        _res[i].PointLat,
                    );
                    // baseTree.children[4].children[0].children.push({
                    //     label: res[i].PointName,
                    //     layer: L.marker([res[i].PointLng, res[i].PointLat], {
                    //         icon: fix_icon,
                    //     }).bindTooltip(res[i].PointName),
                    // });
                }
                // ctl.setOverlayTree(baseTree);
                // ctl.addTo(map);
            });
        })
        .catch((err) => console.log(err));
};


drawRoutebyFix = (array, color, bool) => {
    let latlngs = [];
    for (let i in array){
        latlngs.push(fix_dicts[array[i]])
    }

    console.log(latlngs);
    if (bool) {
        return L.polyline(latlngs, {color: color});
    } else {
        return L.polyline(latlngs, {color: color}).addTo(map);
    }
};

drawRoutebyCoordinate = (array, color) => {
    let latlngs = [];
    for (let i in array) {
        latlngs.push(array[i]);
    }
    L.polyline(latlngs, {color: color}).addTo(map);
};
let pinMarker = [];

calculateCoordinate = () => {
    const siteSelect = document.getElementById('thirdSelectLabel').innerText;
    const distance = document.getElementById('thirdDistance').value;
    const angle = parseInt(document.getElementById('thirdAngle').value) - 9;

    // console.log(site)
    if (siteSelect == '선택') {
        alert('기준이 될 표지소를 선택해 주세요!');
        return;
    }

    if (isNaN(angle)) {
        alert('각도를 입력해 주세요!');
        return;
    }

    if (distance == '') {
        alert('거리 값을 입력해주세요! \n기준은 100ft 입니다.');
        return;
    } else if (parseInt(distance) < 0 || parseInt(distance) > 300) {
        alert('거리 값을 0 과 300 이내로 입력해주세요! \n기준은 100ft 입니다.');
        return;
    }


    let lng =
        markers[site.indexOf(siteSelect)][1] +
        (Math.sin((angle * Math.PI) / 180) * distance) / 48;
    let lat =
        markers[site.indexOf(siteSelect)][0] +
        (Math.cos((angle * Math.PI) / 180) * distance) / 60;

    console.log(lat, lng);

    if (accumulatePin && pinMarker.length >= 1) {
        for(let i in pinMarker) {
            map.removeLayer(pinMarker[i]);
        }
        numeric = 1;
    }

    let markerColor = document.getElementById('thirdLevel').value;
    if (markerColor == 5) {
        markerColor = 'blue';
    } else if (markerColor == 4) {
        markerColor = 'green';
    } else if (markerColor == 3) {
        markerColor = 'orange';
    } else if (markerColor == 2) {
        markerColor = 'red';
    } else if (markerColor == 1) {
        markerColor = 'darkred';
    } else {
        markerColor = 'black';
    }

    const pin = L.marker([lat, lng], {
        icon: new L.AwesomeNumberMarkers({
            number: numeric,
            markerColor: markerColor,
        }),
    }).addTo(map);

    pinMarker.push(pin);

    numeric++;
};

accumulatePins = (cb) => {
    accumulatePin = cb.checked;
};

remap = (value) => {
    // in_min_x : -187.05, in_max_x : 285.28
    // in_min_y : -359.7, in_max_y : 133.39

    console.log([
        ((value[0] - -187.05) * (133.39 - 124.0)) / (285.28 - -187.05) + 124.0,
        ((value[1] - -359.7) * (38.38 - 30)) / (163.47 - -359.7) + 30,
    ]);

    L.marker([
        ((value[1] - -359.7) * (38.38 - 30)) / (163.47 - -359.7) + 30,
        ((value[0] - -187.05) * (133.39 - 124.0)) / (285.28 - -187.05) + 124.0,
    ]).addTo(map);

    // return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

onRouteUpload = (e) => {
    e.preventDefault();
    const file = document.getElementById('firstRouteUpload').files[0];
    const fileData = new FormData();

    if (!file) return;
    fileData.append('dat', file);

    let route = [];

    // .addTo(map).bindTooltip("route",{sticky:true});
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/dat',
        processData: false,
        contentType: false,
        data: fileData,
        timeout: 3000,
        cache: false,
        encode: true,
    }).then((res) => {
        console.log(res);
        res.data.map((t) => {
            route.push([t.lat, t.lng]);
        });
        L.polyline(route, {color: 'blue'})
            .on('mouseover', (e) => {
                e.target.setStyle({
                    color: 'red',
                });
            })
            .on('mouseout', (e) => {
                e.target.setStyle({
                    color: 'blue',
                });
            })
            // .on('click', (e) => {
            //     polylineRoute.removeFrom(map)
            // })
            .addTo(map)
            .bindTooltip('route', {sticky: true});
    });
};
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
