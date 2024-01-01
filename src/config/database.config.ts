import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import dotenv from 'dotenv';
dotenv.config();

const host = process.env.HOST
const database_port = parseInt(process.env.DATABASE_PORT)
const user_name = process.env.USER_NAME
const password = process.env.PASSWORD
const database = process.env.DATABASE

export const databaseConfig: PostgresConnectionOptions = {
  type: "postgres",
  host: host,
  port: database_port,
  username: user_name,
  password: password,
  database: database,
  synchronize: true,
  logging: false,
  entities: [
    'src/entities/**/*.ts'
  ],
  migrations: [
    'src/migrations/**/*.ts'
  ],
};
