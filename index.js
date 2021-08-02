const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
// const FileStore = require('session-file-store')(session);
const app = express();
const port = 3000;

const DBRouter = require('./express/flightRecord');
const uploadData = require('./express/fileSys');
const user = require('./express/User');


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
    extended: true
}));
app.use(bodyParser.json());

// app.use(bodyParser({keepExtensions:true, uploadDir:.join(__dirname,'/files')}))
app.use(cors());
app.use('/flight/', DBRouter);
app.use('/upload/', uploadData);
app.use('/user/', user);


app.get('/hi', function (req, res) {
    res.send('Hello World!');

});


app.get('/session/', (req, res) => {
    console.log(req.session.num);
    if (!req.session.num) {
        req.session.num = 1;
    } else {
        req.session.num = req.session.num + 1;
    }
    res.send(`Number : ${req.session.num}`);
})

app.get('/api/fix_point', function (req, res) {
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

app.get('/api/sites', function (req, res) {
    pool.getConnection().then(conn => {
        conn.query(`select SiteName, SiteLat, SiteLng from site where isSite=1`).then((response) => {
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
    // console.log(req.file)
    const article = fs.readFileSync("uploadFiles/" + req.file.filename);
    let linearray = article.toString().split('\n');
    let result = {};
    let final = {data: []};

    linearray.splice(0, 1);

    for (i in linearray) {
        linearray[i] = linearray[i].replace(/ +/g, " ");
        linearray[i] = linearray[i].split(' ');

        linearray[i].splice(2, 5);
        // linearray[i].splice(3, 2)
        for (let j = 0; j < 10; j++) {
            linearray[i].pop();
        }
        if (linearray[i].length == 0)
            linearray.splice(i, 1);

    }
    for (let i = 0; i < linearray.length; i++) {
        result.date = (linearray[i][0] + ' ' + linearray[i][1])
        result.alt = (linearray[i][2]);
        result.lat = linearray[i][3];
        result.lng = linearray[i][4];
        // result.lat = (linearray[i][3] + '.' + linearray[i][4] + linearray[i][5])
        // result.lng = (linearray[i][6] + '.' + linearray[i][7] + linearray[i][8])
        final['data'].push({'date': result.date, 'alt': result.alt, 'lat': result.lat, 'lng': result.lng})
    }

    res.send(final)
})


app.post('/hello', (req, res) => {
    console.log(req.body)
});

app.get('/notice', (req, res) => {
    pool.getConnection()
        .then((conn) =>
            conn.query(`select * from enroute.notice order by date desc`)
                .then(response => {
                    res.send(response);
                    conn.end();
                })
                .catch(err => {
                    console.log(err);
                    conn.end();
                })
        )
});

app.get('/notice_asc', (req, res) => {
    pool.getConnection()
        .then((conn) =>
            conn.query(`select * from enroute.notice order by date`)
                .then(response => {
                    res.send(response);
                    conn.end();
                })
                .catch(err => {
                    console.log(err);
                    conn.end();
                })
        )
});

app.post('/notice/add', (req, res) => {
    const json = req.body.result;
    pool.getConnection()
        .then(conn => {
            conn.query(`insert into enroute.notice values(null,'${json.title}','${json.context}',current_timestamp(),'${json.type}','${json.version}')`)
                .then(response => {
                    res.send(response);
                    conn.end();
                }).catch(err => {
                console.log(err);
                conn.end();
            })
        })
});

app.post('/notice/del', (req, res) => {
    const json = req.body.result;
    pool.getConnection()
        .then(conn => {
            conn.query(`delete from enroute.notice where title='${json.title}' and context='${json.context}'`)
                .then(response => {
                    res.send(response);
                    conn.end();
                }).catch(err => {
                console.log(err);
                conn.end();
            })
        })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

