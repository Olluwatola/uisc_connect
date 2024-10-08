import express, { Router } from "express";
import globalErrorHandler from "../handlers/globalErrorHandler";
import AppError from "../utils/appError";
import authenticate from "../middlewares/authenticate";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import eventRoutes from "./eventRoutes";
import jobRoutes from "./jobRoutes";
import resumeRoutes from "./resumeRoutes";
const router: Router = Router();

//routes go here
//routes that should be defined before express.json should be defined here e.g stripe

router.use(express.json());

router.use("/auth", authRoutes);
router.use("/users", authenticate, userRoutes);
router.use("/events", authenticate, eventRoutes);
router.use("/jobs", authenticate, jobRoutes);
router.use("/resume", authenticate, resumeRoutes);

router.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

router.use(globalErrorHandler);

export default router;
