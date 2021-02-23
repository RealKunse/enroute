document.getElementById("clickSelect").addEventListener("click", onClickSelect)

var optionList = document.querySelectorAll(".option");
for (var i = 0; i < optionList.length; i++) {
    var option = optionList[i];
    option.addEventListener("click", onClickOption);
}


function onClickSelect(e) {
    const isActive = e.currentTarget.className.indexOf("active") !== -1;
    if (isActive) {
        e.currentTarget.className = "select";
        // e.currentTarget.style.visibility = 0;

    } else {
        e.currentTarget.className = "select active";
        // e.currentTarget.style.visibility = 1;
    }
}

function onClickOption(e) {
    console.log(e.currentTarget.innerHTML)
    const selectedValue = e.currentTarget.innerHTML;
    document.getElementById("thirdLabel").innerHTML = selectedValue;
}
