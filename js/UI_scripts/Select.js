

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

document
	.getElementById('fifthSectorClickSelect')
	.addEventListener('click', onClickSelect);

document
	.getElementById('fifthRouteClickSelect')
	.addEventListener('click', onClickSelect);

document.getElementById('secondLimitClickSelect')
	.addEventListener('click', onClickSelect);

document.getElementById('MinwonSiteSelect')
	.addEventListener('click', onClickSelect);

document.getElementById('MinwonFreqSelect')
	.addEventListener('click', onClickSelect);





function onClickSelect(e) {
	const downList = [
		'secondSiteClickSelect',
		'firstReqSiteSelect',
		'firstReqFreqSelect',
		'MinwonSiteSelect',
		'MinwonFreqSelect',
		'firstTypeSelect',
		'secondLimitClickSelect',
		'firstAddReqClickSelect'

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

onFirstReqSectionClose = () => {
	document.getElementById('firstReqSiteSelect').className = 'select';
	document.getElementById('firstReqFreqSelect').className = 'select';

};

function onClickOption(e) {
	const selectedValue = e.currentTarget.innerHTML;
	e.currentTarget.parentElement.previousElementSibling.innerHTML = selectedValue;
}
