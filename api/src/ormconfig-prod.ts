module.exports = {
  'type': process.env.DB_TYPE,
  'url': process.env.DB_CONNECTION_STRING,
  'synchronize': false,
  'logging': false,
  'migrations': ['./migration/*.js'],
  'ssl': true,
  'extra':  { ssl: { rejectUnauthorized: false } },
  'cli': { 'migrationsDir': './migration' },
};

