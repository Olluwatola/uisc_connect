import { send401 } from "../handlers/responseHandlers";
import catchAsync from "../utils/catchAsync";
import { IJwtPayload } from "../interfaces/jwt";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  forgotPasswordJwtIssuer,
  forgotPasswordJwtSecret,
  jwtIssuer,
  jwtSecret,
} from "../utils/constants";
import User, { IUser } from "../models/User";

const authenticate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.headers.authorization?.replace(
      "Bearer ",
      ""
    );
    if (!token) {
      send401(res, "ensure user is logged in");
      return;
    }

    let payload: IJwtPayload | string;
    payload = jwt.verify(token, jwtSecret as string) as IJwtPayload;
    if (!payload || !payload.iat || !payload.iss) {
      send401(res, "jwt invalid, retry sign in");
      return;
    }

    if ((payload as JwtPayload).iss !== jwtIssuer) {
      send401(res, "jwt invalid, retry sign in");
      return;
    }

    const user = await User.findById(payload.id as string);

    if (!user) {
      send401(res, "ensure user is logged in to perform that action");
      return;
    }

    // Check if the JWT issued date is older than passwordLastChanged
    const issuedAt = new Date(payload.iat * 1000); // Convert from seconds to milliseconds
    if (user.passwordLastChanged && issuedAt < user.passwordLastChanged) {
      send401(res, "token is no longer valid, please sign in again");
      return;
    }

    if (user.deletedAt) {
      send401(res, "you cannot access with a deleted account");
      return;
    }

    if (user.suspendedAt) {
      send401(res, "you cannot access with a deleted account");
      return;
    }

    req.user = user;
    next();
  }
);

export const authenticateForgotPasswordJwt = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.headers.authorization?.replace(
      "Bearer ",
      ""
    );
    if (!token) {
      send401(res, "ensure user is logged in");
      return;
    }

    let payload: IJwtPayload | string;
    payload = jwt.verify(
      token,
      forgotPasswordJwtSecret as string
    ) as IJwtPayload;

    if (!payload || !payload.iat || !payload.iss) {
      send401(res, "jwt invalid, retry sign in");
      return;
    }
    if ((payload as JwtPayload).iss !== forgotPasswordJwtIssuer) {
      send401(res, "jwt invalid, retry sign in");
      return;
    }

    const user = await User.findById(payload.id as string);

    if (!user) {
      send401(res, "ensure user is logged in to perform that action");
      return;
    }

    // Check if the JWT issued date is older than passwordLastChanged
    const issuedAt = new Date(payload.iat * 1000); // Convert from seconds to milliseconds
    if (user.passwordLastChanged && issuedAt < user.passwordLastChanged) {
      send401(res, "token is no longer valid, please sign in again");
      return;
    }

    if (user.deletedAt) {
      send401(res, "you cannot access with a deleted account");
      return;
    }

    if (user.suspendedAt) {
      send401(res, "you cannot access with a deleted account");
      return;
    }
    req.user = user;
    next();
  }
);

export default authenticate;
