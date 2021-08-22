L.control.browserPrint({
    title: "지도 인쇄",
    printModes: [
        L.control.browserPrint.mode.portrait("세로", "A3"),
        L.control.browserPrint.mode.landscape("가로", "A3"),
        L.control.browserPrint.mode.custom("선택", "A4")
    ]
}).addTo(map);

map.on('browser-pre-print', e => {
    console.log(e)
    // for (let i in document.getElementsByClassName('leaflet-rangeBearing')){
    setTimeout(() => $('.leaflet-rangeBearing').remove(), 10)
    // }
})