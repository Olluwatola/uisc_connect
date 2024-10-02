import { Router } from "express";
import { body, param } from "express-validator";
import validate from "./../middlewares/validate";
import {
  uploadResume,
  getResumes,
  deleteResume,
} from "./../controllers/resume";
import authenticate from "./../middlewares/authenticate";
import { uploadMediaToCloudinary } from "../utils/helpers";
import { handleImageUpload } from "../configs/multer";

const router: Router = Router();

// Upload a resume (authenticated users only)
router.post("/upload", authenticate, handleImageUpload, uploadResume);

// Get all resumes for the authenticated user
router.get("/", authenticate, getResumes);

// Delete a resume by ID (authenticated users only)
router.delete(
  "/:resumeId",
  authenticate,
  [param("resumeId").isMongoId().withMessage("Invalid resume ID")],
  validate,
  deleteResume
);

export default router;
