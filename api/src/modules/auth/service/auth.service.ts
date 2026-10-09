import { randomBytes } from "node:crypto";
import { RoleStatus, RoleType } from "../../../generated/prisma/enums";
import { AppError } from "../../../utils/app-error";
import { ERROR_CODES } from "../../../utils/error-codes";
import { HTTP_STATUS } from "../../../utils/http-status";
import { hashPassword, verifyPassword } from "../../../utils/password";
import { LoginInput, SignupInput } from "../dto/auth.dto";
import { IAuthRepository } from "../repository/auth.repository.interface";
import { AuthTokens, IAuthService } from "./auth.service.interface";
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiresAt,
  verifyRefreshToken,
  RefreshTokenPayload,
} from "../../../utils/jwt";
import { CurrentUserResponseDTO } from "../dto/auth.response.dto";

export class AuthService implements IAuthService {

    constructor(private readonly authRepository: IAuthRepository) { }

    async signup(input: SignupInput): Promise<void> {
    const existingUser = await this.authRepository.findUserByEmail(
      input.email,
    );

    if (existingUser) {
      throw new AppError(
        "Email is already registered",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.EMAIL_ALREADY_EXISTS,
      );
    }

    const studentRole = await this.authRepository.findRoleByType(
      RoleType.STUDENT,
    );

    if (!studentRole) {
      throw new AppError(
        "Student role is not configured",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.ROLE_NOT_CONFIGURED,
      );
    }

    const passwordHash = await hashPassword(input.password);

    await this.authRepository.createUser({
      name: input.name,
      email: input.email,
      passwordHash,
      roleId: studentRole.id,
    });
  }

  async login(
    input: LoginInput,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthTokens> {
    const user = await this.authRepository.findUserByEmail(input.email);

    if (!user) {
      throw new AppError(
        "Invalid email or password",
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.INVALID_CREDENTIALS,
      );
    }

    const isPasswordValid = await verifyPassword(
      input.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new AppError(
        "Invalid email or password",
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.INVALID_CREDENTIALS,
      );
    }

    if (!user.isActive || user.role.status !== RoleStatus.ACTIVE) {
      throw new AppError(
        "Account is inactive",
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
      );
    }

    // 1. Generate a temporary random value and hash it with Argon2.
    // The real refresh-token hash will replace this immediately.
    const temporaryRandomValue = randomBytes(32).toString("hex");
    const temporaryTokenHash = await hashPassword(temporaryRandomValue);

    // 2. Create the database session.
    const session = await this.authRepository.createSession({
      userId: user.id,
      refreshTokenHash: temporaryTokenHash,
      expiresAt: getRefreshTokenExpiresAt(),
      userAgent,
      ipAddress,
    });

    // 3. Generate refresh token using the newly created session ID.
    const refreshToken = generateRefreshToken({
      userId: user.id,
      sessionId: session.id,
    });

    // 4. Hash the refresh token before storing it.
    const refreshTokenHash = await hashPassword(refreshToken);

    // 5. Replace the temporary value with the real hash.
    await this.authRepository.updateSession(session.id, {
      refreshTokenHash,
    });

    // 6. Generate short-lived access token.
    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role.type,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async getCurrentUser(
  userId: number,
): Promise<CurrentUserResponseDTO> {
  const user = await this.authRepository.findUserById(userId);

  if (!user) {
    throw new AppError(
      "User not found",
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.USER_NOT_FOUND,
    );
  }

  if (
    !user.isActive ||
    user.role.status !== RoleStatus.ACTIVE
  ) {
    throw new AppError(
      "Account is inactive",
      HTTP_STATUS.FORBIDDEN,
      ERROR_CODES.FORBIDDEN,
    );
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.type,
  };
}

  async refresh(refreshToken: string): Promise<AuthTokens> {
    let payload: RefreshTokenPayload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError(
        "Invalid or expired refresh token",
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.INVALID_TOKEN,
      );
    }

    const session = await this.authRepository.findSessionById(payload.sessionId);

    if (!session || session.userId !== payload.userId) {
      throw new AppError(
        "Session not found",
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.SESSION_NOT_FOUND,
      );
    }

    if (session.revokedAt) {
      throw new AppError(
        "Session has been revoked",
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.SESSION_REVOKED,
      );
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      throw new AppError(
        "Session has expired",
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.TOKEN_EXPIRED,
      );
    }

    const isTokenValid = await verifyPassword(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!isTokenValid) {
      throw new AppError(
        "Invalid refresh token",
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.INVALID_TOKEN,
      );
    }

    const user = await this.authRepository.findUserById(session.userId);

    if (!user) {
      throw new AppError(
        "User not found",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.USER_NOT_FOUND,
      );
    }

    if (!user.isActive || user.role.status !== RoleStatus.ACTIVE) {
      throw new AppError(
        "Account is inactive",
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
      );
    }

    const newRefreshToken = generateRefreshToken({
      userId: user.id,
      sessionId: session.id,
    });

    const newRefreshTokenHash = await hashPassword(newRefreshToken);

    await this.authRepository.updateSession(session.id, {
      refreshTokenHash: newRefreshTokenHash,
      lastUsedAt: new Date(),
      expiresAt: getRefreshTokenExpiresAt(),
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role.type,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken?: string): Promise<void> {
    if (!refreshToken) {
      return;
    }

    try {
      const payload = verifyRefreshToken(refreshToken);

      if (payload?.sessionId) {
        const session = await this.authRepository.findSessionById(payload.sessionId);

        if (session && !session.revokedAt) {
          await this.authRepository.revokeSession(session.id);
        }
      }
    } catch {
      // If token is invalid or expired, session cannot be refreshed anyway
    }
  }
}