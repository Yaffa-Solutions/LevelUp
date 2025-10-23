const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../controllers/upload.controller.js');

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('file'), uploadImage);

module.exports = router;
