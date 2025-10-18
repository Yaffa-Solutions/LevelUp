const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/app.config');


const generateToken = (user) =>{
  return jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
}

const destroySession = (req, res) => {
  return new Promise((resolve) => {
    req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie('connect.sid'); 
        res.clearCookie('token');       
        resolve();
      });
    });
  });
}

module.exports = { 
  generateToken,
  destroySession,
 };
