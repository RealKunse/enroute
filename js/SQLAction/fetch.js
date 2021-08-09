let loaded = false;
let clickedColumn = ['', 0];
let mapMarker = [];
let fileNames = [];

getTestList = async () => {
    if (loaded == false) {
        loaded = true;
        fetch("http://localhost:3000/flight/list", {method: "GET"})
            .then(res => {
                res.json().then(response => {
                    let i = 1;
                    document.getElementById('firstTableBody').innerHTML
                        = response.map((c) => {
                        return `
                        <tr class="firstRow" onclick="onRowClick('${(c.TestName)}')">
                        <td class="firstColumn">${c.TestName}</td>
                        <td class="firstColumn">${c.TestDate.slice(0, 10)}</td>
                        <td class="firstColumn">${c.TestType}</td></tr>`
                    }).join('')
                })
                    .catch(error => console.log(error))
            }).catch(err => console.err(err))
    }
}

onRowClick = (name) => {
    document.getElementById('firstReqText').innerText = name;


    if (name !== '민원') {

        document.getElementById('firstReqSiteSelectLabel').innerText = '전체';
        document.getElementById('firstReqFreqSelectLabel').innerText = '전체';

        openFirstReqData();
        fetch(`http://localhost:3000/flight/testRes/${name}`)
            .then(res => {
                res.json().then($res => {
                    document.getElementById('firstReqTbody').innerHTML =
                        $res.length !== 0 ? $res.map(t => {
                                return `<tr class="firstReqTableData styleTableRow"><td><input type="checkbox" class="firstCheckBoxC"></td>
                                    <td>${t.sitename_fk}</td><td>${t.frequency_fk.toFixed(3)}</td><td>${t.txmain}</td>
                                    <td>${t.rxmain}</td><td>${t.txstby}</td><td>${t.rxstby}</td><td>${t.angle}</td>
                                    <td>${t.distance}</td><td>${t.height}</td></tr>`
                            }).join('')
                            : `<tr><td colspan="10" style="height: 500px; text-align: center">No DATA</td></tr>`


                    document.getElementById('firstReqSite').innerHTML = `<li class="option">전체</li>` + [...new Set($res.length !== 0 ? $res.map(t => {
                        return t.sitename_fk
                    }) : '')].sort().map(j => {
                        return `<li class="option">${j}</li>`
                    }).join("");

                    document.getElementById('firstReqFreq').innerHTML = `<li class="option">전체</li>` + [...new Set($res.length !== 0 ? $res.map(t => {
                        return t.frequency_fk.toFixed(3)
                    }) : '')].sort().map(j => {
                        return `<li class="option">${j}</li>`
                    }).join("");


                    var optionList = document.querySelectorAll(".option");
                    for (var i = 0; i < optionList.length; i++) {
                        let option = optionList[i];
                        option.addEventListener("click", onClickOption);
                    }
                })
            })
    } else {
        openFirstReqData();
        // document.getElementById('firstReqData').innerHTML= ''
    }
}

firstOnSearchClick = () => {
    const freq = document.getElementById('firstReqFreqSelectLabel').innerHTML;
    const site = document.getElementById('firstReqSiteSelectLabel').innerHTML;
    const name = document.getElementById('firstReqText').innerText;

    let result = {};
    result['freq'] = freq;
    result['site'] = site;
    result['name'] = name;

    fetch(`http://localhost:3000/flight/testRes/search/`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            result
        })
    })
        .then(res => {
            res.json().then($res => {
                document.getElementById('firstReqTbody').innerHTML =
                    $res.length !== 0 ? $res.map(t => {
                            return `<tr class="firstReqTableData styleTableRow"><td><input type="checkbox" class="firstCheckBoxC"></td>
                                    <td>${t.sitename_fk}</td><td>${t.frequency_fk.toFixed(3)}</td><td>${t.txmain}</td>
                                    <td>${t.rxmain}</td><td>${t.txstby}</td><td>${t.rxstby}</td><td>${t.angle}</td>
                                    <td>${t.distance}</td><td>${t.height}</td></tr>`
                        }).join('')
                        : `<tr><td colspan="10" style="height: 500px; text-align: center">No DATA</td></tr>`
            })
        })
}


SecondOnSearchClick = () => {
    const freq = document.getElementById('secondFreqInput').value;
    const site = document.getElementById('secondSiteSelectLabel').innerText;
    const name = document.getElementById('secondNameInput').value;
    const startDate = document.getElementById('secondStartDate').value;
    const endDate = document.getElementById('secondEndDate').value;

    let result = {};
    result['freq'] = freq;
    result['site'] = site;
    result['name'] = name;
    result['startdate'] = startDate;
    result['enddate'] = endDate;

    fetch(`http://localhost:3000/flight/second/search`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            result
        })
    })
        .then(res => {
            res.json().then($res => {
                document.getElementById('secondTableBody').innerHTML =
                    $res.length !== 0 ? $res.map(t => {
                            return `<tr class="secondTableData styleTableRow">
                                    <td><input type="checkbox" class="secondCheckBox"></td>
                                    <td>${t.testname_fk}</td><td>${t.sitename_fk}</td><td>${t.frequency_fk.toFixed(3)}</td>
                                    <td>${t.testDate.slice(0, 10)}</td><td>${t.txmain}</td>
                                    <td>${t.rxmain}</td><td>${t.txstby}</td><td>${t.rxstby}</td><td>${t.distance}</td>
                                    <td>${t.angle}</td><td>${t.height}</td></tr>`
                        }).join('')
                        : `<tr><td colspan="10" style="height: 100%; text-align: center">NO DATA</td></tr>`
            })
        })
}

checkAllBoxes = (cb, className) => {

    // console.log(cb.checked)
    for (let i = 0; i < document.getElementsByClassName(className).length; i++) {
        document.getElementsByClassName(className)[i].checked = cb.checked
    }
};

deleteMapMarker = () => {
    for (let i in mapMarker) {
        map.removeLayer(mapMarker[i]);
    }
}

pinAllCheckedRow = () => {
    let result = {};
    let checkBool = false;
    for (let i = 0; i < document.getElementsByClassName('firstCheckBoxC').length; i++) {
        if (document.getElementsByClassName('firstCheckBoxC')[i].checked) {
            checkBool = true;
        }
    }
    if (!checkBool) {
        alert('지도에 표시할 결과를 선택해주세요!');
        return;
    }
    for (let i = 0; i < document.getElementsByClassName('firstCheckBoxC').length; i++) {
        if (document.getElementsByClassName('firstCheckBoxC')[i].checked) {
            for (let j = 0; j < document.getElementsByClassName('firstReqTableData')[i].children.length; j++) {
                switch (j) {
                    case 1:
                        result[i] = {
                            site: {},
                            freq: {},
                            txmain: {},
                            rxmain: {},
                            txstby: {},
                            rxstby: {},
                            angle: {},
                            distance: {},
                            height: {}
                        };
                        result[i]['site'] = document.getElementsByClassName('firstReqTableData')[i].children[j].textContent;
                        break;
                    case 2:
                        result[i]['freq'] = document.getElementsByClassName('firstReqTableData')[i].children[j].textContent;
                        break;
                    case 3:
                        result[i]['txmain'] = document.getElementsByClassName('firstReqTableData')[i].children[j].textContent;
                        break;
                    case 4:
                        result[i]['rxmain'] = document.getElementsByClassName('firstReqTableData')[i].children[j].textContent;
                        break;
                    case 5:
                        result[i]['txstby'] = document.getElementsByClassName('firstReqTableData')[i].children[j].textContent;
                        break;
                    case 6:
                        result[i]['rxstby'] = document.getElementsByClassName('firstReqTableData')[i].children[j].textContent;
                        break;
                    case 7:
                        result[i]['angle'] = document.getElementsByClassName('firstReqTableData')[i].children[j].textContent;
                        break;
                    case 8:
                        result[i]['distance'] = document.getElementsByClassName('firstReqTableData')[i].children[j].textContent;
                        break;
                    case 9:
                        result[i]['height'] = document.getElementsByClassName('firstReqTableData')[i].children[j].textContent;
                        break;

                }
            }
        }
    }

    for (let i in result) {

        let lng = markers[site.indexOf(result[i].site)][1] + Math.sin((result[i].angle - 5) * Math.PI / 180) * result[i].distance / 48;
        let lat = markers[site.indexOf(result[i].site)][0] + Math.cos((result[i].angle - 5) * Math.PI / 180) * result[i].distance / 60;
        let colour = getLeastValue([result[i].txmain, result[i].rxmain, result[i].txstby, result[i].rxstby]);
        let markerLayer = L.marker([lat, lng], {
            icon: new L.AwesomeNumberMarkers({
                // number: i,
                markerColor: colour,
            })
        }).bindTooltip(
            "<table><tr><td>표지소</td><td>주파수</td><td>검사명</td><td>TX-MAIN</td><td>RX-MAIN</td><td>TX-STBY</td><td>RX-STBY</td><td>각도</td><td>거리</td><td>고도</td></tr>" +
            "<tr><td>" + result[i].site + "</td><td>" + result[i].freq + "</td><td>" + document.getElementById('firstReqText').innerText + "</td><td>" + result[i].txmain + "</td><td>" + result[i].rxmain + "</td><td>" +
            result[i].txstby + "</td><td>" + result[i].rxstby + "</td><td>" + result[i].angle + "</td><td>" + result[i].distance + "</td><td>" + result[i].height + "</td></tr></table>",
            {sticky: true, pane: 'test_result_marker'}).addTo(map)

        mapMarker.push(markerLayer)
    }

    resetActivatedPopup();
    closeFirstReqData();
    openMapMode(1);

};

pinAllCheckedRow_sec = () => {
    let result = {};
    let checkBool = false;
    for (let i = 0; i < document.getElementsByClassName('secondCheckBox').length; i++) {
        if (document.getElementsByClassName('secondCheckBox')[i].checked) {
            checkBool = true;
        }
    }
    if (!checkBool) {
        alert('지도에 표시할 결과를 선택해주세요!');
        return;
    }
    for (let i = 0; i < document.getElementsByClassName('secondCheckBox').length; i++) {
        if (document.getElementsByClassName('secondCheckBox')[i].checked) {
            for (let j = 0; j < document.getElementsByClassName('secondTableData')[i].children.length; j++) {
                switch (j) {
                    case 0:
                        result[i] = {
                            name: {},
                            site: {},
                            freq: {},
                            date: {},
                            txmain: {},
                            rxmain: {},
                            txstby: {},
                            rxstby: {},
                            angle: {},
                            distance: {},
                            height: {}
                        };
                        break;
                    case 1:
                        result[i]['name'] = document.getElementsByClassName('secondTableData')[i].children[j].textContent;
                        break;
                    case 2:
                        result[i]['site'] = document.getElementsByClassName('secondTableData')[i].children[j].textContent;
                        break;
                    case 3:
                        result[i]['freq'] = document.getElementsByClassName('secondTableData')[i].children[j].textContent;
                        break;
                    case 4:
                        result[i]['date'] = document.getElementsByClassName('secondTableData')[i].children[j].textContent;
                        break;
                    case 5:
                        result[i]['txmain'] = document.getElementsByClassName('secondTableData')[i].children[j].textContent;
                        break;
                    case 6:
                        result[i]['rxmain'] = document.getElementsByClassName('secondTableData')[i].children[j].textContent;
                        break;
                    case 7:
                        result[i]['txstby'] = document.getElementsByClassName('secondTableData')[i].children[j].textContent;
                        break;
                    case 8:
                        result[i]['rxstby'] = document.getElementsByClassName('secondTableData')[i].children[j].textContent;
                        break;
                    case 9:
                        result[i]['distance'] = document.getElementsByClassName('secondTableData')[i].children[j].textContent;
                        break;
                    case 10:
                        result[i]['angle'] = document.getElementsByClassName('secondTableData')[i].children[j].textContent;
                        break;
                    case 11:
                        result[i]['height'] = document.getElementsByClassName('secondTableData')[i].children[j].textContent;
                        break;

                }
            }
        }
    }
    console.log(result);
    for (let i in result) {
        let lng = markers[site.indexOf(result[i].site)][1] + Math.sin((result[i].angle - 5) * Math.PI / 180) * result[i].distance / 48;
        let lat = markers[site.indexOf(result[i].site)][0] + Math.cos((result[i].angle - 5) * Math.PI / 180) * result[i].distance / 60;
        let colour = getLeastValue([result[i].txmain, result[i].rxmain, result[i].txstby, result[i].rxstby]);
        const markerLayer = L.marker([lat, lng], {
            icon: new L.AwesomeNumberMarkers({
                // number: i,
                markerColor: colour,
            })
        }).bindTooltip(
            "<table><tr><td>표지소</td><td>주파수</td><td>검사명</td><td>TX-MAIN</td><td>RX-MAIN</td><td>TX-STBY</td><td>RX-STBY</td><td>각도</td><td>거리</td><td>고도</td></tr>" +
            "<tr><td>" + result[i].site + "</td><td>" + result[i].freq + "</td><td>" + result[i].name + "</td><td>" + result[i].txmain + "</td><td>" + result[i].rxmain + "</td><td>" +
            result[i].txstby + "</td><td>" + result[i].rxstby + "</td><td>" + result[i].angle + "</td><td>" + result[i].distance + "</td><td>" + result[i].height + "</td></tr></table>",
            {sticky: true}).addTo(map)

        mapMarker.push(markerLayer);
    }



    resetActivatedPopup();
    openMapMode(2)
};


getLeastValue = (list) => {         // 주어진 리스트들의 값을 파싱하여 최소값 반환 ( 비행검사탭에서 MAP 기능에 사용 )  returns integer
    minimum = 999;
    for (let i in list) {
        if (list[i] != null) {
            let parseResult = parseInt(list[i][0]) + parseInt(list[i][2]);
            if (minimum >= parseResult)
                minimum = parseResult;
        }
    }
    if (minimum == 10) {
        return 'blue';
    } else if (minimum >= 8) {
        return 'green';
    } else if (minimum >= 6) {
        return 'orange';
    } else if (minimum >= 4) {
        return 'red'
    } else if (minimum >= 2) {
        return 'darkred';
    } else {
        return 'black';
    }
}

onColumnClick = (column) => {

    let url = '';

    if (column !== clickedColumn[0])
        clickedColumn = [column, 0];

    if (clickedColumn[0] == column && clickedColumn[1] % 2 == 1) {
        clickedColumn = [column, clickedColumn[1] + 1];
        url = `http://localhost:3000/flight/list/${column}/desc`
    } else {
        clickedColumn = [column, clickedColumn[1] + 1];
        url = `http://localhost:3000/flight/list/${column}/asc`
    }


    fetch(url, {method: "GET"})
        .then(res => {
            res.json().then(response => {
                let i = 1;
                document.getElementById('firstTableBody').innerHTML
                    = response.map((c) => {
                    clickedColumn[0] = column;
                    return `
                        <tr class="firstRow" onclick="onRowClick('${(c.TestName)}')">
                        <td class="firstColumn">${c.TestName}</td>
                        <td class="firstColumn">${c.TestDate.slice(0, 10)}</td>
                        <td class="firstColumn">${c.TestType}</td></tr>`
                }).join('')
            }).catch(error => console.log(error))
        }).catch(err => console.err(err))
};

getNoticeData = () => {
    fetch('http://localhost:3000/notice')
        .then(res => {
            res.json()
                .then(_res => {
                    document.getElementById('noticeTbody').innerHTML = _res.map((c) => {
                        return `<tr class="noticeTableTitle"><td class="noticeTableTitle">${c.title}</td>
<td class="noticeTableDate">${c.date.substr(0, 10)}</td>
<td>${c.type}</td><td>${c.version}</td>
</tr>
<tr class="noticeTableContext"><td colspan="4" class="noticeTableContext">
${c.context}
</td></tr>`
                    }).join('')
                })
        })
};

addNoticeData = () => {
    let result = {};
    result['title'] = document.getElementById('fifthNoticeAddTitleInput').value;
    result['context'] = document.getElementById('fifthNoticeAddContextInput').value;
    result['type'] = document.getElementById('fifthNoticeAddTypeInput').value;
    result['version'] = document.getElementById('fifthNoticeAddVersionInput').value;

    fetch(`http://localhost:3000/notice/add`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            result
        })
    })
};

delNoticeData = (elem) => {
    let result = {};
    result['title'] = elem.parentElement.parentElement.children[0].innerText;
    result['context'] = elem.parentElement.parentElement.children[1].innerText;
    fetch('http://localhost:3000/notice/del', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            result
        })
    })
}

getFifthRouteData = () => {
    fetch('http://localhost:3000/flight/route')
        .then(r => {
            r.json().then(res => {
                document.getElementById('fifthRouteList').innerHTML = '';
                document.getElementById('fifthRouteList').innerHTML
                    = res.map((c) => {
                    return `
                        <li class="option" onclick="onClickOption(event)">${c.air_route}</li>`
                }).join('');
            })
                .catch(err => console.error(err))
        })
};