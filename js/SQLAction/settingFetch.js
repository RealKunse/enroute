getFreqList = async () => {
    fetch("http://localhost:3000/flight/freq", {method: "GET"})
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
                        <td><button type="button" class="deleteButton">삭제</button></td>
                        </tr>`
                }).join('');
            })
                .catch(error => console.log(error));
        }).catch(err => console.err(err))
};

fifthFreqAddConfirm = async () => {
    const [site, freq, sector] = [document.getElementById("fifthFreqAddSiteInput").value,
        document.getElementById("fifthFreqAddFreqInput").value,
        document.getElementById("fifthFreqAddSectorInput").value];

    let result = {};
    result['freq'] = freq;
    result['site'] = site;
    result['sector'] = sector;

    console.log(result);
    fetch(`http://localhost:3000/flight/freq/add/`, {
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
                if ($res.freq) {
                    closeFifthFreqAdd(true);
                }
                 getFreqList();
            })
                .catch(err => {
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

    console.log(result);
    fetch(`http://localhost:3000/flight/freq/edit/`, {
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
                 getFreqList();
            })
                .catch(err => {
                    console.log(err)
                })
        }).catch(err => {
        console.log(err)
    })
}