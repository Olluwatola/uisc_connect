import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { send400 } from "./../handlers/responseHandlers";
import AppError from "../utils/appError";

const storage = multer.diskStorage({});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else if (file.mimetype.startsWith("video/")) {
    cb(null, true); // Allow video files
  } else {
    cb(new Error("Invalid file type! Please upload an image or video."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 90 }, // 50MB limit for all files
});

const handleMulterErrors =
  (
    uploadMiddleware: multer.Multer,
    fields: { name: string; maxCount: number }[]
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    const handler = uploadMiddleware.fields(fields);

    handler(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        let errorMessage: string;
        switch (err.code) {
          case "LIMIT_FILE_SIZE":
            errorMessage = "File too large. Maximum size is 50MB";
            break;
          case "LIMIT_FILE_COUNT":
            errorMessage = "Too many files uploaded";
            break;
          case "LIMIT_UNEXPECTED_FILE":
            errorMessage = "Unexpected file format";
            break;
          default:
            errorMessage = err.message;
            break;
        }
        send400(res, errorMessage);
        return;
      } else if (err) {
        if (
          err.message === "Invalid file type! Please upload an image or video."
        ) {
          send400(
            res,
            "Invalid content type. Please upload an image or video file."
          );
        } else {
          next(new AppError("error in multer", 500));
        }
        return;
      }
      next();
    });
  };

export const handleImageUpload = handleMulterErrors(upload, [
  {
    name: "profileImage",
    maxCount: 1,
  },
  //   {
  //     name: "chatroomImage",
  //     maxCount: 1,
  //   },
  {
    name: "images",
    maxCount: 1,
  },
  { name: "resume", maxCount: 1 },
  {
    name: "gallery",
    maxCount: 10,
  },
]);
