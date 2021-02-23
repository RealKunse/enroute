const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000

const DBRouter = require('./express/DBRoute');

app.use(cors());
app.use('/db/', DBRouter);

    app.get('/hi', function (req, res) {
        res.send('Hello World!');
    });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

