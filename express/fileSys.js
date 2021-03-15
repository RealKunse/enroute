const express  = require('express');
const router   = express.Router();
// const multer = require('multer');

//
// var storage  = multer.diskStorage({ // 2
//     destination(req, file, cb) {
//         cb(null, 'uploadedFiles/');
//     },
//     filename(req, file, cb) {
//         cb(null, `${Date.now()}__${file.originalname}`);
//     },
// });

// const upload = multer({ dest:'uploadFiles/'});
// const upload = multer({storage: multer.memoryStorage()});




module.exports = router;