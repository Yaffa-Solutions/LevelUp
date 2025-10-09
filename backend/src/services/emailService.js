require('dotenv').config() 
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendOTP = async (email, otp) =>{
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Your verification code',
    text: `Your OTP code is ${otp}`,
    html: `<p>Your OTP code is <strong>${otp}</strong></p>`,
  });
}

module.exports = { sendOTP };
