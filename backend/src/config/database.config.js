const developmentDatabaseConfig = {
  databaseUrl:
    process.env.DEV_DATABASE_URL ||
    'postgres://user:password@localhost:5432/mydatabase',
};

const productionDatabaseConfig = {
  databaseUrl:
    process.env.PROD_DATABASE_URL ||
    'postgresql://neondb_owner:npg_6wk8iAtQnJsb@ep-long-sound-adbi3w8a-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
};

const testDatabaseConfig = {
  databaseUrl:
    process.env.TEST_DATABASE_URL ||
    'postgres://user:password@localhost:5432/mydatabase',
};

const databases = {
  dev: developmentDatabaseConfig,
  prod: productionDatabaseConfig,
  test: testDatabaseConfig,
};

const environment = process.env.NODE_ENV || 'dev';

module.exports = databases[environment] || databases.dev;
