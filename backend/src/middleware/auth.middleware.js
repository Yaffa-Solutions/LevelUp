const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { isTokenBlacklisted } = require('./tokenBlackList');
const { jwtSecret } = require('../config/app.config');

const authenticate = async (req, res, next) => {
  const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
 
  if (!token) return res.status(401).json({ message: 'Token is required' });

  try {

    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    const decoded = jwt.verify(token, jwtSecret);
    console.log('Decoded token:', decoded)

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ message: 'User no longer exists' });

    // req.user = decoded;
    req.user = { 
      userId: user.id, 
      is_profile_complete: user.is_profile_complete 
    };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;