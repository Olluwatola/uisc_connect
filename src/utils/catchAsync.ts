import { Request, Response, NextFunction } from "express";

type FunctionWithCatch = (
  arg0: Request,
  arg1: Response,
  arg2: NextFunction
) => any;

const catchAsync = (fn: FunctionWithCatch) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;
