const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth.middleware');
const userController = require('../controllers/userController');

router.get('/me', authenticate, userController.getMe);

module.exports = router;
