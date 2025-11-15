const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/app.config');
const { sendOTP } = require('./emailService'); 
const generateOTP = require('../utils/generateOTP');


const otpStore = new Map(); 
const generateToken = (userId) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' });
}

const signUp = async (email, password) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('Email already exists');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      first_name: 'Unknown',
      last_name: 'Unknown',
      role: 'TALENT',
      is_verified: false,
      // level_id,
      is_profile_complete: false,
    }
  });
  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; 
  otpStore.set(email, { otp, expiresAt });
  await sendOTP(email, otp);

  return user;
}

const resendOTP = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; 
  otpStore.set(email, { otp, expiresAt });

  await sendOTP(email, otp);
  return true;
}

const verifyOTP = async (email, otp) => {
  const record = otpStore.get(email);
  if (!record) throw new Error('No OTP sent');

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    throw new Error('OTP expired');
  }

  if (record.otp !== otp) throw new Error('Invalid OTP');

  
  otpStore.delete(email);

  const user = await prisma.user.update({
    where: { email },
    data: { is_verified: true }
  });

  const token =  generateToken(user.id);
  return { user, token };
}




const signIn = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  if (!user.is_verified) {
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; 
    otpStore.set(email, { otp, expiresAt });
    await sendOTP(email, otp);

    return { status: 'VERIFY_EMAIL', email };
  }

  if (!user.password) throw new Error('User password is missing');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = generateToken(user.id);
  return {
    token,
    is_profile_complete: user.is_profile_complete,
    is_verified: user.is_verified,
    email: user.email,
    id: user.id
  };
}
const getAllUsers = async () => {
  return await prisma.user.findMany();
}

const deleteUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  await prisma.user.delete({ where: { email } });
  return user;
}

module.exports = { signUp, verifyOTP, resendOTP, signIn, getAllUsers, deleteUserByEmail  };
