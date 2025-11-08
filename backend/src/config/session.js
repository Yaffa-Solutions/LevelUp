const session = require('express-session');

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: true
});

module.exports = sessionConfig;
