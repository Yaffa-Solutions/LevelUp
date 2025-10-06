// require('dotenv').config() 
// const prisma = require('../config/db');
// const generateOTP = require('../utils/generateOTP');
// const { sendOTP } = require('../services/emailService');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { jwtSecret } = require('../config/app.config');

// let otpStore = {}

// async function signUp(req, res) {
//   const { email, password } = req.body
//   try {
//     const existingUser = await prisma.user.findUnique({ where: { email } })
//     if (existingUser) return res.status(400).json({ message: 'Email already exists' })

//     const hashedPassword = await bcrypt.hash(password, 10)
//     const user = await prisma.user.create({
//       data: { 
//         email, 
//         password: hashedPassword, 
//         first_name: 'Unknown', 
//         last_name: 'Unknown', 
//         role: 'TALENT', 
//         is_verified: false, 
//         level_id: 'c937bf29-6171-4637-9050-8408200f246a' 
//       }
//     })

//     const otp = generateOTP()
//     otpStore[email] = otp
//     await sendOTP(email, otp)

//     res.json({ message: 'User created, OTP sent', email: user.email })
//   } catch (err) {
//     console.error('Prisma error:', err)
//     res.status(500).json({ message: err.message })
//   }
// }

// // async function verifyOTP(req, res) {
// //   const { email, otp } = req.body

// //   if (otpStore[email] !== otp) 
// //     return res.status(400).json({ message: 'Invalid OTP' })

// //   delete otpStore[email]

// //   // const user = await prisma.user.findUnique({ where: { email } })
// //   const user = await prisma.user.findUnique({ where: { email }})

// //   console.log(user.id)

// //   if (!user) return res.status(404).json({ message: 'User not found' })

// //   const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
// //   res.json({ message: 'OTP verified', token })
// // }
// async function verifyOTP(req, res) {
//   const { email, otp } = req.body

//   if (!otpStore[email]) 
//     return res.status(400).json({ message: 'No OTP found for this email' })

//   if (otpStore[email] !== otp) 
//     return res.status(400).json({ message: 'Invalid OTP' })

//   delete otpStore[email]

//   const user = await prisma.user.findUnique({ where: { email } })

//   if (!user) 
//     return res.status(404).json({ message: 'User not found' })

//   console.log(user.id) // حطيه بعد ما تتأكد user موجود

//   const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
//   res.json({ message: 'OTP verified', token })
// }


// async function signIn(req, res) {
//   const { email, password } = req.body
//   try {
//     const user = await prisma.user.findUnique({ where: { email } })
//     if (!user) return res.status(404).json({ message: 'User not found' })

//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
//     res.json({ message: 'Login successful', token })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }

// const getAll = async (req, res) => {
//   try {
//     const users = await prisma.user.findMany()
//     res.json(users)
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }

// async function deleteUserByEmail(req, res) {
//   const { email } = req.params
//   try {
//     const user = await prisma.user.findUnique({ where: { email } })
//     if (!user) return res.status(404).json({ message: 'User not found' })

//     await prisma.user.delete({ where: { email } })
//     res.json({ message: `User ${email} deleted successfully` })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }

// module.exports = { signUp, verifyOTP, signIn, getAll, deleteUserByEmail }


require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const generateOTP = require('../utils/generateOTP')
const { sendOTP } = require('../services/emailService')

let otpStore = {}

// SignUp
async function signUp(req, res) {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) return res.status(400).json({ message: 'Email already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        first_name: 'Unknown',
        last_name: 'Unknown',
        role: 'TALENT',
        is_verified: false,
        level_id: 'c937bf29-6171-4637-9050-8408200f246a'
      }
    })

    const otp = generateOTP()
    otpStore[email] = otp
    await sendOTP(email, otp)

    res.json({ message: 'User created, OTP sent', email: user.email })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

// Verify OTP
async function verifyOTP(req, res) {
  const { email, otp } = req.body
  console.log('Email received:', email)
  console.log('OTP received:', otp)

  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' })

  if (!otpStore[email]) return res.status(400).json({ message: 'No OTP found for this email' })
  if (otpStore[email] !== otp) return res.status(400).json({ message: 'Invalid OTP' })

  delete otpStore[email]

  const user = await prisma.User.findUnique({ where: { email } })
  if (!user) return res.status(404).json({ message: 'User not found' })

  console.log('User found:', user)

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
  res.json({ message: 'OTP verified', token })
}

// SignIn
async function signIn(req, res) {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.json({ message: 'Login successful', token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

module.exports = { signUp, verifyOTP, signIn }
