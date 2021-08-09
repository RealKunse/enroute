let fix_icon = L.icon({
    iconUrl: 'css/images/Fix_point.png',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
});

let routeDict = {};

loadRoutes = async () => {
    const response = await fetch('http://localhost:3000/flight/route');
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
        const response_ = await fetch('http://localhost:3000/flight/route/edit/open', {
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
                            routeDict[routeList[i]].push({name: t.name, lat: t.lat, lng: t.lng});
                            let fix_node = L.circleMarker(L.latLng(t.lat, t.lng), {
                                // icon: fix_icon,
                                radius: 4
                            }).bindTooltip(t.name, {sticky: true});

                            baseTree['children'][4]['children'][0]['children'][i]['children'].push({
                                'label': t.name,
                                collapsed: true,
                                layer: fix_node,
                                // selectAllCheckbox: 'unselect all',
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
    const color = '#' + Math.round(0xCCCCCC + (Math.random() * 0x333333)).toString(16);
    return L.polyline(latlng, {color: color, className: 'enroute_stroke_route'}).bindTooltip(routeName, {sticky: true});
};
