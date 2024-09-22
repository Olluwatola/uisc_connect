import { send401 } from "../handlers/responseHandlers";
import catchAsync from "../utils/catchAsync";
import {IJwtPayload} from '../interfaces/jwt'
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtIssuer, jwtSecret } from "../utils/constants";

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
    if (!payload || (payload as JwtPayload).iss !== jwtIssuer) {
      send401(res, "jwt invalid, retry sign in");
      return;
    }

    //const user: UserDocument = await User.findById(payload.id).exec();

    // if (!user) {
    //   send401(res, "ensure user is logged in to perform that action");
    //   return;
    // }

    // if (user.deletedAt) {
    //   send401(res, "you cannot access with a deleted account");
    //   return;
    // }

    //req.user = user;
    next();
  }
);

export default authenticate;
