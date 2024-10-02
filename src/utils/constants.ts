import dotenv from "dotenv";
import * as process from "process";
dotenv.config();

//BASIC CONFIGS
export const portNumber: string | undefined = process.env.PORT;
export const environment: string | undefined = process.env.ENVIRONMENT;
export const mongoUri: string | undefined = process.env.MONGO_URI;
export const productName: string | undefined = "UISC_Connect";

//JWT CONSTANTS
export const jwtIssuer: string | undefined = process.env.JWT_ISSUER;
export const jwtSecret: string | undefined = process.env.JWT_SECRET;
export const jwtCookieExpiresAfter: string | undefined =
  process.env.JWT_COOKIE_EXPIRES_AFTER;
export const forgotPasswordJwtCookieExpiresAfter: string | undefined =
  process.env.FORGOTPASSWORD_JWT_COOKIE_EXPIRES_AFTER;
export const forgotPasswordJwtIssuer: string | undefined =
  process.env.FORGOTPASSWORD_JWT_ISSUER;
export const forgotPasswordJwtSecret: string | undefined =
  process.env.FORGOTPASSWORD_JWT_SECRET;

//CLOUDINARY CONSTANTS
export const cloudinaryCloudName: string | undefined =
  process.env.CLOUDINARY_CLOUD_NAME;
export const cloudinaryApiKey: string | undefined =
  process.env.CLOUDINARY_API_KEY;
export const cloudinaryApiSecret: string | undefined =
  process.env.CLOUDINARY_API_SECRET;

//SMTP & NODEMAILER CONSTANTS
export const smtpPass: string | undefined = process.env.SMTP_PASS;
export const smtpUser: string | undefined = process.env.SMTP_USER;
export const nodemailerFromEmail: string | undefined =
  process.env.NODEMAILER_FROM_EMAIL;

//FIREBASE ADMIN
export const firebaseAdminApi: string | undefined =
  process.env.FIREBASE_ADMIN_API;
