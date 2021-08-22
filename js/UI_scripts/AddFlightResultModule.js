firstAddButton = () => {
    if (document.getElementById('firstAddRowButton') !== null)
        document.getElementById('firstAddRowButton').remove();
    let tr = document.createElement('tr');
    tr.className = 'firstAddTableRow styleTableRow';
    tr.innerHTML = `<td class="firstTableNumber"></td>
                    <td><input type="text" class="firstSiteInput firstAddInput1" placeholder="표지소" </td>
                    <td><input type="number" class="firstFrequncyInput firstAddInput1" step="0.025" min="100" max="400" placeholder="주파수"/></td>
                    <td><input type="text" class="firstTXMInput firstAddInput2" placeholder="TX-Main 0/5" onkeyPress="checkInputForRadio(event);"/></td>
                    <td><input type="text" class="firstRXMInput firstAddInput2" placeholder="RX-Main 0/5" onkeyPress="checkInputForRadio(event);"/></td>
                    <td><input type="text" class="firstTXSInput firstAddInput2" placeholder="TX-Stby 0/5" onkeyPress="checkInputForRadio(event);"/></td>
                    <td><input type="text" class="firstRXSInput firstAddInput2" placeholder="RX-Stby 0/5" onkeyPress="checkInputForRadio(event);"/></td>
                    <td><input type="number" class="firstDistance firstAddInput1" step="100" min="3000" max="50000" placeholder="거리 (ft)"/></td>
                    <td><input type="number" class="firstAngle firstAddInput1" step=".1" min="0" max="359.9" placeholder="각도"/></td>
                    <td><input type="number" class="firstHeight firstAddInput1" step="10" min="0" max="50000" placeholder="고도"/> </td>
                    <td class="firstAddTableButtonForm"> </td>`;

    document.getElementById('firstAddTableBody').appendChild(tr);

    for (let i in document.getElementsByClassName('firstFrequncyInput')) {
        if (i == document.getElementsByClassName('firstFrequncyInput').length - 1) {
            document.getElementsByClassName('firstAddTableButtonForm')[i].innerHTML = `<div style="display: flex">
                                                                                        <div class="firstAddRowButton" id="firstAddRowButton" tabindex="0" onfocus="firstAddButton()">+</div>
                                                                                        <div class="firstAddRowButton" tabindex="0" onclick="firstDelButton(${i})">-</div>
                                                                                        </div>`;
        } else if (i == document.getElementsByClassName('firstFrequncyInput').length - 2) {
            document.getElementsByClassName('firstAddTableButtonForm')[i].innerHTML = `<div class="firstAddRowButton" tabindex="0" onclick="firstDelButton(${i})">-</div>`;
        } else {
        }
    }

    for (let i in document.getElementsByClassName('firstFrequncyInput')) {
        document.getElementsByClassName('firstTableNumber')[i].innerText = parseInt(i) + 1;
    }

    document.getElementsByClassName('firstSiteInput')[document.getElementsByClassName('firstSiteInput').length - 1].focus();
    if (document.getElementsByClassName('firstSiteInput').length >= 2) {
        const minus_one = document.getElementsByClassName('firstSiteInput').length - 1;
        const minus_two = document.getElementsByClassName('firstSiteInput').length - 2;
        document.getElementsByClassName('firstSiteInput')[minus_one].value = document.getElementsByClassName('firstSiteInput')[minus_two].value;
        document.getElementsByClassName('firstFrequncyInput')[minus_one].value = document.getElementsByClassName('firstFrequncyInput')[minus_two].value;

    }
};

firstAddRowConfirmOnFocus = () => {
    if (document.getElementById('firstTitleInput').value == '') {
        alert('비행검사명이 입력되지 않았습니다.');
        return document.getElementById('firstTitleInput').focus();
    } else if (document.getElementById('firstDateInput').value == '') {
        alert('날짜가 입력되지 않았습니다.');
        return document.getElementById('firstDateInput').focus();
    } else if (document.getElementById('firstTypeSelectLabel').innerText == '점검타입') {
        alert('점검 타입이 설정되지 않았습니다.');
        return document.getElementById('firstTitleInput').focus();
    } else if (document.getElementById('firstRouteUpload').value == '') {
        if (!confirm('경로를 추가하지 않고 진행할까요?')) {
            document.getElementById('firstRouteUpload').focus();
            return;
        }
    }

    if (
        !confirm(
            '비행검사명 : ' + document.getElementById('firstTitleInput').value +
            '\n날짜 : ' + document.getElementById('firstDateInput').value +
            (document.getElementById('firstRouteUpload').value == ''
                ? ''
                : '\n파일명 : ' +
                document.getElementById('firstRouteUpload').files[0].name) +
            '\n위 정보로 데이터를 추가하시겠습니까?',
        )
    ) {

        document.getElementById('firstTitleInput').focus();
        return;
    }

    firstAddButton();
    onRouteUpload(event);
    document.getElementById('firstAddButton').innerText = '완료';
    document.getElementById('firstAddButton').onfocus = '';
    document.getElementById('firstAddButton').visibility = 'hidden';
    document.getElementById('firstTitleInput').disabled = true;
    document.getElementById('firstDateInput').disabled = true;
    document.getElementById('firstRouteUpload').disabled = true;
};

firstDelButton = (idx) => {
    document.getElementsByClassName('firstAddTableRow')[idx].remove();

    for (let i in document.getElementsByClassName('firstFrequncyInput')) {
        if (i == document.getElementsByClassName('firstFrequncyInput').length - 1) {
            document.getElementsByClassName('firstAddTableButtonForm')[i].innerHTML = `<div style="display: flex">
                                                                                        <div class="firstAddRowButton" id="firstAddRowButton" tabindex="0" onfocus="firstAddButton()">+</div>
                                                                                        <div class="firstAddRowButton" tabindex="0" onclick="firstDelButton(${i})">-</div>
                                                                                        </div>`;
        } else if (
            i == document.getElementsByClassName('firstFrequncyInput').length - 2) {
            document.getElementsByClassName('firstAddTableButtonForm')[i].innerHTML = `<div class="firstAddRowButton" tabindex="0" onclick="firstDelButton(${i})">-</div>`;
        } else {
        }
    }

    for (let i in document.getElementsByClassName('firstFrequncyInput')) {
        document.getElementsByClassName('firstTableNumber')[i].innerText =
            parseInt(i) + 1;
    }

    document.getElementsByClassName('firstSiteInput')[document.getElementsByClassName('firstSiteInput').length - 1].focus();
};

confirmData = async () => {
    if (document.getElementById('firstTitleInput').value == '') {
        alert('비행검사명이 입력되지 않았습니다.');
        return;
    } else if (document.getElementById('firstDateInput').value == '') {
        alert('날짜가 입력되지 않았습니다.');
        return;
    }

    if (document.getElementsByClassName('firstFrequncyInput').length !== 0) {
        for (let i in document.getElementsByClassName('firstFrequncyInput')) {
            if (
                document.getElementsByClassName('firstFrequncyInput')[i].value == ''
            ) {
                alert(
                    document.getElementsByClassName('firstTableNumber')[i].innerText + '번째 열의 주파수가 입력되지 않았습니다',
                );
                return;
            }
            if (
                (document.getElementsByClassName('firstTXMInput')[i].value == '' || document.getElementsByClassName('firstRXMInput')[i].value == '') &&
                (document.getElementsByClassName('firstTXSInput')[i].value == '' || document.getElementsByClassName('firstRXSInput')[i].value == '')
            ) {
                alert(
                    document.getElementsByClassName('firstTableNumber')[i].innerText + '번째 열의 주파수 점검값(Main 또는 Stby)을 입력해주세요.',
                );
                return;
            }
        }
    } else {
        alert('점검값을 추가해주세요.');
    }
    let result = {
        testName: $('#firstTitleInput').val(),
        testDate: $('#firstDateInput').val(),
        testRoute: $('#firstRouteUpload').val(),
        testType: $('#firstTypeSelectLabel').text(),
        data: {},
    };

    for (
        let i = 0;
        i < document.getElementsByClassName('firstAddTableRow').length;
        i++
    ) {
        for (
            let j = 0;
            j <
            document.getElementsByClassName('firstAddTableRow')[i].children
                .length;
            j++
        ) {
            switch (j) {
                case 1:
                    result['data'][i] = {
                        site: document.getElementsByClassName('firstAddTableRow',)[i].children[1].children[0].value,
                    };
                    break;
                case 2:
                    result['data'][i]['frequency'] = document.getElementsByClassName('firstAddTableRow')[i].children[2].children[0].value;
                    break;
                case 3:
                    result['data'][i]['txmain'] = document.getElementsByClassName('firstAddTableRow')[i].children[3].children[0].value;
                    break;
                case 4:
                    result['data'][i]['rxmain'] = document.getElementsByClassName('firstAddTableRow')[i].children[4].children[0].value;
                    break;
                case 5:
                    result['data'][i]['txstby'] = document.getElementsByClassName('firstAddTableRow')[i].children[5].children[0].value;
                    break;
                case 6:
                    result['data'][i]['rxstby'] = document.getElementsByClassName('firstAddTableRow')[i].children[6].children[0].value;
                    break;
                case 7:
                    result['data'][i]['distance'] = document.getElementsByClassName('firstAddTableRow')[i].children[7].children[0].value;
                    break;
                case 8:
                    result['data'][i]['angle'] = document.getElementsByClassName('firstAddTableRow')[i].children[8].children[0].value;
                    break;
                case 9:
                    result['data'][i]['height'] = document.getElementsByClassName('firstAddTableRow')[i].children[8].children[0].value;
                    break;
            }
        }
    }

    console.log(result);
    // for (i in $('.firstTableNumber').length){
    //     result.data.add({
    //         `${$('.firstTableNumber').index(i)}` : {'h'}
    //     })
    // }
    fetch(`http://${server_add}:3000/flight/list/add`, {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            result,
        }),
    }).then((res) => {
        if (res.status != 200) {
            throw new Error('통신에러');
        }
        res.json()
            .then(_res => {
                if (_res.errno) {
                    alert('에러가 발생했습니다.\n관리자에게 문의하십시오.')
                } else {
                    alert('정상적으로 비행검사결과가 추가되었습니다.');
                    closeFirstAddComponent(true);
                    getTestList();
                }
            })
    }).catch(err => {
        console.log(err);
        alert('에러가 발생했습니다.\n관리자에게 문의하십시오.')
    });

};

checkInputForRadio = (e) => {
    if (e.currentTarget.value.length > 2) {
        e.returnValue = false;
    }
    if ((!isNaN(e.key) && e.key <= 5 && e.key >= 0)) {
        console.log(e.key);
        e.returnValue = true;
        if(e.currentTarget.value.length == 1){
            e.currentTarget.value += "/";
        }
    } else {
        e.returnValue = false;
    }

    if (e.key == ' ') {
        e.returnValue = false;
    }
}

