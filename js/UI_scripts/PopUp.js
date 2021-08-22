let popedPage = '0';

class UIStatus {
    fifthSector = false;
    fifthRoute = false;
    mapMode = '0';
    searchTime = '0';
}

class EditVault {
    sitename = '';
    fixname = '';
}

const refresh = () => {
    window.location.reload()
};

const uiStatus = new UIStatus();
const editvault = new EditVault();

let _fifthEditFreq, _fifthEditStie, _fifthEditSector;
vaultFreqEditValue = (freq, site, sector) => {
    [_fifthEditFreq, _fifthEditStie, _fifthEditSector] = [freq, site, sector]
};

closeButtonStyle = () => {
    const BannerList = $('.BannerClose');
    for (let i = 0; i < BannerList.length; i++) {
        BannerList[i].innerHTML = `<embed src="css/images/close.svg" type="image/svg+xml"></embed>`
    }

};

displayPopup = (id) => {
    if (id == popedPage) {
        resetPopup(popedPage);
        return;
    }

    if (id == 'fifthPopup' && !loginItem.getLoginStatus()) {
        window.alert("권한이 없습니다. \n관리자라면 로그인을 해주세요.");
        openLoginModal();
        return;
    }
    if (uiStatus.fifthSector) {
        closeFifthSectorData();
    }
    if (uiStatus.fifthRoute) {
        closeFifthRouteData();
    }
    resetActivatedPopup(id);
    popedPage = id;
    console.log('Popping up     ', popedPage);
    document.getElementById(id).style.bottom = '0';

    if (popedPage == 'secondPopup' && uiStatus.searchTime == 0) {
        SecondOnSearchClick(true);
        uiStatus.searchTime++;
    }
};

resetPopup = (id) => {
    console.log('closing popup  ', id);
    popedPage = 0;
    document.getElementById(id).style.bottom = '-100%';
};

resetActivatedPopup = () => {
    if (popedPage != 0) {
        console.log('closing all     popup');
        document.getElementById(popedPage).style.bottom = '-100%';
        popedPage = 0;
    }
};

openLoginModal = () => {
    console.log('opening login modal');
    document.getElementById('loginModal').style.visibility = 'visible';
    document.getElementById('loginOverlay').style.visibility = 'visible';
    document.getElementById('loginModal').style.opacity = '1';
    document.getElementById('loginOverlay').style.opacity = '0.8';
    setTimeout(() => {
        document.getElementById('fifthLoginID').focus();
    }, 500)
};

closeLoginModal = () => {
    console.log('closing login modal');
    document.getElementById('loginModal').style.opacity = '0';
    document.getElementById('loginOverlay').style.opacity = '0';
    document.getElementById('loginModal').style.visibility = 'hidden';
    document.getElementById('loginOverlay').style.visibility = 'hidden';
};

openNotice = () => {
    if (window.name == 'popup') {
        return
    }
    getNoticeData();
    console.log('opening notice modal');
    document.getElementById('noticeModal').style.visibility = 'visible';
    document.getElementById('noticeOverlay').style.visibility = 'visible';
    document.getElementById('noticeModal').style.opacity = '1';
    document.getElementById('noticeOverlay').style.opacity = '0.8';
};

closeNotice = () => {
    console.log('closing notice modal');
    document.getElementById('noticeModal').style.opacity = '0';
    document.getElementById('noticeOverlay').style.opacity = '0';
    document.getElementById('noticeModal').style.visibility = 'hidden';
    document.getElementById('noticeOverlay').style.visibility = 'hidden';
};

openFirstAddComponent = () => {
    if (!loginItem.getLoginStatus()) {
        openLoginModal();
        window.alert("권한이 없습니다. \n관리자라면 로그인을 해주세요.");
        return;
    }
    document.getElementById('firstTitleInput').disabled = false;
    document.getElementById('firstDateInput').disabled = false;
    document.getElementById('firstRouteUpload').disabled = false;
    document.getElementById('firstAddDataComponent').style.visibility =
        'visible';
    document.getElementById('firstAddComponentOverlay').style.visibility =
        'visible';
    document.getElementById('firstAddDataComponent').style.opacity = '1';
    document.getElementById('firstAddComponentOverlay').style.opacity = '1';
    // document.getElementById("firstTitleInput").focus();
    document.getElementById('firstAddTableBody').innerHTML = '';
    document.getElementById('firstTitleInput').value = '';
    document.getElementById('firstDateInput').value = '';
    document.getElementById('firstRouteUpload').value = '';
    document.getElementById('firstAddButton').innerText = '확인';
    document.getElementById('firstAddButton').onfocus = () => {
        firstAddRowConfirmOnFocus();
    };
    document.getElementById('firstAddButton').visibility = 'visible';
};

closeFirstAddComponent = (bool) => {
    if (bool) {
        document.getElementById('firstAddDataComponent').style.opacity = '0';
        document.getElementById('firstAddComponentOverlay').style.opacity = '0';
        document.getElementById('firstAddDataComponent').style.visibility = 'hidden';
        document.getElementById('firstAddComponentOverlay').style.visibility = 'hidden';
    } else if (window.confirm('작성을 중단하고 나가시겠습니까?') == true) {
        document.getElementById('firstAddDataComponent').style.opacity = '0';
        document.getElementById('firstAddComponentOverlay').style.opacity = '0';
        document.getElementById('firstAddDataComponent').style.visibility = 'hidden';
        document.getElementById('firstAddComponentOverlay').style.visibility = 'hidden';
    }
};

openFirstReqData = () => {

    document.getElementById('firstReqData').style.visibility = 'visible';
    document.getElementById('firstReqDataOverlay').style.visibility = 'visible';
    document.getElementById('firstReqData').style.opacity = '1';
    document.getElementById('firstReqDataOverlay').style.opacity = '0.8';
};

closeFirstReqData = () => {
    // if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
    onFirstReqSectionClose();
    document.getElementById('firstReqData').style.opacity = '0';
    document.getElementById('firstReqDataOverlay').style.opacity = '0';
    document.getElementById('firstReqData').style.visibility = 'hidden';
    document.getElementById('firstReqDataOverlay').style.visibility = 'hidden';
};

openMinwon = () => {

    document.getElementById('Minwon').style.visibility = 'visible';
    document.getElementById('MinwonOverlay').style.visibility = 'visible';
    document.getElementById('Minwon').style.opacity = '1';
    document.getElementById('MinwonOverlay').style.opacity = '0.8';
};

closeMinwon = () => {
    // if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
    onFirstReqSectionClose();
    document.getElementById('Minwon').style.opacity = '0';
    document.getElementById('MinwonOverlay').style.opacity = '0';
    document.getElementById('Minwon').style.visibility = 'hidden';
    document.getElementById('MinwonOverlay').style.visibility = 'hidden';
};
openMinwonAddData = () => {
    document.getElementById('MinwonDataAdd').style.visibility = 'visible';
    document.getElementById('MinwonAddOverlay').style.visibility = 'visible';
    document.getElementById('MinwonDataAdd').style.opacity = '1';
    document.getElementById('MinwonAddOverlay').style.opacity = '0.8';
};

closeMinwonAddData = (bool) => {
    if (bool) {
        document.getElementById('MinwonDataAdd').style.opacity = '0';
        document.getElementById('MinwonAddOverlay').style.opacity = '0';
        document.getElementById('MinwonDataAdd').style.visibility = 'hidden';
        document.getElementById('MinwonAddOverlay').style.visibility = 'hidden';
    } else if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
        document.getElementById('MinwonDataAdd').style.opacity = '0';
        document.getElementById('MinwonAddOverlay').style.opacity = '0';
        document.getElementById('MinwonDataAdd').style.visibility = 'hidden';
        document.getElementById('MinwonAddOverlay').style.visibility = 'hidden';
    }
};

let MinwonTemp;
openMinwonEditData = (before) => {
    MinwonTemp = before;
    const inputs = document.getElementsByClassName('MinwonDataEditInput');
    document.getElementById('MinwonDataEdit').style.visibility = 'visible';
    document.getElementById('MinwonEditOverlay').style.visibility = 'visible';
    document.getElementById('MinwonDataEdit').style.opacity = '1';
    document.getElementById('MinwonEditOverlay').style.opacity = '0.8';

    for (let i = 1; i <= inputs.length; i++) {
        switch (i) {
            case 1:
                inputs[0].value = before.site;
                break;
            case 2:
                inputs[1].value = before.freq;
                break;
            case 3:
                inputs[2].value = before.status;
                break;
            case 4:
                inputs[3].value = before.angle;
                break;
            case 5:
                inputs[4].value = before.distance;
                break;
            case 6:
                inputs[5].value = before.height;
                break;
        }
    }
};

closeMinwonEditData = (bool) => {
    const clearData = () => {
        const inputs = document.getElementsByClassName('MinwonDataEditInput');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = ''
        }
        firstReqTemp = null;
    };
    if (bool) {
        document.getElementById('MinwonDataEdit').style.opacity = '0';
        document.getElementById('MinwonEditOverlay').style.opacity = '0';
        document.getElementById('MinwonDataEdit').style.visibility = 'hidden';
        document.getElementById('MinwonEditOverlay').style.visibility = 'hidden';
        clearData();
    } else if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
        document.getElementById('MinwonDataEdit').style.opacity = '0';
        document.getElementById('MinwonEditOverlay').style.opacity = '0';
        document.getElementById('MinwonDataEdit').style.visibility = 'hidden';
        document.getElementById('MinwonEditOverlay').style.visibility = 'hidden';
        clearData()
    }
};

let firstReqTemp;
openFirstReqEditData = (before) => {
    firstReqTemp = before;
    const inputs = document.getElementsByClassName('firstReqDataEditInput');
    document.getElementById('firstReqDataEdit').style.visibility = 'visible';
    document.getElementById('firstReqDataEditOverlay').style.visibility = 'visible';
    document.getElementById('firstReqDataEdit').style.opacity = '1';
    document.getElementById('firstReqDataEditOverlay').style.opacity = '0.8';

    for (let i = 1; i <= inputs.length; i++) {
        switch (i) {
            case 1:
                inputs[0].value = before.site;
                break;
            case 2:
                inputs[1].value = before.freq;
                break;
            case 3:
                inputs[2].value = before.txm;
                break;
            case 4:
                inputs[3].value = before.rxm;
                break;
            case 5:
                inputs[4].value = before.txs;
                break;
            case 6:
                inputs[5].value = before.rxs;
                break;
            case 7:
                inputs[6].value = before.angle;
                break;
            case 8:
                inputs[7].value = before.distance;
                break;
            case 9:
                inputs[8].value = before.height;
                break;
        }
    }
};

closeFirstReqEditData = (bool) => {
    const clearData = () => {
        const inputs = document.getElementsByClassName('firstReqDataEditInput');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = ''
        }
        firstReqTemp = null;
    };
    if (bool) {
        document.getElementById('firstReqDataEdit').style.opacity = '0';
        document.getElementById('firstReqDataEditOverlay').style.opacity = '0';
        document.getElementById('firstReqDataEdit').style.visibility = 'hidden';
        document.getElementById('firstReqDataEditOverlay').style.visibility = 'hidden';
        clearData();
    } else if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
        document.getElementById('firstReqDataEdit').style.opacity = '0';
        document.getElementById('firstReqDataEditOverlay').style.opacity = '0';
        document.getElementById('firstReqDataEdit').style.visibility = 'hidden';
        document.getElementById('firstReqDataEditOverlay').style.visibility = 'hidden';
        clearData()
    }
};


openFirstComplaintData = () => {
    document.getElementById('firstReqData').style.visibility = 'visible';
    document.getElementById('firstReqDataOverlay').style.visibility = 'visible';
    document.getElementById('firstReqData').style.opacity = '1';
    document.getElementById('firstReqDataOverlay').style.opacity = '0.8';
};

closeFirstComplaintData = () => {
    // if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {

    document.getElementById('firstReqData').style.opacity = '0';
    document.getElementById('firstReqDataOverlay').style.opacity = '0';
    document.getElementById('firstReqData').style.visibility = 'hidden';
    document.getElementById('firstReqDataOverlay').style.visibility = 'hidden';

    // }
};

openFifthFreqData = () => {
    document.getElementById('fifthFreq').style.visibility = 'visible';
    document.getElementById('fifthFreqOverlay').style.visibility = 'visible';
    document.getElementById('fifthFreq').style.opacity = '1';
    document.getElementById('fifthFreqOverlay').style.opacity = '0.8';
};

closeFifthFreqData = () => {
    // if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {

    document.getElementById('fifthFreq').style.opacity = '0';
    document.getElementById('fifthFreqOverlay').style.opacity = '0';
    document.getElementById('fifthFreq').style.visibility = 'hidden';
    document.getElementById('fifthFreqOverlay').style.visibility = 'hidden';

    // }
};

openFifthFreqAdd = () => {
    document.getElementById('fifthFreqAdd').style.visibility = 'visible';
    document.getElementById('fifthFreqAddOverlay').style.visibility = 'visible';
    document.getElementById('fifthFreqAdd').style.opacity = '1';
    document.getElementById('fifthFreqAddOverlay').style.opacity = '0.8';
};

closeFifthFreqAdd = (bool) => {
    if (bool) {
        document.getElementById('fifthFreqAdd').style.opacity = '0';
        document.getElementById('fifthFreqAddOverlay').style.opacity = '0';
        document.getElementById('fifthFreqAdd').style.visibility = 'hidden';
        document.getElementById('fifthFreqAddOverlay').style.visibility = 'hidden';
    } else if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
        document.getElementById('fifthFreqAdd').style.opacity = '0';
        document.getElementById('fifthFreqAddOverlay').style.opacity = '0';
        document.getElementById('fifthFreqAdd').style.visibility = 'hidden';
        document.getElementById('fifthFreqAddOverlay').style.visibility = 'hidden';
    }
};

openFifthFreqEdit = (elem) => {
    const [freq, site, sector] = [elem.parentElement.parentElement.children[0].innerText,
        elem.parentElement.parentElement.children[1].innerText,
        elem.parentElement.parentElement.children[2].innerText];

    vaultFreqEditValue(freq, site, sector);

    document.getElementById('fifthFreqEditSiteInput').value = site;
    document.getElementById('fifthFreqEditFreqInput').value = freq;
    document.getElementById('fifthFreqEditSectorInput').value = sector;

    document.getElementById('fifthFreqEdit').style.visibility = 'visible';
    document.getElementById('fifthFreqEditOverlay').style.visibility = 'visible';
    document.getElementById('fifthFreqEdit').style.opacity = '1';
    document.getElementById('fifthFreqEditOverlay').style.opacity = '0.8';
};
closeFifthFreqEdit = (bool) => {
    if (bool) {
        document.getElementById('fifthFreqEdit').style.opacity = '0';
        document.getElementById('fifthFreqEditOverlay').style.opacity = '0';
        document.getElementById('fifthFreqEdit').style.visibility = 'hidden';
        document.getElementById('fifthFreqEditOverlay').style.visibility = 'hidden';

    } else if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
        document.getElementById('fifthFreqEdit').style.opacity = '0';
        document.getElementById('fifthFreqEditOverlay').style.opacity = '0';
        document.getElementById('fifthFreqEdit').style.visibility = 'hidden';
        document.getElementById('fifthFreqEditOverlay').style.visibility = 'hidden';

    }
};


openFifthSiteData = () => {
    document.getElementById('fifthSite').style.visibility = 'visible';
    document.getElementById('fifthSiteOverlay').style.visibility = 'visible';
    document.getElementById('fifthSite').style.opacity = '1';
    document.getElementById('fifthSiteOverlay').style.opacity = '0.8';
};

closeFifthSiteData = () => {
    // if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {

    document.getElementById('fifthSite').style.opacity = '0';
    document.getElementById('fifthSiteOverlay').style.opacity = '0';
    document.getElementById('fifthSite').style.visibility = 'hidden';
    document.getElementById('fifthSiteOverlay').style.visibility = 'hidden';

    // }
};

openFifthSiteAdd = () => {
    document.getElementById('fifthSiteAdd').style.visibility = 'visible';
    document.getElementById('fifthSiteAddOverlay').style.visibility = 'visible';
    document.getElementById('fifthSiteAdd').style.opacity = '1';
    document.getElementById('fifthSiteAddOverlay').style.opacity = '0.8';
};

closeFifthSiteAdd = (bool) => {
    if (bool) {
        document.getElementById('fifthSiteAdd').style.opacity = '0';
        document.getElementById('fifthSiteAddOverlay').style.opacity = '0';
        document.getElementById('fifthSiteAdd').style.visibility = 'hidden';
        document.getElementById('fifthSiteAddOverlay').style.visibility = 'hidden';
    } else if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
        document.getElementById('fifthSiteAdd').style.opacity = '0';
        document.getElementById('fifthSiteAddOverlay').style.opacity = '0';
        document.getElementById('fifthSiteAdd').style.visibility = 'hidden';
        document.getElementById('fifthSiteAddOverlay').style.visibility = 'hidden';
    }
};

openFifthSiteEdit = (elem) => {
    editvault.sitename = elem.parentElement.parentElement.children[0].innerText;

    document.getElementById('fifthSiteEditSiteInput').value = elem.parentElement.parentElement.children[0].innerText;
    document.getElementById('fifthSiteEditLatInput').value = elem.parentElement.parentElement.children[1].innerText;
    document.getElementById('fifthSiteEditLngInput').value = elem.parentElement.parentElement.children[2].innerText;
    if (elem.parentElement.parentElement.children[3].innerText == '일반') {
        document.getElementById('fifthSiteEditIsSite').checked = true;
    } else if (elem.parentElement.parentElement.children[3].innerText == '저고도') {
        document.getElementById('fifthSiteEditIsLowSite').checked = true;
    } else if (elem.parentElement.parentElement.children[3].innerText == 'VORTAC') {
        document.getElementById('fifthSiteEditIsVortac').checked = true;
    }


    document.getElementById('fifthSiteEdit').style.visibility = 'visible';
    document.getElementById('fifthSiteEditOverlay').style.visibility = 'visible';
    document.getElementById('fifthSiteEdit').style.opacity = '1';
    document.getElementById('fifthSiteEditOverlay').style.opacity = '0.8';
};
closeFifthSiteEdit = (bool) => {
    if (bool) {
        document.getElementById('fifthSiteEdit').style.opacity = '0';
        document.getElementById('fifthSiteEditOverlay').style.opacity = '0';
        document.getElementById('fifthSiteEdit').style.visibility = 'hidden';
        document.getElementById('fifthSiteEditOverlay').style.visibility = 'hidden';
    } else if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
        document.getElementById('fifthSiteEdit').style.opacity = '0';
        document.getElementById('fifthSiteEditOverlay').style.opacity = '0';
        document.getElementById('fifthSiteEdit').style.visibility = 'hidden';
        document.getElementById('fifthSiteEditOverlay').style.visibility = 'hidden';
    }
};

openFifthSectorData = () => {
    if (!uiStatus.fifthSector) {
        resetActivatedPopup();
        document.getElementById('fifthSector').style.visibility = 'visible';
        document.getElementById('fifthSector').style.bottom = '0';
        // document.getElementById('fifthSectorOverlay').style.visibility = 'visible';
        document.getElementById('fifthSector').style.opacity = '1';
        // document.getElementById('fifthSectorOverlay').style.opacity = '0.8';
        uiStatus.fifthSector = true;
    }
};

closeFifthSectorData = () => {
    if (uiStatus.fifthSector) {
        // if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
        uiStatus.fifthSector = false;
        document.getElementById('fifthSector').style.opacity = '0';
        document.getElementById('fifthSectorOverlay').style.opacity = '0';
        document.getElementById('fifthSector').style.bottom = '-100%';
        document.getElementById('fifthSector').style.visibility = 'hidden';
        document.getElementById('fifthSectorOverlay').style.visibility = 'hidden';
        displayPopup('fifthPopup');
    }
};

openFifthSectorAdd = () => {
    document.getElementById('fifthSectorAdd').style.visibility = 'visible';
    document.getElementById('fifthSectorAddOverlay').style.visibility = 'visible';
    document.getElementById('fifthSectorAdd').style.opacity = '1';
    document.getElementById('fifthSectorAddOverlay').style.opacity = '0.8';
};

closeFifthSectorAdd = (bool) => {
    if (bool) {
        document.getElementById('fifthSectorAdd').style.opacity = '0';
        document.getElementById('fifthSectorAddOverlay').style.opacity = '0';
        document.getElementById('fifthSectorAdd').style.visibility = 'hidden';
        document.getElementById('fifthSectorAddOverlay').style.visibility = 'hidden';
    } else if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
        document.getElementById('fifthSectorAdd').style.opacity = '0';
        document.getElementById('fifthSectorAddOverlay').style.opacity = '0';
        document.getElementById('fifthSectorAdd').style.visibility = 'hidden';
        document.getElementById('fifthSectorAddOverlay').style.visibility = 'hidden';
    }
};

openFifthSectorEdit = () => {
    if (document.getElementById('fifthSectorSelectLabel').innerText != '선택') {
        fifthSectorEditOpenFetch();
        document.getElementById('fifthSectorEdit').style.visibility = 'visible';
        document.getElementById('fifthSectorEditOverlay').style.visibility = 'visible';
        document.getElementById('fifthSectorEdit').style.opacity = '1';
        document.getElementById('fifthSectorEditOverlay').style.opacity = '0.8';
        document.getElementById('fifthSectorEditSectorName').value = document.getElementById('fifthSectorSelectLabel').innerText;
        isSectorNameDuplicate = false;
    } else {
        alert("수정할 섹터를 선택해주세요.")
    }
};

closeFifthSectorEdit = (bool) => {
    if (bool) {
        document.getElementById('fifthSectorEdit').style.opacity = '0';
        document.getElementById('fifthSectorEditOverlay').style.opacity = '0';
        document.getElementById('fifthSectorEdit').style.visibility = 'hidden';
        document.getElementById('fifthSectorEditOverlay').style.visibility = 'hidden';
    } else if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
        document.getElementById('fifthSectorEdit').style.opacity = '0';
        document.getElementById('fifthSectorEditOverlay').style.opacity = '0';
        document.getElementById('fifthSectorEdit').style.visibility = 'hidden';
        document.getElementById('fifthSectorEditOverlay').style.visibility = 'hidden';
    }
};

openFifthFixData = () => {
    document.getElementById('fifthFix').style.visibility = 'visible';
    document.getElementById('fifthFixOverlay').style.visibility = 'visible';
    document.getElementById('fifthFix').style.opacity = '1';
    document.getElementById('fifthFixOverlay').style.opacity = '0.8';
};

closeFifthFixData = () => {
    // if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {

    document.getElementById('fifthFix').style.opacity = '0';
    document.getElementById('fifthFixOverlay').style.opacity = '0';
    document.getElementById('fifthFix').style.visibility = 'hidden';
    document.getElementById('fifthFixOverlay').style.visibility = 'hidden';

    // }
};

openFifthFixAdd = () => {
    document.getElementById('fifthFixAdd').style.visibility = 'visible';
    document.getElementById('fifthFixAddOverlay').style.visibility = 'visible';
    document.getElementById('fifthFixAdd').style.opacity = '1';
    document.getElementById('fifthFixAddOverlay').style.opacity = '0.8';
};

closeFifthFixAdd = (bool) => {
    if (bool) {
        document.getElementById('fifthFixAdd').style.opacity = '0';
        document.getElementById('fifthFixAddOverlay').style.opacity = '0';
        document.getElementById('fifthFixAdd').style.visibility = 'hidden';
        document.getElementById('fifthFixAddOverlay').style.visibility = 'hidden';
    } else if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
        document.getElementById('fifthFixAdd').style.opacity = '0';
        document.getElementById('fifthFixAddOverlay').style.opacity = '0';
        document.getElementById('fifthFixAdd').style.visibility = 'hidden';
        document.getElementById('fifthFixAddOverlay').style.visibility = 'hidden';
    }
};

openFifthFixEdit = (elem) => {
    editvault.fixname = elem.parentElement.parentElement.children[0].innerText;
    document.getElementById('fifthFixEditNameInput').value = elem.parentElement.parentElement.children[0].innerText;
    document.getElementById('fifthFixEditLatInput').value = elem.parentElement.parentElement.children[1].innerText;
    document.getElementById('fifthFixEditLngInput').value = elem.parentElement.parentElement.children[2].innerText;

    document.getElementById('fifthFixEdit').style.visibility = 'visible';
    document.getElementById('fifthFixEditOverlay').style.visibility = 'visible';
    document.getElementById('fifthFixEdit').style.opacity = '1';
    document.getElementById('fifthFixEditOverlay').style.opacity = '0.8';
};

closeFifthFixEdit = (bool) => {
    if (bool) {
        document.getElementById('fifthFixEdit').style.opacity = '0';
        document.getElementById('fifthFixEditOverlay').style.opacity = '0';
        document.getElementById('fifthFixEdit').style.visibility = 'hidden';
        document.getElementById('fifthFixEditOverlay').style.visibility = 'hidden';
    } else if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
        document.getElementById('fifthFixEdit').style.opacity = '0';
        document.getElementById('fifthFixEditOverlay').style.opacity = '0';
        document.getElementById('fifthFixEdit').style.visibility = 'hidden';
        document.getElementById('fifthFixEditOverlay').style.visibility = 'hidden';
    }
};

openFifthNotice = () => {
    document.getElementById('fifthNotice').style.visibility = 'visible';
    document.getElementById('fifthNoticeOverlay').style.visibility = 'visible';
    document.getElementById('fifthNotice').style.opacity = '1';
    document.getElementById('fifthNoticeOverlay').style.opacity = '0.8';
};

closeFifthNotice = () => {
    // if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {

    document.getElementById('fifthNotice').style.opacity = '0';
    document.getElementById('fifthNoticeOverlay').style.opacity = '0';
    document.getElementById('fifthNotice').style.visibility = 'hidden';
    document.getElementById('fifthNoticeOverlay').style.visibility = 'hidden';

    // }
};


openMapMode = (elem) => {
    document.getElementById('mapMode').style.opacity = '1';
    document.getElementById('mapMode').style.visibility = 'visible';
    uiStatus.mapMode = elem;
};

closeMapMode = () => {
    switch (uiStatus.mapMode) {
        case 1:
            document.getElementById('mapMode').style.opacity = '0';
            document.getElementById('mapMode').style.visibility = 'hidden';
            openFirstReqData();
            displayPopup('firstPopup');
            break;
        case 2:
            document.getElementById('mapMode').style.opacity = '0';
            document.getElementById('mapMode').style.visibility = 'hidden';
            displayPopup('secondPopup');
            break;
        case 3:
            document.getElementById('mapMode').style.opacity = '0';
            document.getElementById('mapMode').style.visibility = 'hidden';
            openMinwon();
            displayPopup('firstPopup');
            break;
        default:
            console.log(uiStatus.mapMode);
    }
};
if(window.name != 'popup') {
    document.getElementById('mapMode').addEventListener('click', () => {
        // console.log(mapMarker);
        deleteMapMarker();
        closeMapMode();
    });
}
openFifthNoticeAdd = () => {
    document.getElementById('fifthNoticeAdd').style.visibility = 'visible';
    document.getElementById('fifthNoticeAddOverlay').style.visibility = 'visible';
    document.getElementById('fifthNoticeAdd').style.opacity = '1';
    document.getElementById('fifthNoticeAddOverlay').style.opacity = '0.8';
};

closeFifthNoticeAdd = (bool) => {
    if (bool) {
        document.getElementById('fifthNoticeAdd').style.opacity = '0';
        document.getElementById('fifthNoticeAddOverlay').style.opacity = '0';
        document.getElementById('fifthNoticeAdd').style.visibility = 'hidden';
        document.getElementById('fifthNoticeAddOverlay').style.visibility = 'hidden';
    } else if (window.confirm("작성을 중단하고 나가시겠습니까?")) {
        document.getElementById('fifthNoticeAdd').style.opacity = '0';
        document.getElementById('fifthNoticeAddOverlay').style.opacity = '0';
        document.getElementById('fifthNoticeAdd').style.visibility = 'hidden';
        document.getElementById('fifthNoticeAddOverlay').style.visibility = 'hidden';

    }
};

openFifthRouteData = () => {
    if (!uiStatus.fifthRoute) {
        resetActivatedPopup();
        document.getElementById('fifthRoute').style.visibility = 'visible';
        document.getElementById('fifthRoute').style.bottom = '0';
        // document.getElementById('fifthSectorOverlay').style.visibility = 'visible';
        document.getElementById('fifthRoute').style.opacity = '1';
        // document.getElementById('fifthSectorOverlay').style.opacity = '0.8';
        uiStatus.fifthRoute = true;
    }
};

closeFifthRouteData = () => {
    if (uiStatus.fifthRoute) {
        // if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
        uiStatus.fifthRoute = false;
        document.getElementById('fifthRoute').style.opacity = '0';
        document.getElementById('fifthRouteOverlay').style.opacity = '0';
        document.getElementById('fifthRoute').style.bottom = '-100%';
        document.getElementById('fifthRoute').style.visibility = 'hidden';
        document.getElementById('fifthRouteOverlay').style.visibility = 'hidden';
        displayPopup('fifthPopup');
    }
};

openFifthRouteAdd = () => {
    document.getElementById('fifthRouteAdd').style.visibility = 'visible';
    document.getElementById('fifthRouteAddOverlay').style.visibility = 'visible';
    document.getElementById('fifthRouteAdd').style.opacity = '1';
    document.getElementById('fifthRouteAddOverlay').style.opacity = '0.8';
};

closeFifthRouteAdd = (bool) => {
    if (bool) {
        document.getElementById('fifthRouteAdd').style.opacity = '0';
        document.getElementById('fifthRouteAddOverlay').style.opacity = '0';
        document.getElementById('fifthRouteAdd').style.visibility = 'hidden';
        document.getElementById('fifthRouteAddOverlay').style.visibility = 'hidden';
    } else if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
        document.getElementById('fifthRouteAdd').style.opacity = '0';
        document.getElementById('fifthRouteAddOverlay').style.opacity = '0';
        document.getElementById('fifthRouteAdd').style.visibility = 'hidden';
        document.getElementById('fifthRouteAddOverlay').style.visibility = 'hidden';
    }
};

openFifthRouteEdit = () => {
    if (document.getElementById('fifthRouteSelectLabel').innerText != '선택') {
        fifthRouteEditOpenFetch();
        document.getElementById('fifthRouteEdit').style.visibility = 'visible';
        document.getElementById('fifthRouteEditOverlay').style.visibility = 'visible';
        document.getElementById('fifthRouteEdit').style.opacity = '1';
        document.getElementById('fifthRouteEditOverlay').style.opacity = '0.8';
        document.getElementById('fifthRouteEditName').value = document.getElementById('fifthRouteSelectLabel').innerText;
        isSectorNameDuplicate = false;
    } else {
        alert("수정할 섹터를 선택해주세요.")
    }
};

closeFifthRouteEdit = (bool) => {
    if (bool) {
        document.getElementById('fifthRouteEdit').style.opacity = '0';
        document.getElementById('fifthRouteEditOverlay').style.opacity = '0';
        document.getElementById('fifthRouteEdit').style.visibility = 'hidden';
        document.getElementById('fifthRouteEditOverlay').style.visibility = 'hidden';
    } else if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
        document.getElementById('fifthRouteEdit').style.opacity = '0';
        document.getElementById('fifthRouteEditOverlay').style.opacity = '0';
        document.getElementById('fifthRouteEdit').style.visibility = 'hidden';
        document.getElementById('fifthRouteEditOverlay').style.visibility = 'hidden';
    }
};

SecondClickNextPage = () => {
    const data = document.getElementsByClassName('secondPaginationBlock');

    for (let i = 0; i < data.length; i++) {
        if (maxPage >= parseInt(data[i].innerText) + 10) {
            data[i].innerText = parseInt(data[i].innerText) + 10;
            data[i].style.display = 'block';
            data[i].className = 'secondPaginationBlock'
        } else {
            if (i == 0) {
                break;
            }
            data[i].innerText = parseInt(data[i].innerText) + 10;
            data[i].style.display = 'none'
        }
    }
};

SecondClickPrevPage = () => {
    const data = document.getElementsByClassName('secondPaginationBlock');

    for (let i = 0; i < data.length; i++) {
        console.log(data[i].innerText);
        if (0 >= parseInt(data[i].innerText) - 10) {
        } else {
            data[i].style.display = 'block';
            data[i].className = 'secondPaginationBlock';
            data[i].innerText = parseInt(data[i].innerText) - 10;

        }
    }
};

SecondClickPageButton = (e) => {
    const data = document.getElementsByClassName('secondPaginationBlock');

    for (let i = 0; i < data.length; i++) {
        if (data[i].className != 'secondPaginationBlock') {
            data[i].className = 'secondPaginationBlock'
        }
    }
    e.currentTarget.className = 'secondPaginationBlock secondActivatedPageBlock';

    SecondOnSearchClick();
};
