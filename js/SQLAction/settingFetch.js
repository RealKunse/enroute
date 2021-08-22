$("#fifthSectorAddSectorName").on("propertychange change keyup paste", () => {
    isSectorNameDuplicate = true;
    document.getElementById('fifthSectorAddNameContext').innerText = ''
});

$("#fifthSectorEditSectorName").on("propertychange change keyup paste", () => {
    isSectorNameDuplicate = true;
    document.getElementById('fifthSectorEditNameContext').innerText = ''
});

$("#fifthRouteEditName").on("propertychange change keyup paste", () => {
    isRouteNameDuplicate = true;
    document.getElementById('fifthRouteEditNameContext').innerText = ''
});

$("#fifthRouteAddName").on("propertychange change keyup paste", () => {
    isRouteNameDuplicate = true;
    document.getElementById('fifthRouteAddNameContext').innerText = ''
});

renderSiteType = (event) => {
    document.getElementById("fifthSiteTypeRenderer").innerText = event.target.value;
}

getFreqList = async () => {
    fetch(`http://${server_add}:3000/flight/freq`, {method: "GET"})
        .then(res => {
            res.json().then(response => {
                document.getElementById('fifthFreqTablebody').innerHTML = '';
                document.getElementById('fifthFreqTablebody').innerHTML
                    = response.map((c) => {
                    return `
                        <tr>
                        <td >${c.frequency}</td>
                        <td >${c.freqsite}</td>
                        <td>${c.sector_fk}</td>
                        <td><button type="button" class="editButton" onclick="openFifthFreqEdit(this)">수정</button></td>
                        <td><button type="button" class="deleteButton" onclick="fifthFreqDelete(this)">삭제</button></td>
                        </tr>`
                }).join('');
            })
                .catch(error => console.log(error));
        }).catch(err => console.err(err))
};

fifthFreqDelete = (obj) => {
    let result = {};
    result['freq'] = obj.parentElement.parentElement.children[0].innerText;
    result['site'] = obj.parentElement.parentElement.children[1].innerText;
    if (window.confirm(result['freq'] + " 주파수를 삭제할까요?") == true) {


        fetch(`http://${server_add}:3000/flight/freq/delete/`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                result
            })
        }).then((res) => {
            if (res.status == 200) {
                window.alert('주파수 삭제에 성공하였습니다.');
                getFreqList();
            }
        }).catch((err) => {
            console.error(err);
            window.alert('에러가 발생하였습니다.\n관리자에게 문의하세요.');
        })
    }
};

fifthFreqAddConfirm = async () => {
    const [site, freq, sector] = [document.getElementById("fifthFreqAddSiteInput").value,
        document.getElementById("fifthFreqAddFreqInput").value,
        document.getElementById("fifthFreqAddSectorInput").value];

    let result = {};
    result['freq'] = freq;
    result['site'] = site;
    result['sector'] = sector;
    fetch(`http://${server_add}:3000/flight/freq/add/`, {
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
            console.log(res);

            res.json().then($res => {
                if ($res.errno == 1062) {
                    window.alert('중복된 주파수입니다.\n주파수 목록에 이미 있는지 확인해주세요.')
                    throw new Error('중복 주파수');
                }

                console.log($res);
                window.alert('주파수 추가에 성공하였습니다.');
                closeFifthFreqAdd(true);
                getFreqList();

            })
                .catch(err => {
                    window.alert('에러가 발생하였습니다.\n관리자에게 문의하세요.');
                    console.log(err)
                })
        }).catch(err => {
        console.log(err)
    })
};

fifthFreqEditConfirm = async () => {
    const [site, freq, sector] = [document.getElementById("fifthFreqEditSiteInput").value,
        document.getElementById("fifthFreqEditFreqInput").value,
        document.getElementById("fifthFreqEditSectorInput").value];
    let result = {};
    result['freq'] = freq;
    result['site'] = site;
    result['sector'] = sector;
    result['_freq'] = _fifthEditFreq;
    result['_site'] = _fifthEditStie;
    result['_sector'] = _fifthEditSector;

    fetch(`http://${server_add}:3000/flight/freq/edit/`, {
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
            console.log(res);
            res.json().then($res => {
                console.log($res);
                getFreqList();
                window.alert('주파수 수정에 성공하였습니다.');
                closeFifthFreqEdit(true);
            })
                .catch(err => {
                    console.log(err)
                })
        }).catch(err => {
        console.log(err)
    })
};

getSiteList = async () => {
    fetch("http://${server_add}:3000/flight/site", {method: "GET"})
        .then(res => {
            res.json().then(response => {
                document.getElementById('fifthSiteTablebody').innerHTML = '';
                document.getElementById('fifthSiteTablebody').innerHTML
                    = response.map((c) => {
                    return `
                        <tr>
                        <td >${c.sitename}</td>
                        <td >${c.sitelat}</td>
                        <td>${c.sitelng}</td>
                        <td>${c.issite ? '일반' : c.islowsite ? '저고도' : c.isvortac ? 'VORTAC' : 'undefined'}</td>
                        <td><button type="button" class="editButton" onclick="openFifthSiteEdit(this)">수정</button></td>
                        <td><button type="button" class="deleteButton" onclick="fifthSiteDelete(this)">삭제</button></td>
                        </tr>`
                }).join('');
            })
                .catch(error => console.log(error));
        }).catch(err => console.err(err))
};

fifthSiteAddConfirm = async () => {

    const [site, lat, lng, type] = [document.getElementById("fifthSiteAddSiteInput").value,
        document.getElementById("fifthSiteAddLatInput").value,
        document.getElementById("fifthSiteAddLngInput").value,
        document.getElementById("fifthSiteTypeRenderer").innerHTML];

    let result = {};
    result['site'] = site;
    result['lat'] = lat;
    result['lng'] = lng;
    result['type'] = type;
    console.log(result);
    fetch(`http://${server_add}:3000/flight/site/add/`, {
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
            console.log(res);
            res.json().then($res => {

                console.log($res);
                if ($res.errno == 1062) {
                    window.alert('이미 추가되어있는 표지소입니다.\n목록을 확인해주세요.')
                } else {
                    window.alert('표지소 추가에 성공하였습니다.');
                    closeFifthSiteAdd(true);
                    getSiteList();
                }
            })
                .catch(err => {
                    console.log(err)
                    window.alert('에러가 발생했습니다.')
                })
        }).catch(err => {
        console.log(err)
        window.alert('에러가 발생했습니다.\n관리자에게 문의하십시오.')
    })
};

fifthSiteEditConfirm = async () => {
    const [site, lat, lng] = [document.getElementById("fifthSiteEditSiteInput").value,
        document.getElementById("fifthSiteEditLatInput").value,
        document.getElementById("fifthSiteEditLngInput").value];
    let result = {};
    result['site'] = site;
    result['lat'] = lat;
    result['lng'] = lng;
    result['_site'] = editvault.sitename;

    fetch(`http://${server_add}:3000/flight/site/edit/`, {
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
                if ($res.errno == 1062) {
                    window.alert('이미 등록되어있는 표지소입니다.\n목록을 확인해주세요.')
                } else {
                    window.alert('표지소 수정을 성공하였습니다.');
                    closeFifthSiteEdit(true);
                    getSiteList();
                }
            })
                .catch(err => {
                    console.log(err);
                    window.alert('에러가 발생했습니다.\n관리자에게 문의하십시오.')
                })
        }).catch(err => {
        console.log(err);
        window.alert('에러가 발생했습니다.\n관리자에게 문의하십시오.')
    })
};

fifthSiteDelete = (obj) => {
    let result = {};
    result['site'] = obj.parentElement.parentElement.children[0].innerText;
    if (window.confirm(result['site'] + " 표지소를 삭제할까요?") == true) {


        fetch(`http://${server_add}:3000/flight/site/delete/`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                result
            })
        }).then(() => {
            console.log(result, "deleted");
            window.alert('표지소를 성공적으로 삭제하였습니다.');
            getSiteList();
        }).catch((err) => {
            console.error(err);
            window.alert('에러가 발생했습니다.\n관리자에게 문의하십시오.');
        })
    }
};

getFixList = async () => {
    fetch(`http://${server_add}:3000/flight/fix`, {method: "GET"})
        .then(res => {
            res.json().then(response => {
                document.getElementById('fifthFixTablebody').innerHTML = '';
                document.getElementById('fifthFixTablebody').innerHTML
                    = response.map((c) => {
                    return `
                        <tr>
                        <td >${c.pointname}</td>
                        <td >${c.pointlat}</td>
                        <td>${c.pointlng}</td>
                        <td><button type="button" class="editButton" onclick="openFifthFixEdit(this)">수정</button></td>
                        <td><button type="button" class="deleteButton" onclick="fifthFixDelete(this)">삭제</button></td>
                        </tr>`
                }).join('');
            })
                .catch(error => console.log(error));
        }).catch(err => console.err(err))
};

fifthFixAddConfirm = async () => {
    const [name, lat, lng] = [document.getElementById("fifthFixAddNameInput").value,
        document.getElementById("fifthFixAddLatInput").value,
        document.getElementById("fifthFixAddLngInput").value];

    let result = {};
    result['name'] = name;
    result['lat'] = lat;
    result['lng'] = lng;
    console.log(result);
    fetch(`http://${server_add}:3000/flight/fix/add/`, {
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
            console.log(res);
            res.json().then($res => {
                if ($res.errno == 1062) {
                    window.alert('이미 등록되어있는 표지소입니다.\n목록을 확인해주세요.')
                } else {
                    window.alert('픽스점 추가에 성공하였습니다.');
                    closeFifthFixAdd(true);
                    getFixList();
                }
            })
                .catch(err => {
                    window.alert('에러가 발생하였습니다.\n관리자에게 문의하세요.');
                    console.log(err)
                })
        }).catch(err => {
        window.alert('에러가 발생하였습니다.\n관리자에게 문의하세요.');
        console.log(err)
    })
};

fifthFixEditConfirm = async () => {
    const [name, lat, lng] = [document.getElementById("fifthFixEditNameInput").value,
        document.getElementById("fifthFixEditLatInput").value,
        document.getElementById("fifthFixEditLngInput").value];
    let result = {};
    result['name'] = name;
    result['lat'] = lat;
    result['lng'] = lng;
    result['_name'] = editvault.fixname;

    fetch(`http://${server_add}:3000/flight/fix/edit/`, {
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
                console.log($res);
                if ($res.errno == 1062) {
                    window.alert('이미 등록되어있는 표지소입니다.\n목록을 확인해주세요.')
                } else {
                    window.alert('픽스점을 성공적으로 수정하였습니다.');
                    closeFifthFixEdit(true);
                    getFixList();
                }
            })
                .catch(err => {
                    console.log(err)
                })
        }).catch(err => {
        console.log(err)
    })
};

fifthFixDelete = (obj) => {
    let result = {};
    result['name'] = obj.parentElement.parentElement.children[0].innerText;
    if (window.confirm(result['name'] + " 픽스점을 삭제할까요?") == true) {
        fetch(`http://${server_add}:3000/flight/fix/delete/`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                result
            })
        }).then((res) => {
            window.alert('픽스점을 성공적으로 삭제했습니다.');
            console.log(result, "deleted");
            getFixList();
        }).catch((err) => {
            console.error(err);
        })
    }
};


let isSectorNameDuplicate = true;
let isRouteNameDuplicate;

getSectorList = () => {
    fetch(`http://${server_add}:3000/flight/sector`, {method: "GET"})
        .then(res => {
            res.json().then(response => {
                document.getElementById('fifthSectorList').innerHTML = '';
                document.getElementById('fifthSectorList').innerHTML
                    = response.map((c) => {
                    return `
                        <li class="option" onclick="onClickOption(event)">${c.sectorname}</li>`
                }).join('');
            })
                .catch(error => console.log(error));
        }).catch(err => console.err(err))
};

fifthSectorAddFocus = (event) => {
    let tr = document.createElement('tr');
    tr.className = 'fifthSectorAddAddTableRow';
    tr.innerHTML = `<td class="fifthSectorAddFocusTD">
                            <label>
                                <input type="number" class="fifthSectorAddLat"/>
                            </label>
                        </td>
                        <td>
                            <label>
                                <input type="number" class="fifthSectorAddLng"/>
                            </label>
                        </td>
                        <td class="fifthSectorAddRowTD">
                        <div style="display: flex">
                            <div class="firstAddRowButton fifthSectorAddRowButton" tabindex="0" onfocus="fifthSectorAddFocus()">+</div>
                            <div class="firstAddRowButton fifthSectorAddDelRowButton" onclick="fifthSectorAddDelButton(event)">-</div>
                            </div>
                        </td>`;
    document.getElementById('fifthSectorAddTbody').appendChild(tr);

    for (let i in document.getElementsByClassName('fifthSectorAddRowTD')) {
        if (i != document.getElementsByClassName('fifthSectorAddRowTD').length - 1) {
            document.getElementsByClassName('fifthSectorAddRowTD')[i].innerHTML = '<div class="firstAddRowButton fifthSectorAddDelRowButton" onclick="fifthSectorAddDelButton(event)">-</div>'
        }
    }
    document.getElementsByClassName('fifthSectorAddLat')[document.getElementsByClassName('fifthSectorAddLat').length - 1].focus();
};

fifthSectorAddDelButton = (event) => {
    if (event.currentTarget.parentElement.parentElement.parentElement.nodeName == "TR") {
        event.currentTarget.parentElement.parentElement.parentElement.remove();
    } else {
        event.currentTarget.parentElement.parentElement.remove();
    }


    for (let i in document.getElementsByClassName('fifthSectorAddLat')) {
        if (i == document.getElementsByClassName('fifthSectorAddLat').length - 1 && document.getElementsByClassName('fifthSectorAddLat').length != 1) {
            document.getElementsByClassName('fifthSectorAddRowTD')[i].innerHTML = `<div style="display: flex">
                                                                                        <div class="firstAddRowButton fifthSectorAddRowButton" tabindex="0" onfocus="fifthSectorAddFocus()">+</div>
                                                                                        <div class="firstAddRowButton fifthSectorAddDelRowButton" onclick="fifthSectorAddDelButton(event)">-</div>
                                                                                        </div>`;
        } else if (i == document.getElementsByClassName('fifthSectorAddLat').length - 1 && document.getElementsByClassName('fifthSectorAddLat').length == 1) {
            document.getElementsByClassName('fifthSectorAddRowTD')[i].innerHTML = `<div style="display: flex">
                                                                                        <div class="firstAddRowButton fifthSectorAddRowButton" tabindex="0" onfocus="fifthSectorAddFocus()">+</div>
                                                                                        </div>`;
        } else if (i <= document.getElementsByClassName('fifthSectorAddLat').length - 2) {
            document.getElementsByClassName('fifthSectorAddRowTD')[i].innerHTML = `<div class="firstAddRowButton fifthSectorAddDelRowButton" onclick="fifthSectorAddDelButton(event)">-</div>`;
        }
    }
};

fifthSectorAddConfirmData = async () => {
    if (isSectorNameDuplicate) {
        alert("중복 체크가 필요합니다.");
        return;
    }

    if (document.getElementsByClassName('fifthSectorAddLat').length !== 0) {
        for (let i in document.getElementsByClassName('fifthSectorAddLat')) {

            if (
                (document.getElementsByClassName('fifthSectorAddLat')[i].value == '' || document.getElementsByClassName('fifthSectorAddLng')[i].value == '')
            ) {
                alert((parseInt(i) + 1) + '번째 열의 위도와 경도를 입력해주세요.',);
                return;
            }
        }
    } else {
        alert('점검값을 추가해주세요.');
    }
    let result = {
        sectorName: $('#fifthSectorAddSectorName').val(),
        data: {},
    };

    for (let i = 0; i < document.getElementsByClassName('fifthSectorAddAddTableRow').length; i++) {
        for (let j = 0; j < document.getElementsByClassName('fifthSectorAddAddTableRow')[i].children.length; j++) {
            switch (j) {
                case 0:
                    result['data'][i] = {
                        sectorLat: document.getElementsByClassName('fifthSectorAddAddTableRow')[i].children[0].children[0].children[0].value,
                    };
                    break;
                case 1:
                    result['data'][i]['sectorLng'] = document.getElementsByClassName('fifthSectorAddAddTableRow')[i].children[1].children[0].children[0].value;
                    break;
            }
        }
    }

    fetch(`http://${server_add}:3000/flight/sector/add`, {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            result,
        }),
    }).then((res) => {
        alert("섹터가 성공적으로 추가되었습니다.\n페이지의 적용을 위해 페이지를 새로고침합니다.");
        refresh();
        console.log(res.json())
    });
};


fifthSectorNameCheckAdd = (event) => {
    const node = event.currentTarget.nextSibling.nextSibling;
    // document.getElementById('fifthSectorAddSectorName').value;
    const new_name = event.currentTarget.previousElementSibling.children[0].value;

    if (new_name == '') {
        alert("검사할 섹터의 이름을 입력해주세요.");
        return;
    }

    fetch(`http://${server_add}:3000/flight/sector/name/${new_name}`)
        .then((res) => {
            res.json().then(_res => {
                console.log(_res[0]);
                if (_res[0].count == 0) {  // 중복 없음

                    // document.getElementById('fifthSectorAddSectorName').disabled = true;
                    isSectorNameDuplicate = false;
                    node.innerText = '중복체크 완료'
                    // document.getElementById('fifthSectorAddNameContext').innerText = '중복체크 완료'
                } else {
                    alert('이미 같은 이름의 섹터가 존재합니다.');
                }
            });
        })
};

fifthSectorNameCheckEdit = (event) => {
    const node = event.currentTarget.nextSibling.nextSibling;
    // document.getElementById('fifthSectorAddSectorName').value;
    const new_name = event.currentTarget.previousElementSibling.children[0].value;

    if (new_name == '') {
        alert("검사할 섹터의 이름을 입력해주세요.");
        return;
    }
    console.log(new_name, document.getElementById('fifthSectorSelectLabel').innerText);
    if (new_name == document.getElementById('fifthSectorSelectLabel').innerText) {
        alert("기존 섹터와 이름이 같습니다.");
        node.innerText = '';
        isSectorNameDuplicate = false;
        return;
    }
    fetch(`http://${server_add}:3000/flight/sector/name/${new_name}`)
        .then((res) => {
            res.json().then(_res => {
                console.log(_res[0]);
                if (_res[0].count == 0) {  // 중복 없음

                    // document.getElementById('fifthSectorAddSectorName').disabled = true;
                    isSectorNameDuplicate = false;
                    node.innerText = '중복체크 완료'
                    // document.getElementById('fifthSectorAddNameContext').innerText = '중복체크 완료'
                } else {
                    alert('이미 같은 이름의 섹터가 존재합니다.');
                }
            });
        })
};

fifthSectorEditOpenFetch = async () => {
    let result = {};
    result['sector'] = document.getElementById('fifthSectorSelectLabel').innerText;
    fetch(`http://${server_add}:3000/flight/sector/edit/open`, {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            result,
        })
    })
        .then(res => {
            res.json()
                .then(_res => {
                    document.getElementById('fifthSectorEditTbody').innerHTML = '';
                    // console.log(_res);
                    for (let i = 0; i < _res.length; i++) {
                        fifthSectorEditFocus();
                    }
                    for (let i in _res) {
                        document.getElementsByClassName('fifthSectorEditLat')[i].value = _res[i].sectorlat;
                        document.getElementsByClassName('fifthSectorEditLng')[i].value = _res[i].sectorlng;
                    }
                })
        })
}

fifthSectorEditFocus = (event) => {
    let tr = document.createElement('tr');
    tr.className = 'fifthSectorEditAddTableRow';
    tr.innerHTML = `<td class="fifthSectorEditFocusTD">
                            <label>
                                <input type="number" class="fifthSectorEditLat"/>
                            </label>
                        </td>
                        <td>
                            <label>
                                <input type="number" class="fifthSectorEditLng"/>
                            </label>
                        </td>
                        <td class="fifthSectorEditRowTD">
                        <div style="display: flex">
                            <div class="firstAddRowButton fifthSectorEditRowButton" tabindex="0" onfocus="fifthSectorEditFocus()">+</div>
                            <div class="firstAddRowButton fifthSectorEditDelRowButton" onclick="fifthSectorEditDelButton(event)">-</div>
                            </div>
                        </td>`;
    document.getElementById('fifthSectorEditTbody').appendChild(tr);

    for (let i in document.getElementsByClassName('fifthSectorEditRowTD')) {
        if (i != document.getElementsByClassName('fifthSectorEditRowTD').length - 1) {
            document.getElementsByClassName('fifthSectorEditRowTD')[i].innerHTML = '<div class="firstAddRowButton fifthSectorEditDelRowButton" onclick="fifthSectorEditDelButton(event)">-</div>'
        }
    }
    document.getElementsByClassName('fifthSectorEditLat')[document.getElementsByClassName('fifthSectorEditLat').length - 1].focus();
};

fifthSectorEditDelButton = (event) => {
    if (event.currentTarget.parentElement.parentElement.parentElement.nodeName == "TR") {
        event.currentTarget.parentElement.parentElement.parentElement.remove();
    } else {
        event.currentTarget.parentElement.parentElement.remove();
    }
    for (let i in document.getElementsByClassName('fifthSectorEditLat')) {
        if (i == document.getElementsByClassName('fifthSectorEditLat').length - 1 && document.getElementsByClassName('fifthSectorEditLat').length != 1) {
            document.getElementsByClassName('fifthSectorEditRowTD')[i].innerHTML = `<div style="display: flex">
                                                                                        <div class="firstAddRowButton fifthSectorEditRowButton" tabindex="0" onfocus="fifthSectorEditFocus()">+</div>
                                                                                        <div class="firstAddRowButton fifthSectorEditDelRowButton" onclick="fifthSectorEditDelButton(event)">-</div>
                                                                                        </div>`;
        } else if (i == document.getElementsByClassName('fifthSectorEditLat').length - 1 && document.getElementsByClassName('fifthSectorEditLat').length == 1) {
            document.getElementsByClassName('fifthSectorEditRowTD')[i].innerHTML = `<div style="display: flex">
                                                                                        <div class="firstAddRowButton fifthSectorEditRowButton" tabindex="0" onfocus="fifthSectorEditFocus()">+</div>
                                                                                        </div>`;
        } else if (i <= document.getElementsByClassName('fifthSectorEditLat').length - 2) {
            document.getElementsByClassName('fifthSectorEditRowTD')[i].innerHTML = `<div class="firstAddRowButton fifthSectorEditDelRowButton" onclick="fifthSectorEditDelButton(event)">-</div>`;
        }
    }
};

fifthSectorEditConfirmData = () => {
    if (isSectorNameDuplicate) {
        alert("중복 체크가 필요합니다.");
        return;
    }

    if (document.getElementsByClassName('fifthSectorEditLat').length !== 0) {
        for (let i in document.getElementsByClassName('fifthSectorEditLat')) {

            if (
                (document.getElementsByClassName('fifthSectorEditLat')[i].value == '' || document.getElementsByClassName('fifthSectorEditLng')[i].value == '')
            ) {
                alert((parseInt(i) + 1) + '번째 열의 위도와 경도를 입력해주세요.',);
                return;
            }
        }
    } else {
        alert('점검값을 추가해주세요.');
    }
    let result = {
        beforeName: document.getElementById('fifthSectorSelectLabel').innerText,
        sectorName: $('#fifthSectorEditSectorName').val(),
        data: {},
    };

    for (let i = 0; i < document.getElementsByClassName('fifthSectorEditAddTableRow').length; i++) {
        for (let j = 0; j < document.getElementsByClassName('fifthSectorEditAddTableRow')[i].children.length; j++) {
            switch (j) {
                case 0:
                    result['data'][i] = {
                        sectorLat: document.getElementsByClassName('fifthSectorEditAddTableRow')[i].children[0].children[0].children[0].value,
                    };
                    break;
                case 1:
                    result['data'][i]['sectorLng'] = document.getElementsByClassName('fifthSectorEditAddTableRow')[i].children[1].children[0].children[0].value;
                    break;
            }
        }
    }

    fetch(`http://${server_add}:3000/flight/sector/edit`, {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            result,
        }),
    }).then((res) => {
        alert("섹터를 성공적으로 변경하였습니다.\n페이지를 새로고침합니다.");
        refresh();
    });
};

fifthSectorDeleteData = () => {
    const del_data = document.getElementById('fifthSectorSelectLabel').innerText;
    if (del_data == '선택') {
        alert('삭제할 섹터를 선택해주세요.');
        return;
    }

    let result = {
        sectorName: del_data,
    };

    if (confirm(del_data + " 섹터를 정말 삭제할까요?")) {
        fetch(`http://${server_add}:3000/flight/sector/delete`, {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                result,
            }),
        }).then((res) => {
            res.json().then((_res) => {
                alert(_res.affectedRows + "개의 " + del_data + " 섹터 좌표 정보가 삭제되었습니다.");
                alert("섹터 삭제 정보의 적용을 위해 페이지를 새로고침합니다.");
                refresh();
            }).catch(err => console.log(err))
        });
    }
};

getFifthNoticeData = () => {
    fetch(`http://${server_add}:3000/notice_asc/`)
        .then((res) => {
            res.json()
                .then(_res => {
                    document.getElementById('fifthNoticeTBody').innerHTML = _res.map((c) => {
                        return `<tr class="noticeTableTitle"><td class="noticeTableTitle">${c.title}</td>
<td class="noticeTableContext">${c.context}</td>
<td class="noticeTableDate">${c.date.substr(0, 10)}</td>
<td>${c.type}</td>
<td>${c.version}</td>
<td><button class="darkGreyButton fifthNoticeDel" onclick="delNoticeData(this)">삭제</button></td></tr>`
                    }).join('')

                })
        })
};


fifthRouteAddFocus = () => {
    let tr = document.createElement('tr');
    tr.className = 'fifthRouteAddAddTableRow';
    tr.innerHTML = `<td class="fifthRouteAddFocusTD">
                            <label>
                                <input type="text" class="fifthRouteAddFix"/>
                            </label>
                        </td>
                        <td>
                            <label>
                                <input type="number" class="fifthRouteAddLow"/>
                            </label>
                        </td>
                        <td>
                            <label>
                                <input type="number" class="fifthRouteAddHigh"/>
                            </label>
                        </td>
                        <td class="fifthRouteAddRowTD">
                        <div style="display: flex">
                            <div class="firstAddRowButton fifthRouteAddRowButton" tabindex="0" onfocus="fifthRouteAddFocus()">+</div>
                            <div class="firstAddRowButton fifthRouteAddDelRowButton" onclick="fifthRouteAddDelButton(event)">-</div>
                            </div>
                        </td>`;
    document.getElementById('fifthRouteAddTbody').appendChild(tr);

    for (let i in document.getElementsByClassName('fifthRouteAddRowTD')) {
        if (i != document.getElementsByClassName('fifthRouteAddRowTD').length - 1) {
            document.getElementsByClassName('fifthRouteAddRowTD')[i].innerHTML = '<div class="firstAddRowButton fifthRouteAddDelRowButton" onclick="fifthRouteAddDelButton(event)">-</div>'
        }
    }
    document.getElementsByClassName('fifthRouteAddFix')[document.getElementsByClassName('fifthRouteAddFix').length - 1].focus();
};


fifthRouteAddDelButton = (event) => {
    if (event.currentTarget.parentElement.parentElement.parentElement.nodeName == "TR") {
        event.currentTarget.parentElement.parentElement.parentElement.remove();
    } else {
        event.currentTarget.parentElement.parentElement.remove();
    }


    for (let i in document.getElementsByClassName('fifthRouteAddFix')) {
        if (i == document.getElementsByClassName('fifthRouteAddFix').length - 1 && document.getElementsByClassName('fifthRouteAddFix').length != 1) {
            document.getElementsByClassName('fifthRouteAddRowTD')[i].innerHTML = `<div style="display: flex">
                                                                                        <div class="firstAddRowButton fifthRouteAddRowButton" tabindex="0" onfocus="fifthRouteAddFocus()">+</div>
                                                                                        <div class="firstAddRowButton fifthRouteAddDelRowButton" onclick="fifthRouteAddDelButton(event)">-</div>
                                                                                        </div>`;
        } else if (i == document.getElementsByClassName('fifthRouteAddFix').length - 1 && document.getElementsByClassName('fifthRouteAddFix').length == 1) {
            document.getElementsByClassName('fifthRouteAddRowTD')[i].innerHTML = `<div style="display: flex">
                                                                                        <div class="firstAddRowButton fifthRouteAddRowButton" tabindex="0" onfocus="fifthRouteAddFocus()">+</div>
                                                                                        </div>`;
        } else if (i <= document.getElementsByClassName('fifthRouteAddFix').length - 2) {
            document.getElementsByClassName('fifthRouteAddRowTD')[i].innerHTML = `<div class="firstAddRowButton fifthRouteAddDelRowButton" onclick="fifthRouteAddDelButton(event)">-</div>`;
        }
    }
};

fifthRouteEditFocus = (event) => {
    let tr = document.createElement('tr');
    tr.className = 'fifthRouteEditAddTableRow';
    tr.innerHTML = `<td class="fifthRouteEditFocusTD">
                            <label>
                                <input type="text" class="fifthRouteEditFix"/>
                            </label>
                        </td>
                        <td>
                            <label>
                                <input type="number" class="fifthRouteEditLow"/>
                            </label>
                        </td>
                        <td>
                            <label>
                                <input type="number" class="fifthRouteEditHigh"/>
                            </label>
                        </td>
                        <td class="fifthRouteEditRowTD">
                        <div style="display: flex">
                            <div class="firstAddRowButton fifthRouteEditRowButton" tabindex="0" onfocus="fifthRouteEditFocus()">+</div>
                            <div class="firstAddRowButton fifthRouteEditDelRowButton" onclick="fifthRouteEditDelButton(event)">-</div>
                            </div>
                        </td>`;
    document.getElementById('fifthRouteEditTbody').appendChild(tr);

    for (let i in document.getElementsByClassName('fifthRouteEditRowTD')) {
        if (i != document.getElementsByClassName('fifthRouteEditRowTD').length - 1) {
            document.getElementsByClassName('fifthRouteEditRowTD')[i].innerHTML = '<div class="firstAddRowButton fifthRouteEditDelRowButton" onclick="fifthRouteEditDelButton(event)">-</div>'
        }
    }
    document.getElementsByClassName('fifthRouteEditFix')[document.getElementsByClassName('fifthRouteEditFix').length - 1].focus();
};

fifthRouteEditOpenFetch = async () => {
    let result = {};
    result['name'] = document.getElementById('fifthRouteSelectLabel').innerText;
    fetch(`http://${server_add}:3000/flight/route/edit/open`, {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            result,
        })
    })
        .then(res => {
            res.json()
                .then(_res => {
                    for (let i = 0; i < _res.length - 1; i++) {
                        fifthRouteEditFocus();
                    }
                    console.log(_res);
                    for (let i in _res) {
                        document.getElementsByClassName('fifthRouteEditFix')[i].value = _res[i].name;
                        document.getElementsByClassName('fifthRouteEditLow')[i].value = _res[i].low;
                        document.getElementsByClassName('fifthRouteEditHigh')[i].value = _res[i].high;
                    }
                })
        })
};

fifthRouteEditDelButton = (event) => {
    if (event.currentTarget.parentElement.parentElement.parentElement.nodeName == "TR") {
        event.currentTarget.parentElement.parentElement.parentElement.remove();
    } else {
        event.currentTarget.parentElement.parentElement.remove();
    }


    for (let i in document.getElementsByClassName('fifthRouteEditFix')) {
        if (i == document.getElementsByClassName('fifthRouteEditFix').length - 1 && document.getElementsByClassName('fifthRouteEditFix').length != 1) {
            document.getElementsByClassName('fifthRouteEditRowTD')[i].innerHTML = `<div style="display: flex">
                                                                                        <div class="firstAddRowButton fifthRouteEditRowButton" tabindex="0" onfocus="fifthRouteEditFocus()">+</div>
                                                                                        <div class="firstAddRowButton fifthRouteEditDelRowButton" onclick="fifthRouteEditDelButton(event)">-</div>
                                                                                        </div>`;
        } else if (i == document.getElementsByClassName('fifthRouteEditFix').length - 1 && document.getElementsByClassName('fifthRouteEditFix').length == 1) {
            document.getElementsByClassName('fifthRouteEditRowTD')[i].innerHTML = `<div style="display: flex">
                                                                                        <div class="firstAddRowButton fifthRouteEditRowButton" tabindex="0" onfocus="fifthRouteEditFocus()">+</div>
                                                                                        </div>`;
        } else if (i <= document.getElementsByClassName('fifthRouteEditFix').length - 2) {
            document.getElementsByClassName('fifthRouteEditRowTD')[i].innerHTML = `<div class="firstAddRowButton fifthRouteEditDelRowButton" onclick="fifthRouteEditDelButton(event)">-</div>`;
        }
    }
};


fifthRouteNameCheckAdd = (event) => {
    const node = event.currentTarget.nextSibling.nextSibling;
    // document.getElementById('fifthSectorAddSectorName').value;

    const new_name = event.currentTarget.previousElementSibling.children[0].value;

    if (new_name == '') {
        alert("검사할 섹터의 이름을 입력해주세요.");
        return;
    }

    fetch(`http://${server_add}:3000/flight/route/name/${new_name}`)
        .then((res) => {
            res.json().then(_res => {
                console.log(_res[0]);
                if (_res[0].count == 0) {  // 중복 없음
                    // document.getElementById('fifthSectorAddSectorName').disabled = true;
                    isRouteNameDuplicate = false;
                    node.innerText = '중복체크 완료'
                    // document.getElementById('fifthSectorAddNameContext').innerText = '중복체크 완료'
                } else {
                    alert('이미 같은 이름의 섹터가 존재합니다.');
                }
            });
        })
};

fifthRouteNameCheckEdit = (event) => {
    const node = event.currentTarget.nextSibling.nextSibling;
    // document.getElementById('fifthSectorAddSectorName').value;
    const new_name = event.currentTarget.previousElementSibling.children[0].value;

    if (new_name == '') {
        alert("검사할 섹터의 이름을 입력해주세요.");
        return;
    }
    if (new_name == document.getElementById('fifthRouteSelectLabel').innerText) {
        alert("기존 섹터와 이름이 같습니다.");
        node.innerText = '';
        isRouteNameDuplicate = false;
        return;
    }
    fetch(`http://${server_add}:3000/flight/route/name/${new_name}`)
        .then((res) => {
            res.json().then(_res => {
                console.log(_res[0]);
                if (_res[0].count == 0) {  // 중복 없음

                    // document.getElementById('fifthSectorAddSectorName').disabled = true;
                    isRouteNameDuplicate = false;
                    node.innerText = '중복체크 완료'
                    // document.getElementById('fifthSectorAddNameContext').innerText = '중복체크 완료'
                } else {
                    alert('이미 같은 이름의 섹터가 존재합니다.');
                }
            });
        })
};

fifthRouteAddConfirmData = async () => {
    if (isRouteNameDuplicate) {
        alert("중복 체크가 필요합니다.");
        return;
    }

    if (document.getElementsByClassName('fifthRouteAddFix').length !== 0) {
        for (let i in document.getElementsByClassName('fifthRouteAddFix')) {

            if (
                (document.getElementsByClassName('fifthRouteAddFix')[i].value == '' || document.getElementsByClassName('fifthRouteAddLow')[i].value == '' || document.getElementsByClassName('fifthRouteAddHigh')[i].value == '')
            ) {
                alert((parseInt(i) + 1) + '번째 열의 정보를 입력해주세요.',);
                return;
            }
        }
    } else {
        alert('점검값을 추가해주세요.');
    }
    let result = {
        routeName: $('#fifthRouteAddName').val(),
        data: {},
    };

    for (let i = 0; i < document.getElementsByClassName('fifthRouteAddAddTableRow').length; i++) {
        for (let j = 0; j < document.getElementsByClassName('fifthRouteAddAddTableRow')[i].children.length; j++) {
            switch (j) {
                case 0:
                    result['data'][i] = {
                        fix: document.getElementsByClassName('fifthRouteAddAddTableRow')[i].children[0].children[0].children[0].value,
                    };
                    console.log(0);
                    break;
                case 1:
                    result['data'][i]['low'] = document.getElementsByClassName('fifthRouteAddAddTableRow')[i].children[1].children[0].children[0].value;
                    console.log(1);
                    break;
                case 2:
                    result['data'][i]['high'] = document.getElementsByClassName('fifthRouteAddAddTableRow')[i].children[2].children[0].children[0].value;
                    console.log(2);
                    break;
            }
        }
    }
    fetch(`http://${server_add}:3000/flight/route/add`, {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            result,
        }),
    }).then((res) => {
        alert(`항로 ${result.routeName}가 성공적으로 추가되었습니다.\n적용을 위해 페이지를 새로고침합니다.`);
        refresh();
    });
};

fifthRouteEditConfirmData = () => {
    if (isRouteNameDuplicate) {
        alert("중복 체크가 필요합니다.");
        return;
    }

    if (document.getElementsByClassName('fifthRouteEditFix').length !== 0) {
        for (let i in document.getElementsByClassName('fifthRouteEditFix')) {

            if (
                (document.getElementsByClassName('fifthRouteEditFix')[i].value == '' || document.getElementsByClassName('fifthRouteEditLow')[i].value == '' || document.getElementsByClassName('fifthRouteEditHigh')[i].value == '')
            ) {
                alert((parseInt(i) + 1) + '번째 열의 정보를 입력해주세요.',);
                return;
            }
        }
    } else {
        alert('점검값을 추가해주세요.');
    }
    let result = {
        beforeName: document.getElementById('fifthRouteSelectLabel').innerText,
        routeName: $('#fifthRouteEditName').val(),
        data: {},
    };

    for (let i = 0; i < document.getElementsByClassName('fifthRouteEditAddTableRow').length; i++) {
        for (let j = 0; j < document.getElementsByClassName('fifthRouteEditAddTableRow')[i].children.length; j++) {
            switch (j) {
                case 0:
                    result['data'][i] = {
                        fix: document.getElementsByClassName('fifthRouteEditAddTableRow')[i].children[0].children[0].children[0].value,
                    };
                    console.log(0);
                    break;
                case 1:
                    result['data'][i]['low'] = document.getElementsByClassName('fifthRouteEditAddTableRow')[i].children[1].children[0].children[0].value;
                    console.log(1);
                    break;
                case 2:
                    result['data'][i]['high'] = document.getElementsByClassName('fifthRouteEditAddTableRow')[i].children[2].children[0].children[0].value;
                    console.log(2);
                    break;
            }
        }
    }
    console.log(result);
    fetch(`http://${server_add}:3000/flight/route/edit`, {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            result,
        }),
    }).then((res) => {
        console.log(res.json());
        alert("적용을 위해 페이지를 새로고침합니다.");
        refresh();
    });
};


fifthRouteDeleteData = () => {
    const del_data = document.getElementById('fifthRouteSelectLabel').innerText;
    if (del_data == '선택') {
        alert('삭제할 항로를 선택해주세요.');
        return;
    }

    let result = {
        routeName: del_data,
    };

    if (confirm(del_data + " 항로를 정말 삭제할까요?")) {
        fetch(`http://${server_add}:3000/flight/route/delete`, {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                result,
            }),
        }).then((res) => {
            res.json().then((_res) => {
                alert(_res.affectedRows + "개의 " + del_data + " 항로 정보가 삭제되었습니다.");
                alert("항로 삭제 정보의 적용을 위해 페이지를 새로고침합니다.");
                refresh();
            }).catch(err => console.log(err))
        });
    }
}