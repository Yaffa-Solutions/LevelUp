const authService = require('../services/authService');
const jwt = require('jsonwebtoken');
const { addTokenToBlacklist } = require('../middleware/tokenBlackList');
const { jwtSecret } = require('../config/app.config');
const bcrypt = require('bcryptjs');
const userService = require('../services/userService');
const { sendOTP } = require('../services/emailService'); 


const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await authService.signUp(email, password);
    res.clearCookie('token');
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    });
    
    res.status(201).json({
      message: 'User created, OTP sent',
      email: user.email
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log('REQ BODY:', req.body)
    if (!email || !otp)
      return res.status(400).json({ message: 'Email and OTP required' });

    const { user, token }   = await authService.verifyOTP(email, otp);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    });
    
    res.status(200).json({
      message: 'OTP verified successfully',
      token,
      is_profile_complete: user.is_profile_complete
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const handleResendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    await authService.resendOTP(email);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const result = await authService.signIn(email, password);

    if (result.status === 'VERIFY_EMAIL') {
      return res.status(200).json({
        status: 'VERIFY_EMAIL',
        message: 'OTP sent to your email',
        email: result.email
      });
    }

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    if (!result.is_profile_complete) {
      return res.status(200).json({
        status: 'PROFILE_INCOMPLETE',
        message: 'Profile not complete',
        redirect: '/create-profile',
        token: result.token,
        email: result.email,
        id: result.id
      });
    }

    // كل شيء تمام → الهوم
    res.status(200).json({
      message: 'Login successful',
      redirect: '/home',
      token: result.token,
      is_profile_complete: result.is_profile_complete,
      email: result.email,
      id: result.id,
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const getAll = async (req, res) => {
  try {
    const users = await authService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

const deleteUserByEmail = async (req, res) => {
  const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ message: 'Email required' });

    await authService.deleteUserByEmail(email);
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.exp) {
        await addTokenToBlacklist(token, decoded.exp);
      }
    } 
    res.clearCookie('token');
    res.status(200).json({ message: `User ${email} deleted successfully` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  signUp,
  verifyOTP,
  handleResendOTP,
  signIn,
  getAll,
  deleteUserByEmail
};
