const express = require('express')
const { signUp, verifyOTP, signIn ,getall, deleteUserByEmail} = require('../controllers/authController')


const router = express.Router()

router.post('/signup', signUp)
router.post('/verify-otp', verifyOTP)
router.post('/signin', signIn)
router.get('/users',getall)
router.delete('/del/:email',deleteUserByEmail)

module.exports = router
