import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  NODE_ENV,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  JWT_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
  JWT_EXPIRES_IN,
  AUTH_EMAIL,
  AUTH_PASS,
  LOGGING,
  CLIENT_URL,
  SESSION_SECRET,
  DATABASE_URL,
  TERMII_API_KEY,
} = process.env;
