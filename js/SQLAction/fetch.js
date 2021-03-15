let loaded = false
let clickedColumn = ['', 0];

let fileNames = [];

getTestList = async () => {
    if (loaded == false) {
        loaded = true
        fetch("http://localhost:3000/flight", {method: "GET"})
            .then(res => {
                res.json().then(response => {
                    document.getElementById('firstTableBody').innerHTML
                        = response.map((c) => {
                        return `
                        <tr class="firstRow" onclick="onRowClick('${(c.TestName)}')">
                        <td class="firstColumn">${c.TestName}</td>
                        <td class="firstColumn">${c.TestDate.slice(0, 10)}</td>
                        <td class="firstColumn">${c.TestType}</td></tr>`
                    }).join('')
                })
                    .catch(error => console.log(error))
            }).catch(err => console.err(err))
    }
}

onRowClick = (name) => {
    console.log(name)
}

onColumnClick = (column) => {

    if (column != clickedColumn[0])
        clickedColumn = [column, 0]

    if (clickedColumn[0] == column && clickedColumn[1] % 2 == 1) {
        clickedColumn = [column, clickedColumn[1] + 1]
        url = `http://localhost:3000/flight/sort/${column}/desc`
    } else {
        clickedColumn = [column, clickedColumn[1] + 1]
        url = `http://localhost:3000/flight/sort/${column}/asc`
    }


    fetch(url, {method: "GET"})
        .then(res => {
            res.json().then(response => {
                document.getElementById('firstTableBody').innerHTML
                    = response.map((c) => {
                    clickedColumn[0] = column

                    return `
                        <tr class="firstRow" onclick="onRowClick('${(c.TestName)}')">
                        <td class="firstColumn">${c.TestName}</td>
                        <td class="firstColumn">${c.TestDate.slice(0, 10)}</td>
                        <td class="firstColumn">${c.TestType}</td></tr>`
                }).join('')
            })
                .catch(error => console.log(error))
        }).catch(err => console.err(err))


}
