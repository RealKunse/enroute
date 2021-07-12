let popedPage = 0;

displayPopup = (id) => {
    if (id == popedPage) {
        resetPopup(popedPage);
        return;
    }

    resetActivatedPopup(id);
    popedPage = id;
    console.log('Popping up     ', popedPage);
    document.getElementById(id).style.bottom = '0';
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
    console.log('opening notice modal');
    document.getElementById('noticeModal').style.visibility = 'visible';
    document.getElementById('noticeOverlay').style.visibility = 'visible';
    document.getElementById('noticeModal').style.opacity = 1;
    document.getElementById('noticeOverlay').style.opacity = 0.8;
};

closeModal = () => {
    console.log('closing notice modal');
    document.getElementById('noticeModal').style.opacity = 0;
    document.getElementById('noticeOverlay').style.opacity = 0;
    document.getElementById('noticeModal').style.visibility = 'hidden';
    document.getElementById('noticeOverlay').style.visibility = 'hidden';
};

openFirstAddComponent = () => {
    document.getElementById('firstTitleInput').disabled = false;
    document.getElementById('firstDateInput').disabled = false;
    document.getElementById('firstRouteUpload').disabled = false;
    document.getElementById('firstAddDataComponent').style.visibility =
        'visible';
    document.getElementById('firstAddComponentOverlay').style.visibility =
        'visible';
    document.getElementById('firstAddDataComponent').style.opacity = 1;
    document.getElementById('firstAddComponentOverlay').style.opacity = 1;
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
        document.getElementById('firstAddDataComponent').style.opacity = 0;
        document.getElementById('firstAddComponentOverlay').style.opacity = 0;
        document.getElementById('firstAddDataComponent').style.visibility =
            'hidden';
        document.getElementById('firstAddComponentOverlay').style.visibility =
            'hidden';
    }
};

openFirstReqData = () => {
    document.getElementById('firstReqData').style.visibility = 'visible';
    document.getElementById('firstReqDataOverlay').style.visibility = 'visible';
    document.getElementById('firstReqData').style.opacity = 1;
    document.getElementById('firstReqDataOverlay').style.opacity = 0.8;
};

closeFirstReqData = () => {
    // if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {

    document.getElementById('firstReqData').style.opacity = 0;
    document.getElementById('firstReqDataOverlay').style.opacity = 0;
    document.getElementById('firstReqData').style.visibility = 'hidden';
    document.getElementById('firstReqDataOverlay').style.visibility = 'hidden';

    // }
};


openFirstComplaintData = () => {
    document.getElementById('firstReqData').style.visibility = 'visible';
    document.getElementById('firstReqDataOverlay').style.visibility = 'visible';
    document.getElementById('firstReqData').style.opacity = 1;
    document.getElementById('firstReqDataOverlay').style.opacity = 0.8;
};

closeFirstComplaintData = () => {
    // if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {

    document.getElementById('firstReqData').style.opacity = 0;
    document.getElementById('firstReqDataOverlay').style.opacity = 0;
    document.getElementById('firstReqData').style.visibility = 'hidden';
    document.getElementById('firstReqDataOverlay').style.visibility = 'hidden';

    // }
};

openFifthFreqData = () => {
    document.getElementById('fifthFreq').style.visibility = 'visible';
    document.getElementById('fifthFreqOverlay').style.visibility = 'visible';
    document.getElementById('fifthFreq').style.opacity = 1;
    document.getElementById('fifthFreqOverlay').style.opacity = 0.8;
};

closeFifthFreqData = () => {
    // if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {

    document.getElementById('fifthFreq').style.opacity = 0;
    document.getElementById('fifthFreqOverlay').style.opacity = 0;
    document.getElementById('fifthFreq').style.visibility = 'hidden';
    document.getElementById('fifthFreqOverlay').style.visibility = 'hidden';

    // }
};

openFifthFreqAdd = () => {
    document.getElementById('fifthFreqAdd').style.visibility = 'visible';
    document.getElementById('fifthFreqAddOverlay').style.visibility = 'visible';
    document.getElementById('fifthFreqAdd').style.opacity = 1;
    document.getElementById('fifthFreqAddOverlay').style.opacity = 0.8;
};

closeFifthFreqAdd = (bool) => {
    if(bool){
        document.getElementById('fifthFreqAdd').style.opacity = 0;
        document.getElementById('fifthFreqAddOverlay').style.opacity = 0;
        document.getElementById('fifthFreqAdd').style.visibility = 'hidden';
        document.getElementById('fifthFreqAddOverlay').style.visibility = 'hidden';
    }
    else if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {
        document.getElementById('fifthFreqAdd').style.opacity = 0;
        document.getElementById('fifthFreqAddOverlay').style.opacity = 0;
        document.getElementById('fifthFreqAdd').style.visibility = 'hidden';
        document.getElementById('fifthFreqAddOverlay').style.visibility = 'hidden';
    }
};

openFifthFreqEdit = (elem) => {
	const [freq,site,sector]= [elem.parentElement.parentElement.children[0].innerText,
		elem.parentElement.parentElement.children[1].innerText,
		elem.parentElement.parentElement.children[2].innerText];

    vaultFreqEditValue(freq,site,sector);

	document.getElementById('fifthFreqEditSiteInput').value = site;
	document.getElementById('fifthFreqEditFreqInput').value = freq;
	document.getElementById('fifthFreqEditSectorInput').value = sector;

	document.getElementById('fifthFreqEdit').style.visibility = 'visible';
    document.getElementById('fifthFreqEditOverlay').style.visibility = 'visible';
    document.getElementById('fifthFreqEdit').style.opacity = 1;
    document.getElementById('fifthFreqEditOverlay').style.opacity = 0.8;
};
closeFifthFreqEdit = () => {
    if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {

        document.getElementById('fifthFreqEdit').style.opacity = 0;
        document.getElementById('fifthFreqEditOverlay').style.opacity = 0;
        document.getElementById('fifthFreqEdit').style.visibility = 'hidden';
        document.getElementById('fifthFreqEditOverlay').style.visibility = 'hidden';

    }
};

let _fifthEditFreq, _fifthEditStie, _fifthEditSector;
vaultFreqEditValue = (freq,site,sector) => {
    [_fifthEditFreq, _fifthEditStie, _fifthEditSector] = [freq,site,sector]
}