import { Response } from "express";

export const sendSuccess = <T>(
  response: Response,
  statusCode: number,
  message: string,
  data?: T,
): Response => {
  return response.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined && { data }),
  });
};

export const sendError = (
  response: Response,
  statusCode: number,
  message: string,
): Response => {
  return response.status(statusCode).json({
    success: false,
    message,
  });
};