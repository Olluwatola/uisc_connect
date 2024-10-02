import e, { Response, Request } from "express";
import {
  environment,
  forgotPasswordJwtCookieExpiresAfter,
  jwtCookieExpiresAfter,
} from "../utils/constants";

export const sendCookie = (
  req: Request,
  res: Response,
  token: string,
  message?: string,
  isForgotPassword?: boolean
) => {
  res
    .status(201)
    .cookie("uisc_jwt_token", token, {
      expires: isForgotPassword
        ? new Date(
            Date.now() + parseInt(forgotPasswordJwtCookieExpiresAfter as string)
          )
        : new Date(Date.now() + parseInt(jwtCookieExpiresAfter as string)),
      httpOnly: true,
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    })
    .json({
      success: true,
      token: environment === "development" ? token : undefined,
      message: message || "authorized",
    });
};

export const sendResponse = (
  res: Response,
  message: string,
  data?: any,
  code?: number
): e.Response => {
  return res.status(code || 200).json({
    success: true,
    data: data,
    message: message,
  });
};

export const sendError = (
  res: Response,
  message?: string,
  error?: any,
  code?: number
): e.Response => {
  return res.status(code || 400).json({
    success: false,
    error: error,
    message: message || "validation error",
  });
};

export const send400 = (res: Response, message?: string): e.Response => {
  return res.status(400).json({
    success: false,
    message: message || "bad request",
  });
};

export const send409 = (res: Response, message?: string): Response => {
  return res.status(409).json({
    success: false,
    message: message || "conflict",
  });
};

export const send401 = (res: Response, message?: string): e.Response => {
  return res.status(401).json({
    success: false,
    message: message || "unauthorized",
  });
};

export const send422 = (res: Response, message?: string): e.Response => {
  return res.status(422).json({
    success: false,
    message: message || "forbidden: unprocessable entity",
  });
};

export const send403 = (res: Response, message?: string): e.Response => {
  return res.status(403).json({
    success: false,
    message: message || "forbidden",
  });
};

export const send404 = (res: Response, message?: string): e.Response => {
  return res.status(404).json({
    success: false,
    message: message || "no records found",
  });
};

export const send484 = (
  res: Response,
  token: string,
  message?: string
): e.Response => {
  return res.status(484).json({
    message:
      message ||
      "not enough information to complete the request. Please submit details to complete registration.",
    token: token,
  });
};

export const send500 = (res: Response): Response => {
  return res.status(500).json({
    success: false,
    message: "Server error",
  });
};

export const send500dev = (
  res: Response,
  e: any,
  message?: string
): Response => {
  return res.status(500).json({
    success: false,
    error: e,
    message: e.message || message || "Server error",
    stack: e.stack,
  });
};
