const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const  authenticate  = require('../middleware/auth.middleware'); 

router.post('/signup', authController.signUp);
router.post('/verify-otp', authController.verifyOTP);
router.post('/signin', authController.signIn);
router.get('/', authenticate, authController.getAll);
router.delete('/:email', authenticate, authController.deleteUserByEmail);

module.exports = router;
