const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000
const mariadb = require('mariadb');
const DBRouter = require('./express/flightRecord');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'enroute',
    connectTimeout: 5000,
});

app.use(cors());
app.use('/flight/', DBRouter);

app.get('/hi', function (req, res) {
    res.send('Hello World!');

});

app.get('/fix_point', function (req, res) {
    pool.getConnection().then(conn => {
        conn.query(`select * from fix_points`).then((response) => {
            res.send(response);
        }).then((res) => {
            conn.end()
        }).catch(err => {
            conn.end()
        })
    }).catch(err => console.log("not connected"))

});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

