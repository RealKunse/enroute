getTestList = async () => {
    fetch("http://localhost:3000/db/", {method: "GET"})
        .then(res => {
            res.json().then(response => {
                console.log(response)
                response.map( (c) => {
                    document.getElementById('firstContext').innerHTML
                        += `<div>${c.TestName}</div>
                        <div>${c.TestDate}</div>
                        <div>${c.TestType}</div>`
                })

            })
                .catch(error => console.log(error))
        }).catch(err => console.err(err))
}

/*
getTestList = async () => {
    fetch("http://localhost:3000/db/", {method: "POST", headers:{Content-Type": "application/json"})
        .then(res => {
            console.log(res.json());
        }).then((data) => console.log(data))
}
 */