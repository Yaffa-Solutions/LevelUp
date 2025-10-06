// const twilio = require('twilio')
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
// const FROM_PHONE = process.env.TWILIO_PHONE_NUMBER

// const sendOTP = async (phone, otp) =>{
//   return client.messages.create({
//     body: `Your verification code is ${otp}`,
//     from: FROM_PHONE,
//     to: phone
//   })
// }

// module.exports = { sendOTP }
require('dotenv').config() 
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function sendOTP(email, otp) {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Your verification code',
    text: `Your OTP code is ${otp}`,
    html: `<p>Your OTP code is <strong>${otp}</strong></p>`,
  });
}

module.exports = { sendOTP };
