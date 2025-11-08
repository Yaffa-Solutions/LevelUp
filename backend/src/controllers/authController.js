const authService = require('../services/authService');
const jwt = require('jsonwebtoken');
const { addTokenToBlacklist } = require('../middleware/tokenBlackList');
const { jwtSecret } = require('../config/app.config');

const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await authService.signUp(email, password);
    res.clearCookie('token');
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });

    // حفظ التوكن في الكوكي
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // في production حطي true
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

    const user  = await authService.verifyOTP(email, otp);

    res.clearCookie('token');
    const token = await authService.verifyOTP(email, otp);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      // domain: 'localhost', 
      maxAge: 60 * 60 * 1000
    });
    
    res.status(200).json({
      message: 'OTP verified successfully',
      token
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

    const token = await authService.signIn(email, password);

    res.cookie('token', token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production', 
      secure: false,  
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 
    });

    res.status(200).json({
      message: 'Login successful',
      token
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
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ message: 'Email required' });

    await authService.deleteUserByEmail(email);
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
