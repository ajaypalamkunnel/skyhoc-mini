import { NextFunction, Request, Response } from "express";
import { RoleType } from "../generated/prisma/enums";
import { AppError } from "../utils/app-error";
import { ERROR_CODES } from "../utils/error-codes";
import { HTTP_STATUS } from "../utils/http-status";

export const authorize = (
  ...allowedRoles: (RoleType | string)[]
) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      throw new AppError(
        "Authentication required",
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.UNAUTHORIZED,
      );
    }

    if (!allowedRoles.includes(req.auth.role)) {
      throw new AppError(
        "You do not have permission to access this resource",
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
      );
    }

    next();
  };
};
