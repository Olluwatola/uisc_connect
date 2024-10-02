import e, { NextFunction, Request, Response } from "express";
import { send403, send500 } from "./../handlers/responseHandlers";
import { IUser } from "./../models/User";
import RoleType from "./../enums/RoleType";
import catchAsync from "../utils/catchAsync";

const protect = catchAsync(
  (req: Request, res: Response, next: NextFunction): void | e.Response => {
    if (req.user.role !== RoleType.B && req.user.role !== RoleType.C) {
      return send403(
        res,
        "only admins have the permission to perform that action"
      );
    }
    return next();
  }
);

export default protect;
