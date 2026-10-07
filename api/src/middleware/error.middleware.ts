import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error";
import { ERROR_CODES } from "../utils/error-codes";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });

    return;
  }

  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      console.error(error);
    }

    res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message,
    });

    return;
  }

  console.error("Unhandled Exception:", error);

  res.status(500).json({
    success: false,
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    message: "Internal server error",
  });
};