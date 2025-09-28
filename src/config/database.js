import mysql from 'mysql2';
import { Sequelize } from 'sequelize';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'ai-cas';

// Sequelize
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
});

// Mysql pool
export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: DB_PORT,
});

// Test connection
sequelize.authenticate()
  .then(() => console.log('✅ Connected to XAMPP MySQL'))
  .catch(err => console.error('❌ DB connection error:', err));
