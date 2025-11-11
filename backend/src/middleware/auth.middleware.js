const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/app.config');

const authenticate = (req, res, next) => {
  const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
  // if (!authHeader) return res.status(401).json({ message: 'Token is required' });

  // const token = authHeader.split(' ')[1]; 
  if (!token) return res.status(401).json({ message: 'Token is required' });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    console.log('Decoded token:', decoded)

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;