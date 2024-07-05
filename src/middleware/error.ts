import { NextFunction, Request, Response, json } from "express";
interface ErrorWithStatusCode extends Error {
  statusCode: number;
}

export default function errorMiddleware(
  err: ErrorWithStatusCode,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const defaultError = {
    statusCode: err.statusCode || 500,
    message: err.message || "Good luck figuring out the error",
  };

  res.status(defaultError.statusCode).json({ message: defaultError.message });
}
