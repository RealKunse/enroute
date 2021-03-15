const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const app = express()
const port = 3000

const DBRouter = require('./express/flightRecord');
const uploadData = require('./express/fileSys');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'enroute',
    connectTimeout: 5000,
});

// const jsonParser = bodyParser.json();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(bodyParser.json())

// app.use(bodyParser({keepExtensions:true, uploadDir:.join(__dirname,'/files')}))
app.use(cors());
app.use('/flight/', DBRouter);
app.use('/upload/', uploadData);


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

var storage = multer.diskStorage({ // 2
        destination(req, file, cb) {
            cb(null, 'uploadFiles/');
        },
        filename(req, file, cb) {
            cb(null, `${Date.now()}__${file.originalname}`)
        }
    });

var uploadWithOriginalFilename = multer({storage: storage});

app.post('/dat', uploadWithOriginalFilename.single('dat'), (req, res) => {
    console.log(req.file)
    // 경로 파일 받기
})

app.post('/hello', (req, res) => {
    console.log(req.body)
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

