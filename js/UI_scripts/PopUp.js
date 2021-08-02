let popedPage = '0';

class UIStatus {
    fifthSector = false;
    mapMode = '0';
    searchTime = '0';
}

class EditVault {
    sitename = '';
    fixname = '';
}

const refresh =() => { window.location.reload()};

const uiStatus = new UIStatus();
const editvault = new EditVault();

let _fifthEditFreq, _fifthEditStie, _fifthEditSector;
vaultFreqEditValue = (freq, site, sector) => {
    [_fifthEditFreq, _fifthEditStie, _fifthEditSector] = [freq, site, sector]
};

displayPopup = (id) => {
    if (id == popedPage) {
        resetPopup(popedPage);
        return;
    }


    closeFifthSectorData();

    resetActivatedPopup(id);
    popedPage = id;
    console.log('Popping up     ', popedPage);
    document.getElementById(id).style.bottom = '0';

    if(popedPage == 'secondPopup' && uiStatus.searchTime == 0){
        SecondOnSearchClick();
        uiStatus.searchTime++;
    }
};

resetPopup = (id) => {
    console.log('closing popup  ', id);
    popedPage = 0;
    document.getElementById(id).style.bottom = '-100%';
};

resetActivatedPopup = (id) => {
    if (popedPage != 0) {
        console.log('closing all     popup');
        document.getElementById(popedPage).style.bottom = '-100%';
        popedPage = 0;
    }
};

openModal = () => {
    getNoticeData();
    console.log('opening notice modal');
    document.getElementById('noticeModal').style.visibility = 'visible';
    document.getElementById('noticeOverlay').style.visibility = 'visible';
    document.getElementById('noticeModal').style.opacity = '1';
    document.getElementById('noticeOverlay').style.opacity = '0.8';
};

closeModal = () => {
    console.log('closing notice modal');
    document.getElementById('noticeModal').style.opacity = '0';
    document.getElementById('noticeOverlay').style.opacity = '0';
    document.getElementById('noticeModal').style.visibility = 'hidden';
    document.getElementById('noticeOverlay').style.visibility = 'hidden';
};

openFirstAddComponent = () => {
    if(!loginItem.getLoginStatus()){
        alert("로그인이 필요합니다.");
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

closeFirstAddComponent = () => {
    if (window.confirm('작성을 중단하고 나가시겠습니까?') == true) {
        document.getElementById('firstAddDataComponent').style.opacity = '0';
        document.getElementById('firstAddComponentOverlay').style.opacity = '0';
        document.getElementById('firstAddDataComponent').style.visibility =
            'hidden';
        document.getElementById('firstAddComponentOverlay').style.visibility =
            'hidden';
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

    document.getElementById('firstReqData').style.opacity = '0';
    document.getElementById('firstReqDataOverlay').style.opacity = '0';
    document.getElementById('firstReqData').style.visibility = 'hidden';
    document.getElementById('firstReqDataOverlay').style.visibility = 'hidden';

    // }
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
closeFifthFreqEdit = () => {
    if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {

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
closeFifthSiteEdit = () => {
    if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {

        document.getElementById('fifthSiteEdit').style.opacity = '0';
        document.getElementById('fifthSiteEditOverlay').style.opacity = '0';
        document.getElementById('fifthSiteEdit').style.visibility = 'hidden';
        document.getElementById('fifthSiteEditOverlay').style.visibility = 'hidden';

    }
};

openFifthSectorData = () => {
    if(!uiStatus.fifthSector) {
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
    if(uiStatus.fifthSector){
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
    if(document.getElementById('fifthSectorSelectLabel').innerText != '선택') {
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
    switch (uiStatus.mapMode){
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
        default:
            console.log(uiStatus.mapMode);
    }
};

document.getElementById('mapMode').addEventListener('click',() => {
    closeMapMode();
});

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
    if(!uiStatus.fifthSector) {
        resetActivatedPopup();
        document.getElementById('fifthRoute').style.visibility = 'visible';
        document.getElementById('fifthRoute').style.bottom = '0';
        // document.getElementById('fifthSectorOverlay').style.visibility = 'visible';
        document.getElementById('fifthRoute').style.opacity = '1';
        // document.getElementById('fifthSectorOverlay').style.opacity = '0.8';
        uiStatus.fifthSector = true;
    }
};

closeFifthRouteData = () => {
    if(uiStatus.fifthSector){
        // if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
        uiStatus.fifthSector = false;
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
    if(document.getElementById('fifthRouteSelectLabel').innerText != '선택') {
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