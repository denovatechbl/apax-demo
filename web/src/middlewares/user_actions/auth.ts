import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../../models/userModel";
import ErrorHandler from "../../utils/errorHandler";
import asyncErrorHandler from "../helpers/asyncErrorHandler";

/**
 * Extend Express Request to include user
 * (Ideally place this in a global typings file)
 */
export interface AuthenticatedRequest extends Request {
  user?: any; // replace `any` with IUser if you have a User interface
}

interface DecodedToken extends JwtPayload {
  id: string;
}

// Check if user is authenticated
export const isAuthenticatedUser = asyncErrorHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if (!token) {
      return next(new ErrorHandler("Please Login to Access", 401));
    }

    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    const user = await User.findById(decodedData.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    req.user = user;
    next();
  }
);

// Role-based authorization
export const authorizeRoles =
  (...roles: string[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role: ${req.user?.role} is not allowed`, 403)
      );
    }

    next();
  };