class loginModule {
    #islogin = false;
    #id = '';

    setLoginStatus(value) {
        this.#islogin = value;
    }

    getLoginStatus() {
        return this.#islogin;
    }

    setID(value) {
        this.#id = value;
    }

    getID() {
        return this.#id;
    }
}

$('#loginModal').on('keydown', (key) => {
    if(key.key == 'Enter'){
        account_login();
    }
})

const loginItem = new loginModule();
// 추후에 세션으로 교체
account_login = () => {
    const id = document.getElementById("fifthLoginID");
    const pw = document.getElementById("fifthLoginPW");
    let result = {};
    result['id'] = id.value;
    result['pw'] = pw.value;

    fetch(`http://${server_add}:3000/user/login`,
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
            loginItem.setID(id.value);
            alert('ID :' + id.value + ' 로그인에 성공하였습니다.');
            document.getElementById('topUserStatus').innerText ='로그아웃';
            document.getElementById('topUserStatus').onclick = userLogout;
            closeLoginModal();
            id.value = '';
            pw.value = '';
            // 추후에 세션으로 교체
        } else {
            alert('로그인 할 수 없습니다.\nID와 비밀번호를 확인해주세요.');
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

    fetch(`http://${server_add}:3000/user/register`,
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


userLogout = () => {
    const context = document.getElementById('topUserStatus');
    context.innerText = '로그인';
    context.onclick = openLoginModal;
    loginItem.setLoginStatus(false);
    loginItem.setID(null);

}