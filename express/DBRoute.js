
const express = require('express');
const router = express.Router();

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database:'enroute',
    connectTimeout:5000,
});


router.get('/', function (req, res) {
    console.log("1 , ")
    // res.send('Hello World!');
    pool.getConnection().then(conn => {
        conn.query("select * from flight_test_list").then((response) => {
            console.log(response.length)
            res.send(response);
            // return response[0];
        })
    })
});

module.exports = router;
