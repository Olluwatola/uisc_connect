import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/User";
import catchAsync from "../utils/catchAsync";
import {
  send400,
  send404,
  sendCookie,
  sendResponse,
} from "../handlers/responseHandlers";
import {
  generateUserJWT,
  //sendMail
} from "../utils/helpers";
import RoleType from "../enums/RoleType";
import OTP from "../models/OTP";
import OTPType from "../enums/OTPType";
import bcrypt from "bcryptjs";

export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendCookie(req, res, "loggedout", "user successfully logged out");
  }
);

export const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // Extracted from authenticated user

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password and save
    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordLastChanged = new Date();
    await user.save();

    const token = generateUserJWT(user);
    sendCookie(req, res, token, "password successfully changed");
  }
);

export const changePasswordWithJwt = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { newPassword } = req.body;

    User.findByIdAndUpdate(req.user.id, {
      password: await bcrypt.hash(newPassword, 12),
      passwordLastChanged: new Date(),
    });

    sendResponse(res, "password successfully changed, proceed with sign in");
  }
);

export const submitResetCode = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { emailAddress, code } = req.body;

    // Find the user and their OTP
    const user = await User.findOne({ emailAddress });
    if (!user) {
      send404(res, "user not found");
      return;
    }
    const otp = await OTP.findOne({
      user: user._id,
      type: OTPType.forgotPassword,
    });

    if (!otp) {
      send400(
        res,
        "ensure you have submitted a request to reset password before making this request"
      );
      return;
    }

    if (otp.code !== code) {
      send400(res, "wrong code");
      return;
    }
    if (otp.usedAt) {
      send400(
        res,
        "ensure you have submitted a request to reset password before making this request"
      );
      return;
    }
    // Check if OTP is expired
    if (otp.expiration < new Date()) {
      send400(res, "Reset code has expired");
      return;
    }

    // Mark the OTP as used
    otp.usedAt = new Date();
    await otp.save();

    // Generate a JWT for password reset with custom issuer
    const token = generateUserJWT(user, null, true);
    sendCookie(req, res, token, "proceed with attempt to submit new password");
  }
);
export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { emailAddress } = req.body;

    // Check if the user exists
    const user = await User.findOne({ emailAddress });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if an OTP of type 'forgotPassword' already exists
    let otp = await OTP.findOne({
      user: user._id,
      type: OTPType.forgotPassword,
    });

    if (otp) {
      // Update the existing OTP with new values
      otp.code = otpCode;
      otp.expiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      otp.usedAt = undefined;
      otp.createdAt = new Date();
    } else {
      // Create a new OTP if none exists
      otp = new OTP({
        user: user._id,
        code: otpCode,
        type: OTPType.forgotPassword,
        createdAt: new Date(),
        expiration: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
      });
    }

    // Save the updated or new OTP
    await otp.save();

    // Send OTP via email (example email service)
    // await sendMail(
    //   user.emailAddress,
    //   "Your Reset Code",
    //   `Your reset code is: ${otpCode}`
    // );
    console.log(otpCode); // For testing purposes, print OTP to console
    sendResponse(res, "OTP generated and sent to mail");
  }
);

export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, emailAddress, password, matricNo } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne(
      { $or: [{ emailAddress }, { matricNo }] },
      ["email", "matricNo"]
    );
    if (existingUser) {
      if (
        existingUser.emailAddress === emailAddress &&
        existingUser.matricNo === matricNo
      ) {
        send400(res, "email and matric number already taken");
        return;
      } else if (existingUser.emailAddress === emailAddress) {
        send400(res, "email already taken");
        return;
      } else if (existingUser.matricNo === matricNo) {
        send400(res, "matric number already taken");
        return;
      }
    }
    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      emailAddress,
      password,
      matricNo,
      verifiedAt: null,
      suspendedAt: null,
      role: RoleType.A,
    });
    await newUser.save();

    const token = generateUserJWT(newUser);
    sendCookie(req, res, token);
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { emailAddress, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ emailAddress });
    if (!user) {
      send400(res, "email or password wrong");
      return;
    }
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateUserJWT(user);
    sendCookie(req, res, token);
  }
);
