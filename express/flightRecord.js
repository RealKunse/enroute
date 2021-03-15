const express = require('express');
const router = express.Router();

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'enroute',
    connectTimeout: 5000,
});


router.get('/', function (req, res) {
    pool.getConnection().then(conn => {
        conn.query("select TestName, TestDate, TestType from flight_test_list order by testDate desc").then((response) => {
            res.send(response);
        }).then((res) => {
            conn.end()
        }).catch(err => {
            conn.end()
        })
    }).catch(err => console.log("not connected"))

});

router.get('/sort/:column/:desc', function (req, res) {
    console.log("hi")
    pool.getConnection().then(conn => {
        conn.query(`select * from flight_test_list order by ${req.params.column} ${req.params.desc}`).then((response) => {
            console.log(req.params.column, req.params.desc)
            res.send(response);
        }).then((res) => {
            conn.end()
        }).catch(err => {
            conn.end()
        })
    }).catch(err => console.log("not connected"))

});


module.exports = router;
