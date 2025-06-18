export default () => ({
  port: parseInt(process.env.PORT, 10) || 3004,
  database: { url: process.env.DATABASE_URL },
  jwt: { secret: process.env.ACCESS_TOKEN_SECRET || 'your-super-secret-access-key' },
});
