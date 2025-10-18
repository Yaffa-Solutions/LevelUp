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
      level_id: 'c937bf29-6171-4637-9050-8408200f246a'
    }
  });
  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; 
  otpStore.set(email, { otp, expiresAt });
  await sendOTP(email, otp);

  return user;
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

  return generateToken(user.id);
}

const signIn = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  return generateToken(user.id);
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

module.exports = { signUp, verifyOTP, signIn, getAllUsers, deleteUserByEmail  };
