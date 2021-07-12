

document
	.getElementById('thirdClickSelect')
	.addEventListener('click', onClickSelect);
document
	.getElementById('secondSiteClickSelect')
	.addEventListener('click', onClickSelect);
document
	.getElementById('firstReqSiteSelect')
	.addEventListener('click', onClickSelect);
document
	.getElementById('firstReqFreqSelect')
	.addEventListener('click', onClickSelect);

document
	.getElementById('firstTypeSelect')
	.addEventListener('click', onClickSelect);

var optionList = document.querySelectorAll('.option');

for (var i = 0; i < optionList.length; i++) {
	var option = optionList[i];
	option.addEventListener('click', onClickOption);
}

function onClickSelect(e, down) {
	const downList = [
		'secondSiteClickSelect',
		'firstReqSiteSelect',
		'firstReqFreqSelect',
		'firstTypeSelect'
	];
	if (e.currentTarget.className.indexOf('active') !== -1) {
		e.currentTarget.className = 'select';
		// e.currentTarget.style.visibility = 0;
	} else if (downList.includes(e.currentTarget.id)) {
		e.currentTarget.className = 'select activeDown';
		// e.currentTarget.style.visibility = 1;
	} else {
		e.currentTarget.className = 'select active';
	}
}

function onClickOption(e) {
	const selectedValue = e.currentTarget.innerHTML;
	e.currentTarget.parentNode.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML = selectedValue;
}
