const express = require('express');
const router = express.Router();
const fileController = require('../controller/fileController');

router.post('/upload', fileController.uploadFile);

module.exports = router;