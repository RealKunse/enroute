class loginModule{
    #islogin = false;
    #id = '';

    setLoginStatus(value){
        this.#islogin = value;
    }
    getLoginStatus(){
        return this.#islogin;
    }
    setID(value){
        this.#id = value;
    }
    getID(){
        return this.#id;
    }
}

const loginItem = new loginModule();
// 추후에 세션으로 교체

account_login = () => {
    const id = document.getElementById("fifthLoginID").value;
    const pw = document.getElementById("fifthLoginPW").value;
    let result = {};
    result['id'] = id;
    result['pw'] = pw;

    fetch('http://localhost:3000/user/login',
        {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({result})
        }).then(res => {
        if (res.status == 200) {
            console.log(id, 'login Success');
            loginItem.setLoginStatus(true);
            loginItem.setID(id);
            // 추후에 세션으로 교체
        } else {
            console.log(id, 'login failed');
        }
    }).catch(err => {
        console.log(err)
    });

    console.log(id, pw);
};

create_account = (id, pw) => {
    let result = {};
    result['id'] = id;
    result['pw'] = pw;

    fetch('http://localhost:3000/user/register',
        {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({result})
        }).then(res => {
        if (res.status == 302) {
            console.log(id, 'has been created');
        } else {
            console.log(id, 'has already created!');
        }
    }).catch(err => {
        console.log(err)
    })

};
