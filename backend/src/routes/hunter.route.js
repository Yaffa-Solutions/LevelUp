const express = require('express');
const { getHunters } = require('../controllers/hunter.controller');

const router = express.Router();

router.get('/hunters', getHunters);

module.exports = router;