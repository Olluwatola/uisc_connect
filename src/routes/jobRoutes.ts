import { Router } from "express";
import { body, param } from "express-validator";
import validate from "./../middlewares/validate";
import {
  createJobListing,
  getAllJobListings,
  applyToJob,
} from "../controllers/jobListingController";
import authenticate from "./../middlewares/authenticate";

const router: Router = Router();

// Create a job listing (restricted to authenticated users)
router.post(
  "/create",
  authenticate,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("maxResumes")
      .isInt({ gt: 0 })
      .withMessage("Max resumes must be a positive integer"),
  ],
  validate,
  createJobListing
);

// Get all job listings
router.get("/", authenticate, getAllJobListings);

// Apply to a job
router.post(
  "/apply",
  authenticate,
  [
    body("jobId").isMongoId().withMessage("Job ID is required"),
    body("resumeId").isMongoId().withMessage("Resume ID is required"),
  ],
  validate,
  applyToJob
);

export default router;
