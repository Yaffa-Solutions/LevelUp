const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signUp);
router.post('/verify-otp', authController.verifyOTP);
router.post('/signin', authController.signIn);
router.get('/', authController.getAll);
router.delete('/:email', authController.deleteUserByEmail);

module.exports = router;
