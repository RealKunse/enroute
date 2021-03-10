firstAddButton = () => {
    if (document.getElementById('firstAddRowButton') != undefined)
        document.getElementById('firstAddRowButton').remove();
    let tr = document.createElement('tr');
    tr.className = 'firstAddTableRow';
    tr.innerHTML = `<td>select</td>
                    <td><input type="number" step="0.025" min="100" max="400" class="firstFrequncyInput" placeholder="주파수"/></td>
                    <td><input type="number" class="firstTXMInput" step="1" min="0" max="5" placeholder="TX-Main 0~5"/></td>
                    <td><input type="number" class="firstRXMInput" step="1" min="0" max="5" placeholder="RX-Main 0~5"/></td>
                    <td><input type="number" class="firstTXSInput" step="1" min="0" max="5" placeholder="TX-Stby 0~5"/></td>
                    <td><input type="number" class="firstRXSInput" step="1" min="0" max="5" placeholder="RX-Stby 0~5"/></td>
                    <td><input type="number" class="firstDistance" step="100" min="3000" max="50000" placeholder="Distance (ft)"/></td>
                    <td><input type="number" class="firstAngle" step=".1" min="0" max="359.9" placeholder="Angle"/></td>
                    <td class="firstAddTableButtonForm"> </td>`

    document.getElementById('firstAddTableBody').appendChild(tr);

    // document.getElementById('firstAddTableBody').innerHTML += `<tr class="firstAddTableRow">
    //                 <td>select</td>
    //                 <td>
    //                 <input type="number" step="0.025" min="100" max="400" class="firstFrequncyInput" placeholder="주파수"/>
    //                 </td><td>
    //                 <input type="number" class="firstTXMInput" step="1" min="0" max="5" placeholder="TX-Main 0~5"/>
    //                 </td>
    //                 <td>rx-m</td>
    //                 <td>tx-s</td>
    //                 <td>rx-s</td>
    //                 <td>distance</td>
    //                 <td>angle</td>
    //                 <td class="firstAddTableButtonForm">
    //                 </td>
    //             </tr>`


    for (i in document.getElementsByClassName('firstFrequncyInput')) {
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

    document.getElementsByClassName('firstFrequncyInput')[document.getElementsByClassName('firstFrequncyInput').length - 1].focus();
}

firstDelButton = (idx) => {
    document.getElementsByClassName('firstAddTableRow')[idx].remove();

    for (i in document.getElementsByClassName('firstFrequncyInput')) {
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
}

confirmData = () => {

}