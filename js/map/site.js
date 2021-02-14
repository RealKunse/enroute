const site = ["인천", "대구", "안양", "강원", "포항", "부산", "부안", "제주", "모슬포"];
const markers = [[37.469819, 126.457516], [35.809771, 128.590796], [37.413795, 126.927755], [37.7329952, 128.666094],
    [35.97737, 129.472018], [35.127035, 129.011352], [35.707683, 126.615575], [33.3847629, 126.624867], [33.315988, 126.347387]];

let siteIcon = L.icon({
    iconUrl: 'css/images/site.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10],

})

// map.on('zoomlevelschange', function(e){
//     console.log(e)
// })})
// zoomlevelschange



for (a in markers) {
    sites[site[a]] = L.marker(markers[a], {
        icon: siteIcon,
    }).bindTooltip(site[a] + "표지소", {sticky: true}).addTo(map)


}

L.control.layers(null, sites).addTo(map);

// L.removeLayer(L.control.layers(null, areas))
// L.removeLayer(L.control.layers(null, sites))