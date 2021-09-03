const express = require('express');
const router = express.Router();

const ctrIndex = require('../controllers/index.controller');
router.get('/', ctrIndex.home);
router.post('/createFile', ctrIndex.create);
router.get('/viewFile/:file', ctrIndex.download);
router.delete('/deleteFile',ctrIndex.delete);

module.exports = router;