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
                })
                .then((res) => {
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
                    conn.end();
                });
        })
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
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
});

router.post('/second/search', (req, res) => {
    const site = ` sitename_fk='${req.body.result.site}'`;
    const freq = req.body.result.freq == '' ? '' : ` frequency_fk like '%${req.body.result.freq}%'`;
    const name = req.body.result.name == '' ? '' : ` testname_fk like '%${req.body.result.name}%'`;
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

    let sql;
    sql = `SELECT id, sitename_fk, frequency_fk, testname_fk, testDate,txmain, rxmain, txstby, rxstby, angle, distance, height 
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


router.post('/list/add', (req, res) => {
    const body = req.body.result;
    pool.getConnection()
        .then((conn) => {
            conn.query(
                `insert into flight_test_list (testname, testdate, testtype, testroute, testroutefile) values('
                ${body.testName}', '${body.testDate}', '${body.testType}' , '${body.testRoute}', ${body.testRouteFile == undefined ? null : body.testRoute})`,
            )
                .then((res) => {
                    console.log(res);

                    for (let i = 0; i < Object.keys(body.data).length; i++) {
                        conn.query(
                            `insert into flight_test_result (sitename_fk, frequency_fk, testname_fk, txmain, rxmain, txstby, rxstby, angle, distance, height)
                             values('부안','${body['data'][i]['frequency']}', '${body.testName}', '${body['data'][i]['txmain']}', '${body['data'][i]['rxmain']}', '${body['data'][i]['txstby']}', '${body['data'][i]['rxstby']}', '${body['data'][i]['angle']}', '${body['data'][i]['distance']}', '${body['data'][i]['height']}');`,
                        )
                            .then((res) => {
                                console.log(res);
                            })
                            .catch((err) => {
                                console.log(err);
                                conn.end();
                            });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => {
            console.log(err);
            conn.end();
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

router.post('/freq/add', function (req, res) {
    const [site, freq, sector] = [req.body.result.site, req.body.result.freq, req.body.result.sector];

    pool.getConnection()
        .then((conn) => {
            conn.query(
                `insert into enroute.frequency values ('${freq}','${site}','${sector}',null,null,1)`,
            )
                .then((response) => {
                    // res.send(response);
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
                    // res.send(response);
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
                    // res.send(response);
                    conn.end()
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
                    // res.send(response);
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
                    // res.send(response);
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
                'SELECT sectorname FROM enroute.sector group by sectorname;',
            )
                .then((response) => {
                    res.send(response);
                })
                .then((res) => {
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
                })
            for (let i in body.data) {
                conn.query(`insert into enroute.sector values('${body.sectorName}',${parseInt(i) + 1},${body.data[i].sectorLat},${body.data[i].sectorLng});`)
                    .then((response) => {
                        res.send(response);
                        conn.end();
                    })
                    .catch(err => {
                        console.log(err);
                        conn.end();
                    })
            }
        })
});

router.post('/sector/edit/open', (req, res) => {
    const sector = req.body.result.sector;
    pool.getConnection()
        .then((conn) => {
            conn.query(`select sectorlat, sectorlng from enroute.sector where sectorname = '${sector}';`)
                .then(response => {
                    res.send(response)
                })
                .catch(err => console.log(err))
        })
})

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
        .then((conn) =>{
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

router.post('/route/edit/open', (req, res) => {
    const result = req.body.result;
    pool.getConnection()
        .then((conn) =>{
            conn.query(`select fixpoint name, low_height low, high_height high from enroute.route where air_route='${result.name}'`)
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
})



module.exports = router;
