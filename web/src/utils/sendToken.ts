import { Response, CookieOptions } from "express";
import { IUser } from "../models/userModel";

const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = user.getJWTToken();

  const options: CookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.COOKIE_EXPIRE ?? 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };

  // Cookie is set for same-origin / cookie-based clients. The frontend
  // (Next.js app) instead reads `token` from the JSON body and sends it
  // back as `Authorization: Bearer <token>` — see web/lib/services/auth.ts
  // and web/src/middlewares/user_actions/auth.ts (extractToken).
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

export default sendToken;