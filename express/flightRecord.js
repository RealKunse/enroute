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
        .catch((err) => console.log('not connected'));
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
                    conn.end();
                });
        })
        .catch((err) => console.log('not connected'));
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
where a.TestName_FK = b.TestName
${req.body.result.site != '전체' ? 'and' + site : ''} ${freq.length != 0 ? 'and' + freq : ''} ${name.length != 0 ? 'and' + name : ''} ${date.length != 0 ? 'and' + date : ''}
;`;

    // if (site == '선택' && freq == '선택') {
    //     sql = `select id, sitename_fk, frequency_fk, testname_fk, txmain, rxmain, txstby, rxstby, angle, distance, height from enroute.flight_test_result where testname_fk = '${name}'`;
    // } else if (site != '전체' && freq == '전체') {
    //     sql = `select id, sitename_fk, frequency_fk, testname_fk, txmain, rxmain, txstby, rxstby, angle, distance, height from enroute.flight_test_result where testname_fk = '${name}' and sitename_fk = '${site}'`;
    // } else if (site == '전체' && freq != '전체') {
    //     sql = `select id, sitename_fk, frequency_fk, testname_fk, txmain, rxmain, txstby, rxstby, angle, distance, height from enroute.flight_test_result where testname_fk = '${name}' and frequency_fk = ${
    //         Math.round(freq * 1000) / 1000
    //     }`;
    // } else {
    //     sql = `select id, sitename_fk, frequency_fk, testname_fk, txmain, rxmain, txstby, rxstby, angle, distance, height from enroute.flight_test_result where testname_fk = '${name}' and sitename_fk = '${site}' and frequency_fk = ${
    //         Math.round(freq * 1000) / 1000
    //     }`;
    // }

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
                `insert into flight_test_list (testname, testdate, testtype, testroute, testroutefile) values('${
                    body.testName
                }', '${body.testDate}', '${body.testType}' , '${
                    body.testRoute
                }', ${
                    body.testRouteFile == undefined ? null : body.testRoute
                })`,
            )
                .then((res) => {
                    console.log(res);

                    for (let i = 0; i < Object.keys(body.data).length; i++) {
                        conn.query(
                            `insert into flight_test_result (sitename_fk, frequency_fk, testname_fk, txmain, rxmain, txstby, rxstby, angle, distance, height) 
            values(
            '부안',
             '${body['data'][i]['frequency']}', '${body.testName}', '${body['data'][i]['txmain']}', '${body['data'][i]['rxmain']}', '${body['data'][i]['txstby']}', '${body['data'][i]['rxstby']}', '${body['data'][i]['angle']}', '${body['data'][i]['distance']}', '${body['data'][i]['height']}');`,
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
    console.log(req.body.result);

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


module.exports = router;
