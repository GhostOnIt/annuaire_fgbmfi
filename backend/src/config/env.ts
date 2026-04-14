import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  JWT_EXPIRATION: '15m',
  JWT_REFRESH_EXPIRATION: '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};
