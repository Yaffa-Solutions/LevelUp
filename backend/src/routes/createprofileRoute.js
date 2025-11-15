const express = require('express');
const router = express.Router();
const { createProfile } = require('../controllers/createprofileController');
const authenticate = require('../middleware/auth.middleware');

router.post('/save',authenticate, createProfile);

module.exports = router;
