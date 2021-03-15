let popedPage = 0;

displayPopup = (id) => {
    if (id == popedPage) {
        resetPopup(popedPage);
        return
    }

    resetActivatedPopup(id);
    popedPage = id;
    console.log("Popping up     ", popedPage)
    document.getElementById(id).style.bottom = "0";
}

resetPopup = (id) => {
    console.log("closing popup  ", id)
    popedPage = 0;
    document.getElementById(id).style.bottom = "-100%";
}

resetActivatedPopup = (id) => {
    if (popedPage != 0) {
        console.log("closing all     popup")
        document.getElementById(popedPage).style.bottom = "-100%";
        popedPage = 0;
    }
}

openModal = () => {
    console.log("opening notice modal")
    document.getElementById("noticeModal").style.visibility = 'visible'
    document.getElementById("noticeOverlay").style.visibility = 'visible'
    document.getElementById("noticeModal").style.opacity = 1;
    document.getElementById("noticeOverlay").style.opacity = .8;
}

closeModal = () => {
    console.log("closing notice modal")
    document.getElementById("noticeModal").style.opacity = 0;
    document.getElementById("noticeOverlay").style.opacity = 0;
    document.getElementById("noticeModal").style.visibility = "hidden";
    document.getElementById("noticeOverlay").style.visibility = "hidden";
}

openFirstAddComponent = () => {
    document.getElementById('firstTitleInput').disabled = false;
    document.getElementById('firstDateInput').disabled = false;
    document.getElementById('firstRouteUpload').disabled = false;
    document.getElementById("firstAddDataComponent").style.visibility = 'visible'
    document.getElementById("firstAddComponentOverlay").style.visibility = 'visible'
    document.getElementById("firstAddDataComponent").style.opacity = 1;
    document.getElementById("firstAddComponentOverlay").style.opacity = 1;
    // document.getElementById("firstTitleInput").focus();
    document.getElementById('firstAddTableBody').innerHTML = ''
    document.getElementById('firstTitleInput').value = '';
    document.getElementById('firstDateInput').value = '';
    document.getElementById('firstRouteUpload').value = '';
    document.getElementById('firstAddButton').innerText = '확인';
    document.getElementById('firstAddButton').onfocus = function(){firstAddRowConfirmOnFocus()};
    document.getElementById('firstAddButton').visibility = 'visible';
}

closeFirstAddComponent = () => {

    if (window.confirm("작성을 중단하고 나가시겠습니까?") == true) {

        document.getElementById("firstAddDataComponent").style.opacity = 0;
        document.getElementById("firstAddComponentOverlay").style.opacity = 0;
        document.getElementById("firstAddDataComponent").style.visibility = "hidden";
        document.getElementById("firstAddComponentOverlay").style.visibility = "hidden";


    }
}
