const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'enroute',
    connectTimeout: 5000,
});

router.get('/list', function (req, res) {
    pool.getConnection()
        .then((conn) => {
            conn.query(
                'select TestName, TestDate, TestType from flight_test_list order by testDate desc',
            )
                .then((response) => {
                    res.send(response);
                    conn.end();
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
});

router.get('/list/:column/:desc', function (req, res) {
    pool.getConnection()
        .then((conn) => {
            conn.query(
                `select * from flight_test_list order by ${req.params.column} ${req.params.desc}`,
            )
                .then((response) => {
                    console.log(req.params.column, req.params.desc);
                    res.send(response);
                    conn.end();
                })
                .catch((err) => {
                    console.error(err);
                    conn.end();
                });
        })
});


router.get('/testRes/:testname', (req, res) => {
    pool.getConnection()
        .then((conn) => {
            conn.query(
                `select id, sitename_fk, frequency_fk, testname_fk, txmain, rxmain, txstby, rxstby, angle, distance, height from enroute.flight_test_result where testname_fk = '${req.params.testname}'`,
            )
                .then((response) => {
                    res.send(response);
                    conn.end();
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
});


router.post('/testRes/hasroute', (req, res) => {
    const body = req.body.title;
    pool.getConnection()
        .then(conn => {
            conn.query(`select testRoute from enroute.flight_test_list where testname='${body.testname}'`)
                .then(response => {
                    // console.log(response);
                    conn.end();
                    fetch('http://localhost:3000/dat/txt', {
                        method: 'post',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            title: response[0].testRoute
                        })
                    }).then(res_ => {
                        res_.json().then(coord => {
                                res.send(coord);
                            }
                        )
                    });


                    // if (response[0].testRoute == null || response[0].testRoute == '') {
                    //     res.send(response[0].testRoute)
                    // } else {
                    //     res.send({result: response[0].testRoute})
                    // }
                }).catch(err => {
                console.log(err);
                conn.end();
            })
        })
})

router.get('/testRes/minwon/open', (req, res) => {
    pool.getConnection()
        .then((conn) => {
            conn.query(
                `select id, sitename_fk, frequency_fk, angle, distance, height, status from enroute.flight_test_result where testname_fk = '민원'`,
            )
                .then((response) => {
                    res.send(response);
                    conn.end();
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
});

router.post('/testRes/minwon/add', (req, res) => {
    const site = req.body.result.site;
    const freq = req.body.result.freq;
    const status = req.body.result.status;
    const id = req.body.result.id;
    const angle = req.body.result.angle;
    const distance = req.body.result.distance;
    const height = req.body.result.height;

    let sql = `insert into enroute.flight_test_result (sitename_fk, frequency_fk, testname_fk, angle,distance,height,status)
     values('${site}','${freq}', '민원','${angle}','${distance}', '${height}', '${status}')`;

    pool.getConnection()
        .then((conn) => {
            conn.query(sql)
                .then((response) => {
                    res.send(response);
                    conn.end();
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                    res.status(err.status || 500);
                    res.send(err.message || "Error");

                });
        })
        .catch((err) => console.log('not connected'));
});

router.post('/testRes/minwon/edit', (req, res) => {
    const site = req.body.result.site;
    const freq = req.body.result.freq;
    const status = req.body.result.status;
    const id = req.body.result.id;
    const angle = req.body.result.angle;
    const distance = req.body.result.distance;
    const height = req.body.result.height;

    let sql = `update enroute.flight_test_result set sitename_fk ='${site}', frequency_fk='${freq}', status='${status}', angle='${angle}', distance='${distance}', height='${height}' 
    where id='${id}'`;

    pool.getConnection()
        .then((conn) => {
            conn.query(sql)
                .then((response) => {
                    res.send(response);
                    conn.end();
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});


router.post('/testRes/search', (req, res) => {
    const site = req.body.result.site;
    const freq =
        req.body.result.freq == '전체'
            ? '전체'
            : parseFloat(req.body.result.freq);
    const name = req.body.result.name;

    let sql;
    if (site == '전체' && freq == '전체') {
        sql = `select id, sitename_fk, frequency_fk, testname_fk, txmain, rxmain, txstby, rxstby, angle, distance, height from enroute.flight_test_result where testname_fk = '${name}'`;
    } else if (site != '전체' && freq == '전체') {
        sql = `select id, sitename_fk, frequency_fk, testname_fk, txmain, rxmain, txstby, rxstby, angle, distance, height from enroute.flight_test_result where testname_fk = '${name}' and sitename_fk = '${site}'`;
    } else if (site == '전체' && freq != '전체') {
        sql = `select id, sitename_fk, frequency_fk, testname_fk, txmain, rxmain, txstby, rxstby, angle, distance, height from enroute.flight_test_result where testname_fk = '${name}' and frequency_fk = ${
            Math.round(freq * 1000) / 1000
        }`;
    } else {
        sql = `select id, sitename_fk, frequency_fk, testname_fk, txmain, rxmain, txstby, rxstby, angle, distance, height from enroute.flight_test_result where testname_fk = '${name}' and sitename_fk = '${site}' and frequency_fk = ${
            Math.round(freq * 1000) / 1000
        }`;
    }

    pool.getConnection()
        .then((conn) => {
            conn.query(sql)
                .then((response) => {
                    res.send(response);
                    conn.end();
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});
router.post('/testRes/search', (req, res) => {
    const site = req.body.result.site;
    const freq =
        req.body.result.freq == '전체'
            ? '전체'
            : parseFloat(req.body.result.freq);
    const name = req.body.result.name;

    let sql;
    if (site == '전체' && freq == '전체') {
        sql = `select id, sitename_fk, frequency_fk, testname_fk, txmain, rxmain, txstby, rxstby, angle, distance, height from enroute.flight_test_result where testname_fk = '${name}'`;
    } else if (site != '전체' && freq == '전체') {
        sql = `select id, sitename_fk, frequency_fk, testname_fk, txmain, rxmain, txstby, rxstby, angle, distance, height from enroute.flight_test_result where testname_fk = '${name}' and sitename_fk = '${site}'`;
    } else if (site == '전체' && freq != '전체') {
        sql = `select id, sitename_fk, frequency_fk, testname_fk, txmain, rxmain, txstby, rxstby, angle, distance, height from enroute.flight_test_result where testname_fk = '${name}' and frequency_fk = ${
            Math.round(freq * 1000) / 1000
        }`;
    } else {
        sql = `select id, sitename_fk, frequency_fk, testname_fk, txmain, rxmain, txstby, rxstby, angle, distance, height from enroute.flight_test_result where testname_fk = '${name}' and sitename_fk = '${site}' and frequency_fk = ${
            Math.round(freq * 1000) / 1000
        }`;
    }

    pool.getConnection()
        .then((conn) => {
            conn.query(sql)
                .then((response) => {
                    res.send(response);
                    conn.end();
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});

router.post('/testRes/edit', (req, res) => {
    const _name = req.body.before.testname;
    const _site = req.body.before.site;
    const _freq = req.body.before.freq;
    const _angle = req.body.before.angle;
    const _distance = req.body.before.distance;
    const _height = req.body.before.height;

    const site = req.body.result.site;
    const freq = req.body.result.freq;
    const txm = req.body.result.txm;
    const rxm = req.body.result.rxm;
    const txs = req.body.result.txs;
    const rxs = req.body.result.rxs;
    const angle = req.body.result.angle;
    const distance = req.body.result.distance;
    const height = req.body.result.height;

    let sql = `update enroute.flight_test_result set sitename_fk ='${site}', frequency_fk='${freq}', txmain='${txm}', 
    rxmain='${rxm}', txstby='${txs}', rxstby='${rxs}', angle='${angle}', distance='${distance}', height='${height}' 
    where testname_fk = '${_name}' and sitename_fk = '${_site}' and frequency_fk = '${_freq}' and angle=${_angle} and distance=${_distance} and height=${_height}`;

    pool.getConnection()
        .then((conn) => {
            conn.query(sql)
                .then((response) => {
                    res.send(response);
                    conn.end();
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});

router.post('/second/search', (req, res) => {
    const site = ` sitename_fk='${req.body.result.site}'`;
    const freq = req.body.result.freq == '' ? '' : ` frequency_fk like '%${req.body.result.freq}%'`;
    const name = req.body.result.name == '' ? '' : ` testname_fk like '%${req.body.result.name}%'`;
    const limit = `${req.body.result.limit == '전체' ? '' : `limit ${req.body.result.page == '' ? 0 : req.body.result.page},${req.body.result.limit}`}`;
    let date;
    if (req.body.result.startdate != '' && req.body.result.enddate != '') {
        date = ` testdate between '${req.body.result.startdate}' and '${req.body.result.enddate}'`
    } else if (req.body.result.startdate != '' && req.body.result.enddate == '') {
        date = ` testdate > '${req.body.result.startdate}'`;
    } else if (req.body.result.startdate == '' && req.body.result.enddate != '') {
        date = ` testdate < '${req.body.result.enddate}'`;
    } else {
        date = ''
    }

    let sql = `SELECT id, sitename_fk, frequency_fk, testname_fk, testDate,txmain, rxmain, txstby, rxstby, angle, distance, height 
FROM enroute.flight_test_result a, enroute.flight_test_list b
where a.TestName_FK = b.TestName ${req.body.result.site != '전체' ? 'and' + site : ''} ${freq.length != 0 ? 'and' + freq : ''} ${name.length != 0 ? 'and' + name : ''} ${date.length != 0 ? 'and' + date : ''} ${limit}
;`;
    pool.getConnection()
        .then((conn) => {
            conn.query(sql)
                .then((response) => {
                    res.send(response);
                    conn.end();
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});

router.post('/second/search/count', (req, res) => {
    const site = ` sitename_fk='${req.body.result.site}'`;
    const freq = req.body.result.freq == '' ? '' : ` frequency_fk like '%${req.body.result.freq}%'`;
    const name = req.body.result.name == '' ? '' : ` testname_fk like '%${req.body.result.name}%'`;
    const limit = `limit ${req.body.result.page},${req.body.result.limit}`;
    let date;
    if (req.body.result.startdate != '' && req.body.result.enddate != '') {
        date = ` testdate between '${req.body.result.startdate}' and '${req.body.result.enddate}'`
    } else if (req.body.result.startdate != '' && req.body.result.enddate == '') {
        date = ` testdate > '${req.body.result.startdate}'`;
    } else if (req.body.result.startdate == '' && req.body.result.enddate != '') {
        date = ` testdate < '${req.body.result.enddate}'`;
    } else {
        date = ''
    }
    let sql = `SELECT count(*) as count
FROM enroute.flight_test_result a, enroute.flight_test_list b
where a.TestName_FK = b.TestName ${req.body.result.site != '전체' ? 'and' + site : ''} ${freq.length != 0 ? 'and' + freq : ''} ${name.length != 0 ? 'and' + name : ''} ${date.length != 0 ? 'and' + date : ''}
;`;
    pool.getConnection()
        .then((conn) => {
            conn.query(sql)
                .then((response) => {
                    res.send(response);
                    conn.end();
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});

router.post('/list/add', (req, response) => {
    const body = req.body.result;
    console.log(body);
    pool.getConnection()
        .then((conn) => {
            conn.query(
                `insert into flight_test_list (testname, testdate, testtype, testroute) values('${body.testName}',
                 '${body.testDate}', '${body.testType}' , '${(body.testRoute).toString().slice(11)}')`,
            )
                .then((res) => {
                    // console.log(res);

                    for (let i = 0; i < Object.keys(body.data).length; i++) {
                        conn.query(
                            `insert into flight_test_result (sitename_fk, frequency_fk, testname_fk, txmain, rxmain, txstby, rxstby, angle, distance, height)
                             values('${body['data'][i]['site']}','${body['data'][i]['frequency']}', '${body.testName}', '${body['data'][i]['txmain']}', '${body['data'][i]['rxmain']}', '${body['data'][i]['txstby']}', '${body['data'][i]['rxstby']}', '${body['data'][i]['angle']}', '${body['data'][i]['distance']}', '${body['data'][i]['height']}');`,
                        )
                            .then((_res) => {
                                console.log(_res);
                                if (i == Object.keys(body.data).length - 1) {
                                    response.send(_res)
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                                conn.end();
                                response.status(err.status || 500);
                                response.send(err.message || "Error");
                            });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                    response.status(err.status || 500);
                    response.send(err.message || "Error");
                });
        })
        .catch((err) => {
            console.log(err);
            response.status(err.status || 500);
            response.send(err.message || "Error");
        });

    // SQL 문 작성 필요ㅕ
});

router.get('/freq', function (req, res) {
    pool.getConnection()
        .then((conn) => {
            conn.query(
                'select freqsite, frequency, sector_fk from enroute.frequency where isusing = 1',
            )
                .then((response) => {
                    res.send(response);
                    conn.end();
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});

router.post('/freq/add', function (req, res) {
    const [site, freq, sector] = [req.body.result.site, req.body.result.freq, req.body.result.sector];

    pool.getConnection()
        .then((conn) => {
            conn.query(
                `insert into enroute.frequency values ('${freq}','${site}','${sector}',null,null,1)`,
            )
                .then((response) => {
                    res.send(response);
                    conn.end()
                })
                .catch((err) => {
                    res.send(err);
                    console.log(err);
                    console.log(err.sqlState, err.code);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});

router.post('/freq/edit', function (req, res) {
    const [site, freq, sector] = [req.body.result.site, req.body.result.freq, req.body.result.sector];
    const [_site, _freq, _sector] = [req.body.result._site, req.body.result._freq, req.body.result._sector];

    pool.getConnection()
        .then((conn) => {
            conn.query(
                `update enroute.frequency set 
                frequency=${freq},
                freqsite='${site}',
                sector_fk='${sector}' where isUsing=1 and frequency=${_freq} and freqsite='${_site}' and sector_fk='${_sector}'`,
            )
                .then((response) => {
                    res.send(response);
                    conn.end()
                })
                .catch((err) => {
                    res.send(err);
                    console.log(err);
                    console.log(err.sqlState, err.code);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});

router.post('/freq/delete', (req, res) => {
    const [freq, site] = [req.body.result.freq, req.body.result.site]
    pool.getConnection()
        .then((conn) => {
            conn.query(
                `update enroute.frequency set isUsing=0 where frequency = '${freq}' and freqsite ='${site}'`,
            )
                .then((response) => {
                    res.send(response);
                    conn.end()
                })
                .catch((err) => {
                    res.send(err);
                    console.log(err);
                    console.log(err.sqlState, err.code);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});

router.get('/site', function (req, res) {
    pool.getConnection()
        .then((conn) => {
            conn.query(
                'select sitename, sitelat, sitelng, issite, islowsite, isvortac from enroute.site where issite = 1 or islowsite=1 or isvortac =1',
            )
                .then((response) => {
                    res.send(response);
                    conn.end();
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500);
                    conn.end();
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500);
            console.log('not connected')
        });
});

router.get('/site/list', function (req, res) {
    pool.getConnection()
        .then((conn) => {
            conn.query(
                'select sitename, sitelat, sitelng from enroute.site where issite = 1 or islowsite=1 order by issite desc',
            )
                .then((response) => {
                    res.send(response);
                    conn.end();
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500);
                    conn.end();
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500);
            console.log('not connected')
        });
});

router.post('/site/add', function (req, res) {
    const [site, lat, lng] = [req.body.result.site, req.body.result.lat, req.body.result.lng];
    let type = req.body.result.type;
    if (type == 1) {
        type = '1,null,null';
    } else if (type == 2) {
        type = 'null, 1, null';
    } else if (type == 3) {
        type = 'null, null, 1';
    }


    pool.getConnection()
        .then((conn) => {
            conn.query(
                `insert into enroute.site values ('${site}','${lat}','${lng}',${type})`,
            )
                .then((response) => {
                    res.send(response);
                    conn.end();
                    console.log(site, lat, lng, req.body.result.type, "site has been created.")
                })
                .catch((err) => {
                    res.send(err);
                    console.log(err);
                    console.log(err.sqlState, err.code);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});

router.post('/site/edit', function (req, res) {
    const [site, lat, lng, _site] = [req.body.result.site, req.body.result.lat, req.body.result.lng, req.body.result._site];

    pool.getConnection()
        .then((conn) => {
            conn.query(
                `update enroute.site set 
                sitename='${site}',
                sitelat=${lat}, sitelng=${lng} where sitename='${_site}'`,
            )
                .then((response) => {
                    res.send(response);
                    conn.end();
                    console.log(site, lat, lng, _site, "site has been updated.")
                })
                .catch((err) => {
                    res.send(err);
                    console.log(err);
                    console.log(err.sqlState, err.code);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});

router.post('/site/delete', (req, res) => {
    const [site] = [req.body.result.site];
    pool.getConnection()
        .then((conn) => {
            conn.query(
                `update enroute.site set isSite=0, isLowSite=0, isVortac=0 where sitename ='${site}'`,
            )
                .then((response) => {
                    res.send(response);
                    conn.end();
                    console.log(site, "site has been deleted.")
                })
                .catch((err) => {
                    res.send(err);
                    console.log(err);
                    console.log(err.sqlState, err.code);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});

router.get('/fix', function (req, res) {
    pool.getConnection()
        .then((conn) => {
            conn.query(
                'select pointname, pointlat, pointlng from enroute.fix_points where isusing = 1;',
            )
                .then((response) => {
                    res.send(response);
                })
                .then((res) => {
                    conn.end();
                })
                .catch((err) => {
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});

router.post('/fix/add', function (req, res) {
    const [name, lat, lng] = [req.body.result.name, req.body.result.lat, req.body.result.lng];


    pool.getConnection()
        .then((conn) => {
            conn.query(
                `insert into enroute.fix_points values ('${name}','${lat}','${lng}',1)`,
            )
                .then((response) => {
                    res.send(response);
                    conn.end();
                    console.log(name, lat, lng, "fix point has been created.")
                })
                .catch((err) => {
                    res.send(err);
                    console.log(err);
                    console.log(err.sqlState, err.code);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});

router.post('/fix/edit', function (req, res) {
    const [name, lat, lng, _name] = [req.body.result.name, req.body.result.lat, req.body.result.lng, req.body.result._name];

    pool.getConnection()
        .then((conn) => {
            conn.query(
                `update enroute.fix_points set 
                pointname='${name}',
                pointlat=${lat}, pointlng=${lng} where pointname='${_name}'`,
            )
                .then((response) => {
                    res.send(response);
                    conn.end();
                    console.log(name, lat, lng, _name, "fix point has been updated.")
                })
                .catch((err) => {
                    res.send(err);
                    console.log(err);
                    console.log(err.sqlState, err.code);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});

router.post('/fix/delete', (req, res) => {
    const [name] = [req.body.result.name];
    pool.getConnection()
        .then((conn) => {
            conn.query(
                `update enroute.fix_points set isUsing=0 where pointname ='${name}'`,
            )
                .then((response) => {
                    res.send(response);
                    conn.end();
                    console.log(name, "name has been deleted.")
                })
                .catch((err) => {
                    res.send(err);
                    console.log(err);
                    console.log(err.sqlState, err.code);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});

router.get('/sector', function (req, res) {
    pool.getConnection()
        .then((conn) => {
            conn.query(
                'SELECT sectorname, sectorlng, sectorlat FROM enroute.sector where sectorlng not between 0.5 and 1.5 group by sectorname;',
            )
                .then((response) => {
                    res.send(response);
                    conn.end();
                })
                .catch((err) => {
                    console.error(err);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});

router.get('/sector/name/:name', (req, res) => {
    const name = req.params.name;
    pool.getConnection()
        .then((conn) => {
            conn.query(
                `select count(sectorname) as count from enroute.sector where sectorname = '${name}'`,
            )
                .then((response) => {
                    console.log(response.count);
                    res.send(response);
                    conn.end();
                })
                .catch((err) => {
                    res.send(err);
                    console.log(err);
                    console.log(err.sqlState, err.code);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
})

router.post('/sector/add', (req, res) => {
    const body = req.body.result;
    pool.getConnection()
        .then((conn) => {
                for (let i in body.data) {
                    conn.query(
                        `insert into enroute.sector values('${body.sectorName}',${parseInt(i) + 1},${body.data[i].sectorLat},${body.data[i].sectorLng});`)
                }
                conn.end();
            }
        ).then((response) => res.send(response))
        .catch(err => {
            console.log(err);
        })
});

router.post('/sector/edit', (req, res) => {
    const body = req.body.result;
    pool.getConnection()
        .then((conn) => {
            conn.query(`delete from enroute.sector where sectorname='${body.beforeName}';`)
                .catch(err => {
                    console.log(err);
                    conn.end();
                });
            for (let i in body.data) {
                conn.query(`insert into enroute.sector values('${body.sectorName}',${parseInt(i) + 1},${body.data[i].sectorLat},${body.data[i].sectorLng});`)
                    .then((response) => {
                        conn.end();
                    })
                    .catch(err => {
                        res.sendStatus(501);
                        console.log(err);
                        conn.end();
                    })
            }
            res.sendStatus(200);
        })
});

router.post('/sector/edit/open', (req, res) => {
    const sector = req.body.result.sector;
    pool.getConnection()
        .then((conn) => {
            conn.query(`select  sectorname, sectorlat, sectorlng, sectorarea, entry from enroute.sector, sector_att where sectorname=sectorname_fk and sectorname = '${sector}';`)
                .then(response => {
                    res.send(response);
                    conn.end();
                })
                .catch(err => {
                    console.log(err);
                    conn.end();
                })
        })
});

router.post('/sector/delete', (req, res) => {
    const body = req.body.result;
    pool.getConnection()
        .then((conn) => {
            conn.query(`delete from enroute.sector where sectorname='${body.sectorName}';`)
                .then(response => {
                    res.send(response);
                    conn.end();
                })
                .catch(err => {
                    console.log(err);
                    conn.end();
                })
        })
});


router.get('/route', (req, res) => {
    pool.getConnection()
        .then((conn) => {
            conn.query(`select air_route from enroute.route group by air_route`)
                .then(resp => {
                    res.send(resp);
                    conn.end();
                })
                .catch(err => {
                    console.error(err);
                    conn.end();
                })
        })
});

router.post('/route/add', (req, res) => {
    const result = req.body.result;
    pool.getConnection()
        .then((conn) => {
                for (let i in result.data) {
                    conn.query(
                        `insert into enroute.route values('${result.routeName}','${result.data[i].fix}',${result.data[i].low},${result.data[i].high},${parseInt(i) + 1},'INCHEON FIR','RNAV');`,
                        (err, results) => {
                            if (err) {
                                throw Error(`${result.data[i].fix}`)
                            }
                        })
                }
                conn.end();
            }
        )
        .catch(err => {
            console.log(err);
        })
});

router.post('/route/edit', (req, res) => {
    const result = req.body.result;
    pool.getConnection()
        .then((conn) => {
            conn.query(`delete from enroute.route where air_route='${result.beforeName}';`)
                .catch(err => {
                    console.log(err);
                    conn.end();
                });
            for (let i in result.data) {
                conn.query(`insert into enroute.route values('${result.routeName}','${result.data[i].fix}',${result.data[i].low},${result.data[i].high},${parseInt(i) + 1},'INCHEON FIR','RNAV');`)
                    .then((response) => {
                        conn.end();
                    })
                    .catch(err => {
                        res.sendStatus(501);
                        console.log(err);
                        conn.end();
                    })
            }
            res.sendStatus(200);
        })
});

router.post('/route/edit/open', (req, res) => {
    const result = req.body.result;
    pool.getConnection()
        .then((conn) => {
            conn.query(`select air_route, fixpoint name, pointlat lat, pointlng lng, low_height low, high_height high, entry, fir, type from
             enroute.route, enroute.fix_points where route.fixpoint = fix_points.pointname and air_route='${result.name}' order by entry`)
                .then(resp => {
                    res.send(resp);
                    conn.end();
                })
                .catch(err => {
                    console.error(err);
                    conn.end();
                })
        })
});

router.get('/route/name/:name', (req, res) => {
    const name = req.params.name;
    pool.getConnection()
        .then((conn) => {
            conn.query(
                `select count(air_route) as count from enroute.route where air_route = '${name}'`,
            )
                .then((response) => {
                    console.log(response.count);
                    res.send(response);
                    conn.end();
                })
                .catch((err) => {
                    res.send(err);
                    console.log(err);
                    console.log(err.sqlState, err.code);
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});

router.post('/route/delete', (req, res) => {
    const body = req.body.result;
    pool.getConnection()
        .then((conn) => {
            conn.query(`delete from enroute.route where air_route='${body.routeName}';`)
                .then(response => {
                    res.send(response);
                    conn.end();
                })
                .catch(err => {
                    console.log(err);
                    conn.end();
                })
        })
});


module.exports = router;
