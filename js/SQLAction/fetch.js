let loaded = false;
let clickedColumn = ['', 0];
let mapMarker = [];
let fileNames = [];
const server_add = '192.168.97.201';

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

    return ((sec / 60 + min) / 60 + deg).toFixed(4);
};

getTestList = async () => {
    if (loaded == false) {
        loaded = true;
        fetch(`http://${server_add}:3000/flight/list`, {method: "GET"})
            .then(res => {
                res.json().then(response => {
                    let i = 1;
                    document.getElementById('firstTableBody').innerHTML
                        = response.map((c) => {
                        if (c.TestName != '민원') {
                            return `
                        <tr class="firstRow" onclick="onRowClick('${(c.TestName)}')">
                        <td class="firstColumn">${c.TestName}</td>
                        <td class="firstColumn">${c.TestDate.slice(0, 10)}</td>
                        <td class="firstColumn">${c.TestType}</td></tr>`
                        } else {
                            return '';
                        }
                    }).join('')
                })
                    .catch(error => console.log(error))
            }).catch(err => console.err(err))
    }
}

onRowClick = (name) => {
    document.getElementById('firstReqText').innerText = name;

    document.getElementById('firstReqSiteSelectLabel').innerText = '전체';
    document.getElementById('firstReqFreqSelectLabel').innerText = '전체';

    openFirstReqData();
    fetch(`http://${server_add}:3000/flight/testRes/${name}`)
        .then(res => {
            res.json().then($res => {
                document.getElementById('firstReqTbody').innerHTML =
                    $res.length !== 0 ? $res.map(t => {
                            return `<tr class="firstReqTableData styleTableRow"><td><input type="checkbox" class="firstCheckBoxC"></td>
                                    <td onclick="firstReqDataEdit(event)">${t.sitename_fk}</td><td onclick="firstReqDataEdit(event)">${t.frequency_fk.toFixed(3)}</td>
                                    <td onclick="firstReqDataEdit(event)">${t.txmain}</td>
                                    <td onclick="firstReqDataEdit(event)">${t.rxmain}</td><td onclick="firstReqDataEdit(event)">${t.txstby}</td><td onclick="firstReqDataEdit(event)">${t.rxstby}</td>
                                    <td onclick="firstReqDataEdit(event)">${t.angle}</td>
                                    <td onclick="firstReqDataEdit(event)">${t.distance}</td><td onclick="firstReqDataEdit(event)">${t.height}</td></tr>`
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
};

getMinwonData = () => {
    document.getElementById('MinwonSiteSelectLabel').innerText = '전체';
    document.getElementById('MinwonFreqSelectLabel').innerText = '전체';

    fetch(`http://${server_add}:3000/flight/testRes/minwon/open`)
        .then(res => {
            res.json().then($res => {
                document.getElementById('MinwonTbody').innerHTML =
                    $res.length !== 0 ? $res.map(t => {
                            return `<tr class="MinwonTableData styleTableRow"><td><input type="checkbox" class="MinwonCheckBoxC"></td>
                                    <td onclick="MinwonDataEdit(event)">${t.sitename_fk}</td><td onclick="MinwonDataEdit(event)">${t.frequency_fk.toFixed(3)}</td>
                                    <td onclick="MinwonDataEdit(event)">${t.status}</td><td onclick="MinwonDataEdit(event)">${t.angle}</td>
                                    <td onclick="MinwonDataEdit(event)">${t.distance}</td><td onclick="MinwonDataEdit(event)">${t.height}</td>
                                    <td class="MinwonID" style="display: none">${t.id}</td>
                                    </tr>`
                        }).join('')
                        : `<tr><td colspan="10" style="height: 500px; text-align: center">No DATA</td></tr>`;


                document.getElementById('MinwonSite').innerHTML = `<li class="option">전체</li>` + [...new Set($res.length !== 0 ? $res.map(t => {
                    return t.sitename_fk
                }) : '')].sort().map(j => {
                    return `<li class="option">${j}</li>`
                }).join("");

                document.getElementById('MinwonFreq').innerHTML = `<li class="option">전체</li>` + [...new Set($res.length !== 0 ? $res.map(t => {
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
};


firstReqDataEdit = (e) => {
    if (!loginItem.getLoginStatus()) {
        console.log('data edit denied.');
        return
    }
    let before = {};
    before['testname'] = $('#firstReqText').text();
    before['site'] = e.currentTarget.parentElement.children[1].innerText;
    before['freq'] = e.currentTarget.parentElement.children[2].innerText;
    before['txm'] = e.currentTarget.parentElement.children[3].innerText;
    before['rxm'] = e.currentTarget.parentElement.children[4].innerText;
    before['txs'] = e.currentTarget.parentElement.children[5].innerText;
    before['rxs'] = e.currentTarget.parentElement.children[6].innerText;
    before['angle'] = e.currentTarget.parentElement.children[7].innerText;
    before['distance'] = e.currentTarget.parentElement.children[8].innerText;
    before['height'] = e.currentTarget.parentElement.children[9].innerText;
    openFirstReqEditData(before);

};

MinwonDataAddConfirm = () => {
    const inputs = document.getElementsByClassName('MinwonDataAddInput');

    let result = {};

    for (let i = 1; i <= inputs.length; i++) {
        switch (i) {
            case 1:
                result.site = inputs[0].value;
                break;
            case 2:
                result.freq = inputs[1].value;
                break;
            case 3:
                result.status = inputs[2].value;
                break;
            case 4:
                result.angle = inputs[3].value;
                break;
            case 5:
                result.distance = inputs[4].value;
                break;
            case 6:
                result.height = inputs[5].value;
                break;
        }
    }
    fetch(`http://${server_add}:3000/flight/testRes/minwon/add/`, {
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
                if (res.status != 200) {
                    throw new Error('통신에러');
                }
                res.json().then(_res => {
                        if (_res.errno) {
                            alert('에러가 발생했습니다.\n관리자에게 문의하십시오.')
                        } else {
                            alert('정상적으로 결과가 수정되었습니다.');
                            closeMinwonAddData(true);
                            getMinwonData();
                        }
                    }
                )
            }
        )
        .catch(err => {
            console.log(err);
            alert('에러가 발생했습니다.\n입력 내용을 확인해주세요.')
        })
};

MinwonDataEdit = (e) => {
    if (!loginItem.getLoginStatus()) {
        console.log('data edit denied.');
        return
    }
    let before = {};
    before['id'] = e.currentTarget.parentElement.children[7].innerText;
    before['site'] = e.currentTarget.parentElement.children[1].innerText;
    before['freq'] = e.currentTarget.parentElement.children[2].innerText;
    before['status'] = e.currentTarget.parentElement.children[3].innerText;
    before['angle'] = e.currentTarget.parentElement.children[4].innerText;
    before['distance'] = e.currentTarget.parentElement.children[5].innerText;
    before['height'] = e.currentTarget.parentElement.children[6].innerText;
    openMinwonEditData(before);

};

MinwonDataEditConfirm = () => {
    const before = MinwonTemp;
    const inputs = document.getElementsByClassName('MinwonDataEditInput');

    let result = {};

    for (let i = 1; i <= inputs.length; i++) {
        switch (i) {
            case 1:
                result.site = inputs[0].value;
                break;
            case 2:
                result.freq = inputs[1].value;
                break;
            case 3:
                result.status = inputs[2].value;
                break;
            case 4:
                result.angle = inputs[3].value;
                break;
            case 5:
                result.distance = inputs[4].value;
                break;
            case 6:
                result.height = inputs[5].value;
                break;
        }
    }
    result['id'] = before['id'];
    fetch(`http://${server_add}:3000/flight/testRes/minwon/edit/`, {
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
                if (res.status != 200) {
                    throw new Error('통신에러');
                }
                res.json().then(_res => {
                        if (_res.errno) {
                            alert('에러가 발생했습니다.\n관리자에게 문의하십시오.')
                        } else {
                            alert('정상적으로 결과가 수정되었습니다.');
                            closeMinwonEditData(true);
                            getMinwonData();
                        }
                    }
                )
            }
        )
        .catch(err => {
            console.log(err);
            alert('에러가 발생했습니다.\n관리자에게 문의하십시오.')
        })
}

firstReqDataEditConfirm = () => {
    const before = firstReqTemp;
    const inputs = document.getElementsByClassName('firstReqDataEditInput');

    let result = {};

    for (let i = 1; i <= inputs.length; i++) {
        switch (i) {
            case 1:
                result.site = inputs[0].value;
                break;
            case 2:
                result.freq = inputs[1].value;
                break;
            case 3:
                result.txm = inputs[2].value;
                break;
            case 4:
                result.rxm = inputs[3].value;
                break;
            case 5:
                result.txs = inputs[4].value;
                break;
            case 6:
                result.rxs = inputs[5].value;
                break;
            case 7:
                result.angle = inputs[6].value;
                break;
            case 8:
                result.distance = inputs[7].value;
                break;
            case 9:
                result.height = inputs[8].value;
                break;
        }
    }
    fetch(`http://${server_add}:3000/flight/testRes/edit/`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            result,
            before
        })
    })
        .then(res => {
                if (res.status != 200) {
                    throw new Error('통신에러');
                }
                res.json().then(_res => {
                        if (_res.errno) {
                            alert('에러가 발생했습니다.\n관리자에게 문의하십시오.')
                        } else {
                            alert('정상적으로 검사 결과가 수정되었습니다.');
                            closeFirstReqEditData(true);
                        }
                    }
                )
            }
        )
        .catch(err => {
            console.log(err);
            alert('에러가 발생했습니다.\n관리자에게 문의하십시오.')
        })
};

firstOnSearchClick = () => {
    const freq = document.getElementById('firstReqFreqSelectLabel').innerHTML;
    const site = document.getElementById('firstReqSiteSelectLabel').innerHTML;
    const name = document.getElementById('firstReqText').innerText;

    let result = {};
    result['freq'] = freq;
    result['site'] = site;
    result['name'] = name;

    fetch(`http://${server_add}:3000/flight/testRes/search/`, {
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
                                    <td onclick="firstReqDataEdit(event)">${t.sitename_fk}</td><td onclick="firstReqDataEdit(event)">${t.frequency_fk.toFixed(3)}</td>
                                    <td onclick="firstReqDataEdit(event)">${t.txmain}</td>
                                    <td onclick="firstReqDataEdit(event)">${t.rxmain}</td><td onclick="firstReqDataEdit(event)">${t.txstby}</td>
                                    <td onclick="firstReqDataEdit(event)">${t.rxstby}</td><td onclick="firstReqDataEdit(event)">${t.angle}</td>
                                    <td onclick="firstReqDataEdit(event)">${t.distance}</td><td onclick="firstReqDataEdit(event)">${t.height}</td></tr>`
                        }).join('')
                        : `<tr><td colspan="10" style="height: 500px; text-align: center">No DATA</td></tr>`
            })
        })
}


let maxPage = 10;
SecondGetPageCount = async (result) => {
    fetch(`http://${server_add}:3000/flight/second/search/count`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            result
        })
    }).then(res => {
        res.json().then(r => {
            const pageLimit = (Math.ceil(r[0].count / result['limit']));
            maxPage = pageLimit;
            $('#secondPaginationContext').html('');
            for (let i = 0; i < pageLimit; i++) {
                document.getElementById('secondPaginationContext').innerHTML += `<div class="secondPaginationBlock" onclick="SecondClickPageButton(event)">${i + 1}</div>`
                if ((i + 1) % 10 == 0) {
                    break;
                }
            }

        })
    }).catch(err => console.log(err));
};

selectFormGetSite = async () => {
    const response = fetch(`http://${server_add}:3000/flight/site/list`);
    let result = '<li class="option" onclick="onClickOption(event)">전체</li>';
    const wait = await response;
    wait.json().then(
        res => {
            result += res.map(t => {
                return `<li class="option">${t.sitename}</li>`;
            }).join('');
            $('#secondSiteClickSelect .option-list').html(result);
            $('#thirdClickSelect .option-list').html(result);

            let optionList = $('.option');
            for (let i = 0; i < optionList.length; i++) {
                const option = optionList[i];
                option.addEventListener('click', onClickOption);
            }
        })
};

SecondOnSearchClick = async (bool) => {
    const freq = $('#secondFreqInput').val();
    const site = $('#secondSiteSelectLabel').text();
    const name = $('#secondNameInput').val();
    const startDate = $('#secondStartDate').val();
    const endDate = $('#secondEndDate').val();
    const limit = $('#secondLimitSelectLabel').text();
    const page = $('.secondActivatedPageBlock').text();
    let result = {};
    result['freq'] = freq;
    result['site'] = site;
    result['name'] = name;
    result['startdate'] = startDate;
    result['enddate'] = endDate;
    result['limit'] = limit;
    result['page'] = page ? parseInt(page) - 1 : '';
    if (bool) {
        await SecondGetPageCount(result);
    }
    fetch(`http://${server_add}:3000/flight/second/search`, {
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
                $('#secondTableBody').html(
                    $res.length !== 0 ? $res.map(t => {
                            return `<tr class="secondTableData styleTableRow">
                                    <td><input type="checkbox" class="secondCheckBox"></td>
                                    <td>${t.testname_fk}</td><td>${t.sitename_fk}</td><td>${t.frequency_fk.toFixed(3)}</td>
                                    <td>${t.testDate.slice(0, 10)}</td><td>${t.txmain}</td>
                                    <td>${t.rxmain}</td><td>${t.txstby}</td><td>${t.rxstby}</td><td>${t.distance}</td>
                                    <td>${t.angle}</td><td>${t.height}</td></tr>`
                        }).join('')
                        : `<tr><td colspan="10" style="height: 100%; text-align: center">NO DATA</td></tr>`
                )
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

MinwonPinCheckedRow = (cls, table) => {
    let result = {};
    let checkBool = false;
    for (let i = 0; i < document.getElementsByClassName(cls).length; i++) {
        if (document.getElementsByClassName(cls)[i].checked) {
            checkBool = true;
        }
    }
    if (!checkBool) {
        alert('지도에 표시할 결과를 선택해주세요!');
        return;
    }
    for (let i = 0; i < document.getElementsByClassName(cls).length; i++) {
        if (document.getElementsByClassName(cls)[i].checked) {
            for (let j = 0; j < document.getElementsByClassName(table)[i].children.length; j++) {
                switch (j) {
                    case 1:
                        result[i] = {
                            site: {},
                            freq: {},
                            angle: {},
                            distance: {},
                            height: {},
                            status: {}
                        };
                        result[i]['site'] = document.getElementsByClassName(table)[i].children[j].textContent;
                        break;
                    case 2:
                        result[i]['freq'] = document.getElementsByClassName(table)[i].children[j].textContent;
                        break;
                    case 3:
                        result[i]['status'] = document.getElementsByClassName(table)[i].children[j].textContent;
                        break;
                    case 4:
                        result[i]['angle'] = document.getElementsByClassName(table)[i].children[j].textContent;
                        break;
                    case 5:
                        result[i]['distance'] = document.getElementsByClassName(table)[i].children[j].textContent;
                        break;
                    case 6:
                        result[i]['height'] = document.getElementsByClassName(table)[i].children[j].textContent;

                }
            }
        }
    }

    for (let i in result) {

        let lng = parseFloat(markers[site.indexOf(result[i].site)][1]) + Math.sin((result[i].angle - 5) * Math.PI / 180) * result[i].distance / 48;
        let lat = parseFloat(markers[site.indexOf(result[i].site)][0]) + Math.cos((result[i].angle - 5) * Math.PI / 180) * result[i].distance / 60;
        console.log(lat, lng);
        let colour = 'black';
        let markerLayer = L.marker([lat, lng], {
            icon: new L.AwesomeNumberMarkers({
                // number: i,
                markerColor: colour,
                pane: 'resultMarkerPane'
            })
        }).bindTooltip(
            "<table><tr><td>표지소</td><td>주파수</td><td>증상</td><td>각도</td><td>거리</td><td>고도</td></tr>" +
            "<tr><td>" + result[i].site + "</td><td>" + result[i].freq + "</td><td>" + result[i].status + "</td><td>"
            + result[i].angle + "</td><td>" + result[i].distance + "</td><td>" + result[i].height + "</td></tr></table>",
            {sticky: true, pane: 'tooltipPane'}).addTo(map);

        mapMarker.push(markerLayer)
    }

    resetActivatedPopup();
    closeMinwon();
    openMapMode(3);

};

pinAllCheckedRow = (cls, table) => {

    let result = {};
    let checkBool = false;
    for (let i = 0; i < document.getElementsByClassName(cls).length; i++) {
        if (document.getElementsByClassName(cls)[i].checked) {
            checkBool = true;
        }
    }
    if (!checkBool) {
        alert('지도에 표시할 결과를 선택해주세요!');
        return;
    }
    const title = {testname: $('#firstReqText').text()};
    let route = [];
    fetch(`http://${server_add}:3000/flight/testRes/hasroute`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title
        })
    }).then(res => {
        res.json().then(res_ => {
            console.log(res_)
            res_.data.map(t => {
                route.push([t.lat, t.lng]);
            });
            const routeLine = L.polyline(route, {color: 'blue'})
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
                .bindTooltip(`<table><tr><td>${title.testname}</td></tr></table>`, {sticky: true, pane: 'tooltipPane'});
            mapMarker.push(routeLine)
        })
    });


    for (let i = 0; i < document.getElementsByClassName(cls).length; i++) {
        if (document.getElementsByClassName(cls)[i].checked) {
            for (let j = 0; j < document.getElementsByClassName(table)[i].children.length; j++) {
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
                        result[i]['site'] = document.getElementsByClassName(table)[i].children[j].innerText;
                        break;
                    case 2:
                        result[i]['freq'] = document.getElementsByClassName(table)[i].children[j].innerText;
                        break;
                    case 3:
                        result[i]['txmain'] = document.getElementsByClassName(table)[i].children[j].innerText;
                        break;
                    case 4:
                        result[i]['rxmain'] = document.getElementsByClassName(table)[i].children[j].innerText;
                        break;
                    case 5:
                        result[i]['txstby'] = document.getElementsByClassName(table)[i].children[j].innerText;
                        break;
                    case 6:
                        result[i]['rxstby'] = document.getElementsByClassName(table)[i].children[j].innerText;
                        break;
                    case 7:
                        result[i]['angle'] = document.getElementsByClassName(table)[i].children[j].innerText;
                        break;
                    case 8:
                        result[i]['distance'] = document.getElementsByClassName(table)[i].children[j].innerText;
                        break;
                    case 9:
                        result[i]['height'] = document.getElementsByClassName(table)[i].children[j].innerText;
                        break;

                }
            }
        }
    }

    for (let i in result) {

        let lng = parseFloat(markers[site.indexOf(result[i].site)][1]) + Math.sin((result[i].angle - 5) * Math.PI / 180) * result[i].distance / 48;
        let lat = parseFloat(markers[site.indexOf(result[i].site)][0]) + Math.cos((result[i].angle - 5) * Math.PI / 180) * result[i].distance / 60;
        console.log(lat, lng);
        let colour = getLeastValue([result[i].txmain, result[i].rxmain, result[i].txstby, result[i].rxstby]);
        let markerLayer = L.marker([lat, lng], {
            icon: new L.AwesomeNumberMarkers({
                // number: i,
                markerColor: colour,
                pane: 'resultMarkerPane'
            })
        }).bindTooltip(
            "<table><tr><td>표지소</td><td>주파수</td><td>검사명</td><td>TX-MAIN</td><td>RX-MAIN</td><td>TX-STBY</td><td>RX-STBY</td><td>각도</td><td>거리</td><td>고도</td></tr>" +
            "<tr><td>" + result[i].site + "</td><td>" + result[i].freq + "</td><td>" + document.getElementById('firstReqText').innerText + "</td><td>" + result[i].txmain + "</td><td>" + result[i].rxmain + "</td><td>" +
            result[i].txstby + "</td><td>" + result[i].rxstby + "</td><td>" + result[i].angle + "</td><td>" + result[i].distance + "</td><td>" + result[i].height + "</td></tr></table>",
            {sticky: true, pane: 'tooltipPane'}).addTo(map)

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
        let lng = parseFloat(markers[site.indexOf(result[i].site)][1]) + Math.sin((result[i].angle - 5) * Math.PI / 180) * result[i].distance / 48;
        let lat = parseFloat(markers[site.indexOf(result[i].site)][0]) + Math.cos((result[i].angle - 5) * Math.PI / 180) * result[i].distance / 60;
        let colour = getLeastValue([result[i].txmain, result[i].rxmain, result[i].txstby, result[i].rxstby]);
        const markerLayer = L.marker([lat, lng], {
            icon: new L.AwesomeNumberMarkers({
                // number: i,
                markerColor: colour, pane: 'resultMarkerPane'
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
    let minimum = 999;
    for (let i in list) {
        if (list[i] != null && list[i].length == 3) {
            let parseResult = parseInt(list[i][0]) + parseInt(list[i][2]);
            if (minimum >= parseResult) {
                minimum = parseResult;
            }
        } else if (list[i].length < 3) {
            let parseResult = parseInt(list[i][0]) * 2;
            if (minimum >= parseResult) {
                minimum = parseResult;
            }
        }
    }
    console.log(minimum);

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
        url = `http://${server_add}:3000/flight/list/${column}/desc`
    } else {
        clickedColumn = [column, clickedColumn[1] + 1];
        url = `http://${server_add}:3000/flight/list/${column}/asc`
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
    fetch(`http://${server_add}:3000/notice`)
        .then(res => {
            res.json()
                .then(_res => {
                    document.getElementById('noticeTbody').innerHTML = _res.map((c) => {
                        return `<tr class="noticeTableRow"><td class="noticeTableTitle">${c.title}</td>
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
    fetch(`http://${server_add}:3000/notice/add`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            result
        })
    }).then(res => {
        alert('공지사항을 성공적으로 추가하였습니다.');
        getFifthNoticeData();
        closeFifthNoticeAdd(true);
    })
};

delNoticeData = (elem) => {
    let result = {};
    result['title'] = elem.parentElement.parentElement.children[0].innerText;
    result['context'] = elem.parentElement.parentElement.children[1].innerText;
    if (window.confirm('해당 공지사항을 삭제할까요?')) {
        fetch(`http://${server_add}:3000/notice/del`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                result
            })
        }).then(res => {
            alert('공지사항을 성공적으로 삭제하였습니다.');
            getFifthNoticeData();
        })
    }
};

getFifthRouteData = () => {
    fetch(`http://${server_add}:3000/flight/route`)
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

onLoadProcedure = async () => {

    if(window.name != popup) {
        await openNotice();
    }
    await loadSector();
    await loadRoutes();
    await loadFixPoints();
    await loadSites();
    await selectFormGetSite();

    await setTimeout(() => {
        const a = document.getElementsByClassName('leaflet-control-layers-selector leaflet-layerstree-sel-all-checkbox');
        a[0].click();
    }, 100)
}