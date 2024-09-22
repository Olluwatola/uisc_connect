import cloudinary from "../configs/cloudinaryConfig";
import { CloudinaryUploadOptions } from "../interfaces/cloudinary";
import { paginate } from "mongoose-paginate-v2";
import nodemailer from "nodemailer";
import {
  smtpPass,
  smtpUser,
  nodemailerFromEmail,
  jwtSecret,
  jwtIssuer,
} from "./../utils/constants";
import jwt from "jsonwebtoken";
import path from "path";
import ejs from "ejs";
import FCM from "../configs/pushNotifications";
import mongoose from "mongoose";
import {
  Message,
  MulticastMessage,
} from "firebase-admin/lib/messaging/messaging-api";
import { getMessaging } from "firebase-admin/messaging";

export const generateUserJWT = (
  //user: UserDocument,
  duration?: string
): string => {
  return jwt.sign(
    {
      //   id: user.id,
      //   user_type: user.type,
    },
    jwtSecret as string,
    {
      issuer: jwtIssuer,
      expiresIn: duration || "1000 days",
    }
  );
};

export const sendMail = async (
  userEmail: string,
  subject: string,
  body: string
) => {
  const transporter = nodemailer.createTransport({
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  return await transporter.sendMail({
    from: nodemailerFromEmail,
    to: userEmail,
    subject: subject,
    html: body,
  });
};

export const sendEmailUsingTemplate = async (
  templateName: string,
  userEmail: string,
  subject: string,
  data: any
) => {
  // Path to the EJS template folder
  const templatePath = path.join(
    "src",
    "utils",
    "templates",
    `${templateName}.ejs`
  );

  // Render the EJS template with provided data
  const emailHtml: string = await ejs.renderFile(templatePath, data);

  // Send the email using the sendMail function
  await sendMail(userEmail, subject, emailHtml);
};

export const uploadMediaToCloudinary = async (
  category: string,
  userIdOrEntity: string,
  files: Express.Multer.File[]
): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    // Build a safe public ID
    const safePublicId = userIdOrEntity + file.filename + Date.now();

    // Determine the resource type (image or video)
    const resourceType = file.mimetype.startsWith("video/") ? "video" : "image";

    // Build upload options
    let options: CloudinaryUploadOptions = {
      folder: category.trim() + "/" + userIdOrEntity.trim(),
      public_id: safePublicId,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      resource_type: resourceType, // Set the resource type
    };

    if (category === "profileImageThumbnails") {
      options.transformation = [
        {
          width: 150,
          height: 150,
          crop: "thumb",
        },
      ];
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, options);

    return result.secure_url;
  });

  // Wait for all uploads to complete
  return await Promise.all(uploadPromises);
};

export const removeMediaFromCloudinary = async (url: string): Promise<void> => {
  function extractPublicId(publicUrl: string) {
    // Split the URL by '/' to get the parts
    const urlParts = publicUrl.split("/");

    // Get the last part, which is the filename with the format (e.g., "sample_image.jpg")
    const fileNameWithFormat = urlParts[urlParts.length - 1];

    // Split the filename by '.' to separate the public_id and the format
    const fileNameParts = fileNameWithFormat.split(".");

    // The public_id is the first part
    const publicId = fileNameParts[0];

    return publicId;
  }
  const publicId = extractPublicId(url);

  await cloudinary.uploader.destroy(publicId, { invalidate: true });
};

export const capitalize = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const sendNotification = async (
  message: Message,
  //user: UserDocument,
  sendPushNotification: boolean = true
) => {
  //   if (user.hasPushNotifications === false || !sendPushNotification) {
  //     return;
  //   }
  await FCM.send(message);
  return;
};

export const sendChatroomNotification = async (
  message: MulticastMessage,
  chatroomId: string,
  arrayOfTokens: string[],
  sendPushNotification: boolean = true
) => {
  // Send push notification if enabled
  if (sendPushNotification && arrayOfTokens.length > 0) {
    // Construct the notification payload
    const payload = message;

    // Send the notification to the provided tokens
    const response = await getMessaging().sendEachForMulticast(payload);

    const failedTokens: string[] = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        failedTokens.push(arrayOfTokens[idx]);
      }
    });
  }
};

export const formattedPaginatedResponse = <T>(
  statSource: mongoose.PaginateResult<any>,
  docs: T[]
): {
  totalPages: number;
  currentPage: number;
  totalItems: number;
  items: T[];
} => {
  return {
    totalPages: statSource.totalPages,
    currentPage: statSource.page as number,
    totalItems: statSource.totalDocs,
    items: docs,
  };
};
