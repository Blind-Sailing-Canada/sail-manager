module.exports = {
  'type': process.env.DB_TYPE,
  'url': process.env.DB_CONNECTION_STRING,
  'synchronize': false,
  'logging': false,
  'migrations': ['./src/migration/*.ts'],
  'cli': { 'migrationsDir': './src/migration' },
};

