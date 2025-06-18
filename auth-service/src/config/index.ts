import dotenv from 'dotenv';
dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development',
  },
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'your-super-secret-access-key',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'your-super-secret-refresh-key',
    accessTokenExpiresIn: '15m',
    refreshTokenExpiresIn: '7d',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
};
