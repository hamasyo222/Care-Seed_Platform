export default () => ({
  port: parseInt(process.env.PORT, 10) || 3003,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.ACCESS_TOKEN_SECRET || 'your-super-secret-access-key',
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    s3: {
      bucket: process.env.AWS_S3_BUCKET_NAME,
    }
  },
});
