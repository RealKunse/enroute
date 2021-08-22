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
            children: [],
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


toWGS = (coordinates) => {
    if (isNaN(coordinates)) {
        coordinates = parseFloat(coordinates);
        coordinates = coordinates * 10000
    } else {
        coordinates *= 10000;
    }

    let coords = Math.round(coordinates);

    const deg = parseInt(coords / 10000);
    const min = parseInt(coords / 100 - deg * 100);
    const sec = parseInt(coords - deg * 10000 - min * 100);

    return parseFloat((sec / 60 + min) / 60 + deg).toFixed(4);
};

loadFixPoints = () => {
    fetch(`http://${server_add}:3000/api/fix_point`, {method: 'GET'})
        .then((res) => {
            res.json().then((_res) => {
                for (let i in _res) {
                    fix_dicts[_res[i].PointName] = L.latLng(
                        _res[i].PointLng,
                        _res[i].PointLat,
                    );
                }
            });
        })
        .catch((err) => console.log(err));
};


drawRoutebyFix = (array, color, bool) => {
    let latlngs = [];
    for (let i in array) {
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
        parseFloat(markers[site.indexOf(siteSelect)][1]) +
        (Math.sin((angle * Math.PI) / 180) * distance) / 48;
    let lat =
        parseFloat(markers[site.indexOf(siteSelect)][0]) +
        (Math.cos((angle * Math.PI) / 180) * distance) / 60;

    if (accumulatePin && pinMarker.length >= 1) {
        for (let i in pinMarker) {
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

    let route = [];

    if (!file) return;
    fileData.append('dat', file);
    const type = file.name.toString().slice(file.name.indexOf(".") + 1).toLowerCase();
    if(type == 'txt'){

        $.ajax({
            type: 'POST',
            url: `http://${server_add}:3000/dat/txt`,
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
    } else if (type == 'xlsx' || type == 'xls' || type == 'xlsm'){
        alert('엑셀 미구현되어있음')
    } else {
        alert('잘못된 파일입니다.')
    }


};


fixPointEventHandler = (e) => {
    if (e.type == 'mouseover') {
        e.target.setStyle({
            radius: 6,
            weight: 4
        })
    } else if (e.type == 'mouseout') {
        e.target.setStyle({
            radius: 4,
            weight: 3
        })
    }
};