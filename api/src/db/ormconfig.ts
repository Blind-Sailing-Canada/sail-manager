import { DataSource } from 'typeorm';
import dotenv = require('dotenv');
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config();

const devConfig: PostgresConnectionOptions = {
  migrations: ['src/db/migrations/*.ts'],
  migrationsTableName: 'migrations',
  type: 'postgres',
  entities: ['src/**/*.entity.ts'],
  url: process.env.DB_CONNECTION_STRING,
};

const prodConfig: PostgresConnectionOptions = {
  extra:  { ssl: { rejectUnauthorized: false } },
  migrations: ['./db/migrations/*.js'],
  migrationsTableName: 'migrations',
  ssl: true,
  type: 'postgres',
  url: process.env.DB_CONNECTION_STRING,
};

const config = process.env.NODE_ENV === 'prod' ? prodConfig : devConfig;
const source = new DataSource(config);

export default source;
