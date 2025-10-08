const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/app.config');

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token is required' });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;