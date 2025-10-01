const app = require('./app.config.js');
const databaseConfig = require('./database.config.js');

module.exports = {
  app,
  database: databaseConfig,
};
