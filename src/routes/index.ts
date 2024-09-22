import express, { Router } from "express";
import globalErrorHandler from "../handlers/globalErrorHandler";
import AppError from "../utils/appError";
import authenticate from "../middlewares/authenticate";
import UserRoutes from "./userRoutes";
const router: Router = Router();

//routes go here
//routes that should be defined before express.json should be defined here e.g stripe

router.use(express.json());

// router.use("/auth", AuthRoutes);
router.use("/users", authenticate, UserRoutes);

router.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

router.use(globalErrorHandler);

export default router;
