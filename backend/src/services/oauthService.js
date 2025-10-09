const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/app.config');


const generateToken = (user) =>{
  return jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
}

module.exports = { generateToken };
