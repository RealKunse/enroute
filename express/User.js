const express = require('express');
const router = express.Router();

const mariadb = require('mariadb');
const crypto = require('crypto');
const session = require('express-session');

const cookieParser = require('cookie-parser');
const cookie = require('cookie');

router.use(cookieParser());

router.use(session({
    key: 'sid',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000
    }
}));

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'enroute',
    connectTimeout: 5000,
});

// router.post('/register', (req, res) => {
//     const id = req.body.result.id;
//     const pw = req.body.result.pw;
//     pool.getConnection().then(conn => {
//         conn.query(`insert into enroute.account values('${id}','${pw}',2)`)
//             .then(_res => {
//                 conn.end();
//                 res.status(200).json({message: id + " is created"});
//             }).catch(err => {
//             conn.end();
//             res.status(500).mess({message: id + " is already created"});
//             console.log(err);
//         })
//     })
// });
//

//
//


router.post('/login', (req, res) => {
    const id = req.body.result.id;
    const password = req.body.result.pw;
    pool.getConnection().then(conn => {
        conn.query(`select pw from enroute.account where id='${id}'`)
            .then((response) => {
                console.log(id, 'tried to log in...');
                if (!response[0]) {
                    conn.end();
                    req.session.destroy();
                    res.status(501).json({message: "login failed"});
                }
                if (response[0]['pw'] == (password)) {
                    req.session.loginid = id;
                    console.log(id, "login success");
                    conn.end();
                    res.status(200).json({message: "login success", id: id});

                } else {
                    conn.end();
                    req.session.destroy();
                    res.status(501).json({message: "login failed"});
                }
            })
            .catch(err => {
                console.log(err);
                conn.end();
                res.status(500).json({message: "login failed"});

            })
    })
});

router.get('/auth', (req, res) => {
    res.send(req.session.loginid);
});


module.exports = router;