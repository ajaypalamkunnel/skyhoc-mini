import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/app-error";
import { ERROR_CODES } from "../utils/error-codes";
import { HTTP_STATUS } from "../utils/http-status";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const accessToken = req.cookies?.access_token;

  if (!accessToken) {
    throw new AppError(
      "Authentication required",
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED,
    );
  }

  try {
    const payload = verifyAccessToken(accessToken);

    req.auth = payload;

    next();
  } catch {
    throw new AppError(
      "Invalid or expired access token",
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.INVALID_TOKEN,
    );
  }
};