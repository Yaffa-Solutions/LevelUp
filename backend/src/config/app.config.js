require('env2')('.env');


module.exports = {
  appName: 'LevelUp',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'defaultsecret',
  SALT_ROUNDS:process.env.SALT_ROUNDS || '10',
};