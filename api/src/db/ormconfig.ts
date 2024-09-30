import { DataSource } from 'typeorm';
import dotenv = require('dotenv');
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

const devConfig: PostgresConnectionOptions = {
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/db/migrations/*.ts'],
  migrationsTableName: 'migrations',
  namingStrategy: new SnakeNamingStrategy(),
  type: 'postgres',
  url: process.env.DATABASE_URL,
};

const prodConfig: PostgresConnectionOptions = {
  extra:  { ssl: { rejectUnauthorized: false } },
  migrations: ['./db/migrations/*.js'],
  migrationsTableName: 'migrations',
  namingStrategy: new SnakeNamingStrategy(),
  ssl: true,
  type: 'postgres',
  url: process.env.DATABASE_URL,
};

const config = process.env.NODE_ENV === 'prod' ? prodConfig : devConfig;
const source = new DataSource(config);

export default source;
