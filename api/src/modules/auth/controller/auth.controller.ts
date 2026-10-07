import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../dto/auth.dto";
import type { IAuthService } from "../service/auth.service.interface";
import { HTTP_STATUS } from "../../../utils/http-status";
import { ERROR_CODES } from "../../../utils/error-codes";
import { AppError } from "../../../utils/app-error";
import { sendSuccess } from "../../../utils/api-response";
import { clearAuthCookies, setAuthCookies } from "../../../utils/cookies";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  signup = async (req: Request, res: Response): Promise<void> => {
    const input = signupSchema.parse(req.body);

    await this.authService.signup(input);

    sendSuccess(
      res,
      HTTP_STATUS.CREATED,
      "Account created successfully",
    );
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const input = loginSchema.parse(req.body);
    const userAgent = req.get("user-agent");
    const ipAddress = req.ip;

    const { accessToken, refreshToken } = await this.authService.login(
      input,
      userAgent,
      ipAddress,
    );

    setAuthCookies(res, accessToken, refreshToken);

    sendSuccess(
      res,
      HTTP_STATUS.OK,
      "Login successful",
    );
  };

  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth?.userId) {
      throw new AppError(
        "Authentication required",
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.UNAUTHORIZED,
      );
    }

    const user = await this.authService.getCurrentUser(req.auth.userId);

    sendSuccess(
      res,
      HTTP_STATUS.OK,
      "Current user fetched successfully",
      user,
    );
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new AppError(
        "Refresh token is required",
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.UNAUTHORIZED,
      );
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(refreshToken);

    setAuthCookies(res, accessToken, newRefreshToken);

    sendSuccess(
      res,
      HTTP_STATUS.OK,
      "Token refreshed successfully",
    );
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth?.userId) {
      throw new AppError(
        "Authentication required",
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.UNAUTHORIZED,
      );
    }

    const refreshToken = req.cookies?.refresh_token;

    await this.authService.logout(req.auth.userId, refreshToken);

    clearAuthCookies(res);

    sendSuccess(
      res,
      HTTP_STATUS.OK,
      "Logged out successfully",
    );
  };
}