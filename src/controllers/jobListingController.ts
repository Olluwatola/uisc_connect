import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import {
  send400,
  send403,
  send404,
  sendResponse,
} from "../handlers/responseHandlers";
import Event from "../models/Event";
import { combineDateAndTime, uploadMediaToCloudinary } from "../utils/helpers";
import EventTicket from "../models/EventTicket";
import UserEventTicket from "../models/UserEventTicket";
import JobListing from "../models/JobListing";
import JobApplication from "../models/JobApplication";
import Resume from "../models/Resume";

export const createJobListing = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, maxResumes } = req.body;

    const jobListing = new JobListing({
      title,
      description,
      createdBy: req.user.id, // Assuming you have user authentication
      maxResumes,
    });

    await jobListing.save();
    // res
    //   .status(201)
    //   .json({ message: "Job listing created successfully", jobListing });
    sendResponse(res, "job listing created successfully");
  }
);

export const getAllJobListings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const jobListings = await JobListing.find().sort({ createdAt: -1 }); // Sort by latest
    sendResponse(res, "fetched all job listings", jobListings);
    //res.status(200).json(jobListings);
  }
);

export const applyToJob = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { jobId, resumeId } = req.body;

    // Ensure the job exists
    const jobListing = await JobListing.findById(jobId);
    if (!jobListing) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    const fetchedResume = await Resume.findById(resumeId);
    if (!fetchedResume) {
      send404(res, "resume not found");
      return;
    }
    if (fetchedResume.user !== req.user.id) {
      send403(res, "you do not have the permission to submit this resume ");
      return;
    }
    // Check if user already applied
    const existingApplication = await JobApplication.findOne({
      user: req.user._id,
      jobListing: jobId,
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied to this job" });
    }

    // Check if the job has reached the maximum number of resumes
    const totalApplications = await JobApplication.countDocuments({
      jobListing: jobId,
    });
    if (totalApplications >= jobListing.maxResumes) {
      return res.status(400).json({
        message: "This job listing has reached the maximum number of resumes",
      });
    }

    // Submit the job application
    const jobApplication = new JobApplication({
      user: req.user._id,
      jobListing: jobId,
      resume: resumeId, // Assuming the user has already uploaded resumes
    });

    await jobApplication.save();
    res.status(201).json({
      message: "Job application submitted successfully",
      jobApplication,
    });
  }
);
