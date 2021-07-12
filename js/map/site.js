const site = ["인천", "대구", "안양", "강원", "포항", "부산", "부안", "제주", "모슬포", "동광"];
const markers = [
    [37.469819, 126.457516],
    [35.809771, 128.590796],
    [37.413795, 126.927755],
    [37.7329952, 128.666094],
    [35.97737, 129.472018],
    [35.127035, 129.011352],
    [35.707683, 126.615575],
    [33.3847629, 126.624867],
    [33.315988, 126.347387],
    [33.3305, 126.5027]];

let siteIcon = L.icon({
    iconUrl: 'css/images/site.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10],

})

loadSites = () => {
    console.log('h')
    fetch('http://localhost:3000/api/sites')
        .then(res => {
            res.json().then(res => {

                res.map(t => {
                    let siteNode = L.marker(L.latLng(t.SiteLat, t.SiteLng), {
                        icon: siteIcon,
                    }).bindTooltip(t.SiteName.concat("표지소"), {sticky: true});

                    baseTree['children'][1]['children'].push({
                        'label':t.SiteName,
                        'layer':siteNode
                    })
                })
                // baseTree['children'][1].selectAllCheckbox= true;
                // console.log(res)

                ctl.setOverlayTree(baseTree);
                ctl.addTo(map);

            })
        })
}