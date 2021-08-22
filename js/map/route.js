let fix_icon = L.icon({
    iconUrl: 'css/images/Fix_point.png',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
});

let routeDict = {};

loadRoutes = async () => {
    const response = await fetch(`http://${server_add}:3000/flight/route`);
    let routeList = [];

    let result = {};
    await response.json()
        .then(res => {
            res.map(t => {
                routeList.push(t.air_route);
                routeDict[t.air_route] = [];
                baseTree['children'][4]['children'][0]['children'].push({
                    'label': t.air_route,
                    'children': [],
                    selectAllCheckbox: 'unselect all',
                    collapsed: true,
                    eventedClasses: {
                        // selectAll: true,
                    }
                })
            })
        });

    for (let i in routeList) {
        result['name'] = routeList[i];
        const response_ = await fetch(`http://${server_add}:3000/flight/route/edit/open`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                result
            })
        });

        await response_.json()
            .then(res => {
                res.map(t => {
                    for (let i in routeList) {
                        if (t.air_route == routeList[i]) {
                            routeDict[routeList[i]].push({name: t.name, lat: toWGS(t.lat), lng: toWGS(t.lng)});
                            let fix_node = L.circleMarker(L.latLng(toWGS(t.lat), toWGS(t.lng)), {
                                radius: 4
                            }).bindTooltip(t.name, {sticky: true})
                                .on("mouseover mouseout", (e) => {
                                    fixPointEventHandler(e)
                                });

                            baseTree['children'][4]['children'][0]['children'][i]['children'].push({
                                'label': t.name,
                                collapsed: true,
                                layer: fix_node,
                            })
                        }
                    }
                })
            })


    }
    let labelList = [];
    for (let j in routeList) {
        labelList = [];
        for (let k in baseTree['children'][4]['children'][0]["children"][j]['children']) {
            labelList.push(baseTree['children'][4]['children'][0]["children"][j]['children'][k]['label'])
        }
        baseTree['children'][4]['children'][0]["children"][j]['layer'] = drawRoutebyRoute(routeList[j], routeDict)
    }
    ctl.setOverlayTree(baseTree);
    ctl.addTo(map);

};


drawRoutebyRoute = (routeName, dict) => {

    let latlng = [];
    for (let i in dict[routeName]) {
        latlng.push([dict[routeName][i]['lat'], dict[routeName][i]['lng']]);
    }
    const [r, g, b] = [Math.round(0x77 + (Math.random() * 0x77)).toString(16), Math.round(0x77 + (Math.random() * 0x77)).toString(16), Math.round(0x77 + (Math.random() * 0x77)).toString(16)];
    const color = '#' + r + g + b;
    return L.polyline(latlng, {color: color, className: 'enroute_stroke_route'}).bindTooltip(routeName, {sticky: true})
        .on("click mouseover mouseout", (e) => {
            routeEventHandler(e)
        });
};


routeEventHandler = (e) => {
    if (e.type == 'click') {
        if (uiStatus.fifthRoute) {
            // console.log()
            document.getElementById('fifthRouteSelectLabel').innerText = e.sourceTarget._tooltip._content;
        }
    } else if (e.type == 'mouseover') {
        e.target.setStyle({
            weight: 6
        })
    } else if (e.type == 'mouseout') {
        e.target.setStyle({
            weight: 3
        })
    }
};