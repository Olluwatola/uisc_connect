import { Router } from "express";
import { body } from "express-validator";
import validate from "../middlewares/validate"; // Custom middleware for validation errors
import {
  register,
  login,
  forgotPassword,
  submitResetCode,
  changePasswordWithJwt,
  changePassword,
  logout,
} from "../controllers/auth";
import authenticate, {
  authenticateForgotPasswordJwt,
} from "./../middlewares/authenticate";

const router: Router = Router();

router.post("/logout", authenticate, logout);

router.post(
  "/change-password",
  [
    body("oldPassword", "Old password is required").notEmpty(),
    body(
      "newPassword",
      "New password must be at least 6 characters long"
    ).isLength({ min: 6 }),
    body("passwordConfirm", "Passwords must match")
      .custom((value, { req }) => value === req.body.newPassword)
      .withMessage("new password and confirm password should be the same"),
  ],
  validate,
  authenticate, // Use the existing authentication middleware
  changePassword
);

router.patch(
  "/forgot-password",
  [
    body("newPassword", "Password must be at least 6 characters long").isLength(
      { min: 6 }
    ),
    body("passwordConfirm", "Passwords must match")
      .custom((value, { req }) => value === req.body.newPassword)
      .withMessage("new password and confirm password should be the same"),
  ],
  validate,
  authenticateForgotPasswordJwt, // Custom middleware for password reset JWT
  changePasswordWithJwt
);

router.post(
  "/forgot-password",
  [
    body("emailAddress", "emailAddress is invalid")
      .notEmpty()
      .isEmail()
      .trim()
      .toLowerCase(),
    body("code", "OTP code is required and must be 6 digits")
      .isLength({
        min: 6,
        max: 6,
      })
      .isNumeric()
      .trim(),
  ],
  validate,
  submitResetCode
);

// POST /auth/sign-up
router.post(
  "/sign-up",
  [
    body("firstName", "firstName is required").notEmpty().trim(),
    body("lastName", "lastName is required").notEmpty().trim(),
    body("emailAddress", "email is required and must be valid")
      .notEmpty()
      .withMessage("emailAddress is required")
      .isEmail()
      .withMessage("emailAddress must be valid")
      .trim()
      .toLowerCase(),
    body("password", "password must be at least 6 characters long")
      .notEmpty()
      .isStrongPassword()
      .withMessage("password is required")
      .trim(),
  ],
  validate, // Custom middleware to check for validation errors
  register // Controller function to handle sign-up logic
);

// POST /auth/forgot-password
router.get(
  "/forgot-password",
  [
    body("emailAddress", "emailAddress is required and must be valid")
      .notEmpty()
      .isEmail()
      .withMessage("emailAddress must be valid")
      .trim()
      .toLowerCase(),
  ],
  validate,
  forgotPassword // Controller to handle forgot password logic
);

router.post(
  "/login",
  [
    body("emailAddress", "emailAddress is required and must be valid")
      .notEmpty()
      .isEmail()
      .withMessage("emailAddress must be valid")
      .trim()
      .toLowerCase(),
    body("password", "password is required").notEmpty(),
  ],
  validate, // Custom validation handler
  login // Controller function to handle login logic
);

export default router;
