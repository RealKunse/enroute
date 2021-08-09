let site = [];
let markers = [
    // [37.469819, 126.457516],
    // [35.809771, 128.590796],
    // [37.413795, 126.927755],
    // [37.7329952, 128.666094],
    // [35.97737, 129.472018],
    // [35.127035, 129.011352],
    // [35.707683, 126.615575],
    // [33.3847629, 126.624867],
    // [33.315988, 126.347387],
    // [33.3305, 126.5027]
    ];

let siteIcon = L.icon({
    iconUrl: 'css/images/site.png',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
});

let lowSiteIcon = L.icon({
    iconUrl: 'css/images/lowsite.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
});

let vortacIcon = L.icon({
    iconUrl: 'css/images/vortac.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
});


loadSites = () => {
    fetch('http://localhost:3000/api/sites')
        .then(res => {
            res.json().then(res => {
                res.map(t => {
                    if (t.isSite == 1) {
                        let siteNode = L.marker(L.latLng(t.SiteLat, t.SiteLng), {
                            icon: siteIcon,
                        }).bindTooltip(t.SiteName, {sticky: true});
                        site.push(t.SiteName);
                        markers.push([t.SiteLat, t.SiteLng]);
                        baseTree['children'][1]['children'].push({
                            'label': t.SiteName,
                            'layer': siteNode
                        })
                    } else if (t.isLowSite == 1) {
                        let siteNode = L.marker(L.latLng(t.SiteLat, t.SiteLng), {
                            icon: lowSiteIcon,
                        }).bindTooltip(t.SiteName.concat(" 저고도"), {sticky: true});
                        site.push(t.SiteName);
                        markers.push([t.SiteLat, t.SiteLng]);
                        baseTree['children'][2]['children'].push({
                            'label': t.SiteName,
                            'layer': siteNode
                        })
                    } else if (t.isVortac == 1) {
                        let siteNode = L.marker(L.latLng(t.SiteLat, t.SiteLng), {
                            icon: vortacIcon,
                        }).bindTooltip(t.SiteName, {sticky: true});
                        // site.push(t.SiteName);
                        // markers.push([t.SiteLat, t.SiteLng]);
                        baseTree['children'][3]['children'].push({
                            'label': t.SiteName,
                            'layer': siteNode
                        })
                    }
                });
                ctl.setOverlayTree(baseTree);
                ctl.addTo(map);

            })
        })
}