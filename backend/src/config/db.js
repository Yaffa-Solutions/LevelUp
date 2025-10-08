// const { PrismaClient } = require('@prisma/client');
const {PrismaClient}  = require('../generated/prisma'); 
const databaseConfig = require('./database.config');

const prisma = new PrismaClient({
  datasources: {
    db: { url: databaseConfig.databaseUrl }
  }
})

module.exports = prisma;
