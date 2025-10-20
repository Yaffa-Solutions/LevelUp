require('dotenv').config() 
const nodemailer = require('nodemailer');
ؤي 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) console.error('SMTP connection failed:', error)
  else console.log('SMTP connected successfully')
})

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