import { Request, Response, NextFunction } from "express";
import { environment } from "../utils/constants";
import { IAppError } from "../interfaces/error";
import logger from "../configs/logger";
import {
  send401,
  send500,
  send422,
  send500dev,
  send404,
} from "./responseHandlers";

const handleJWTError = (res: Response) =>
  send401(res, "Invalid token. Please log in again!");

const handleJWTExpiredError = (res: Response) =>
  send401(res, "Your token has expired! Please log in again.");

const handleDuplicateEmailError = (res: Response) =>
  send422(res, "an account with the email inputted exists already");

const handle404 = (res: Response) =>
  send404(res, "cannot find resource requested on this server");

const sendUnhandledErrorDev = (
  error: IAppError,
  res: Response,
  next: NextFunction
) => {
  send500dev(res, error);
  //next(error);
};

const sendUnhandledErrorProd = (res: Response, next: NextFunction) => {
  send500(res);
  //next(error);
};

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message);

  //only errors that we would have had to handle in a try catch or 500s get here, so we check for some common errors

  let error: IAppError = { ...err };

  //depending on the error your db throws, the below is a sample on how to handle duplicate email message
  // if (
  //   error.message ===
  //   'duplicate key value violates unique constraint "users_email_key"'
  // ){
  //   handleDuplicateEmailError(res);
  //   return;
  // }
  if (error.name === "JsonWebTokenError") {
    handleJWTError(res);
    return;
  }
  if (error.name === "TokenExpiredError") {
    handleJWTExpiredError(res);
    return;
  }

  if (error.statusCode === 404) {
    handle404(res);
    return;
  }
  error.statusCode = 500;
  error.status = "error";
  if (environment === "development") {
    sendUnhandledErrorDev(error, res, next);
  } else if (environment === "production") {
    sendUnhandledErrorProd(res, next);
  }
};
