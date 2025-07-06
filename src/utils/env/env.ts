import * as dotenv from 'dotenv';

dotenv.config();
const DB_PORT = +process.env.DB_PORT || 5433;
const DB_HOST = process.env.DB_HOST || '';
const DB_USER = process.env.DB_USERNAME || '';
const DB_DB = process.env.DB_DATABASE || '';
const DB_PASS = process.env.DB_PASSWORD || '';
const DB_SCHEMA = process.env.DB_SCHEMA || '';

const JWT_SECRET = process.env.JWT_SECRET || '';
const PORT = process.env.PORT || 3000;

const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

if (!DB_SCHEMA || !DB_HOST || !DB_USER || !DB_DB || !DB_PASS || !JWT_SECRET) {
  throw new Error('Missing critical environment variables: DB_SCHEMA, DB_HOST, DB_USER, DB_DB, DB_PASS, JWT_SECRET');
} else {
  console.log('Environment variables are set');
}

export {
  JWT_SECRET,
  DB_SCHEMA,
  PORT,
  DB_PORT,
  DB_HOST,
  DB_USER,
  DB_DB,
  DB_PASS,
  SMTP_USER,
  SMTP_PASS,
};
