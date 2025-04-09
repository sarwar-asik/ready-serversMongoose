/* eslint-disable no-undef */
import dotenv from 'dotenv';
import path from 'path';
// dotenv.config({path:process.cwd()})

// dotenv.config({ path: path.join(process.cwd(), "env") });
dotenv.config({ path: path.join(process.cwd(), '.env') });

// console.log(process.env);

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  server_name: process.env.SERVER_NAME,
  allowed_origin: process.env.ALLOWED_ORIGINS,
  database_url: process.env.DB_URL,
  test_database_url: process.env.TEST_DATABASE_URL,
  https: process.env.HTTPS,
  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  server_url: process.env.SERVER_URL,
  smtp: {
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
    smtp_service: process.env.SMTP_SERVICE,
    smtp_mail: process.env.SMTP_MAIL,
    smtp_password: process.env.SMTP_PASSWORD,
    NAME: process.env.SERVICE_NAME,
  },
  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY,
  },
  superAdmin: {
    email: process.env.SUPERADMIN_EMAIL,
    password: process.env.SUPERADMIN_PASSWORD,
  },
  s3: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION,
  },
};
