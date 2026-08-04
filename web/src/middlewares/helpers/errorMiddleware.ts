import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../../utils/errorHandler";

/**
 * Central Express error handler.
 *
 * Every controller uses asyncErrorHandler + next(new ErrorHandler(msg, code))
 * to surface errors, but nothing was turning those into JSON responses —
 * they fell through to Express's default HTML error page. This middleware
 * normalizes all errors (ErrorHandler instances, Mongoose errors, JWT
 * errors, or anything else) into a consistent `{ success, message }` JSON
 * shape so the frontend can always show a clear error message.
 */
const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err instanceof ErrorHandler ? err : new ErrorHandler(err?.message || "Internal Server Error", err?.statusCode || 500);

  // Invalid Mongo ObjectId
  if (err?.name === "CastError") {
    error = new ErrorHandler(`Resource not found. Invalid: ${err.path}`, 400);
  }

  // Duplicate key (e.g. email already registered)
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(", ");
    error = new ErrorHandler(`Duplicate field value entered: ${field}`, 400);
  }

  // Invalid / expired JWT
  if (err?.name === "JsonWebTokenError") {
    error = new ErrorHandler("Invalid authentication token, please login again", 401);
  }
  if (err?.name === "TokenExpiredError") {
    error = new ErrorHandler("Session expired, please login again", 401);
  }

  // Mongoose validation error
  if (err?.name === "ValidationError") {
    const message = Object.values(err.errors as Record<string, any>)
      .map((val: any) => val.message)
      .join(", ");
    error = new ErrorHandler(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Something went wrong",
  });
};

export default errorMiddleware;
