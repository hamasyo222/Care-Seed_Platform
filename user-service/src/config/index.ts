import dotenv from 'dotenv';
dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 3002,
    host: '0.0.0.0',
    env: process.env.NODE_ENV || 'development',
  },
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'your-super-secret-access-key',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
};
