import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { send400, send404, sendResponse } from "../handlers/responseHandlers";
import Event from "../models/Event";
import {
  combineDateAndTime,
  uploadMediaToCloudinary,
} from "./../utils/helpers";
import EventTicket from "../models/EventTicket";
import UserEventTicket from "../models/UserEventTicket";
import Resume from "../models/Resume";

export const uploadResume = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fileUrl } = req.body; // Assuming the file has already been uploaded to a cloud service

    // Check if user already has 3 resumes
    const resumeCount = await Resume.countDocuments({ user: req.user._id });
    if (resumeCount >= 3) {
      return res
        .status(400)
        .json({ message: "You cannot upload more than three resumes" });
    }

    let imageUrl: string[] = [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Upload main image
      if (files.images) {
        imageUrl = await uploadMediaToCloudinary(
          "resume",
          req.user.id,
          files.images,
          "userFiles"
        );
      }
    }

    // Create and save the new resume
    const resume = new Resume({
      user: req.user._id,
      fileUrl,
    });

    await resume.save();
    res.status(201).json({ message: "Resume uploaded successfully", resume });
  }
);

export const getResumes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const resumes = await Resume.find({ user: req.user._id });
    res.status(200).json(resumes);
  }
);

export const deleteResume = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { resumeId } = req.params;

    // Find the resume
    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Delete the resume
    await Resume.deleteOne({ _id: resumeId });
    res.status(200).json({ message: "Resume deleted successfully" });
  }
);
