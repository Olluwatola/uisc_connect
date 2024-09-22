import e, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { send400 } from "./../handlers/responseHandlers";

const validateId = (
  field: string = "id",
  location: "params" | "body" | "query" = "params"
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void | e.Response => {
    const value = req[location][field];

    if (!mongoose.isValidObjectId(value)) {
      return send400(res, `ensure the ${field} provided is correct`);
    }

    return next();
  };
};

export default validateId;
