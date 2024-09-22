import dotenv from "dotenv";
import * as process from "process";
dotenv.config();

//BASIC CONFIGS
export const portNumber: string | undefined = process.env.PORT;
export const environment: string | undefined = process.env.ENVIRONMENT;
export const mongoUri: string | undefined = process.env.MONGO_URI;

//JWT CONSTANTS
export const jwtIssuer: string | undefined = process.env.JWT_ISSUER;
export const jwtSecret: string | undefined = process.env.JWT_SECRET;

//CLOUDINARY CONSTANTS
export const cloudinaryCloudName: string | undefined = process.env.CLOUDINARY_CLOUDNAME;
export const cloudinaryApiKey: string | undefined = process.env.CLOUDINARY_API_KEY;
export const cloudinaryApiSecret: string | undefined = process.env.CLOUDINARY_API_SECRET;

//SMTP & NODEMAILER CONSTANTS
export const smtpPass: string | undefined = process.env.SMTP_PASS;
export const smtpUser: string | undefined = process.env.SMTP_USER;
export const nodemailerFromEmail: string | undefined = process.env.NODEMAILER_FROM_EMAIL;

//FIREBASE ADMIN
export const firebaseAdminApi: string | undefined = process.env.FIREBASE_ADMIN_API;