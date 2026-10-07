import { randomBytes } from "node:crypto";
import { RoleStatus, RoleType } from "../../../generated/prisma/enums";
import { AppError } from "../../../utils/app-error";
import { ERROR_CODES } from "../../../utils/error-codes";
import { HTTP_STATUS } from "../../../utils/http-status";
import { hashPassword, verifyPassword } from "../../../utils/password";
import { LoginInput, SignupInput } from "../dto/auth.dto";
import { IAuthRepository } from "../repository/auth.repository.interface";
import { AuthTokens, IAuthService } from "./auth.service.interface";
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwt";
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

    // 1. Create a temporary value for the session.
    // The real refresh-token hash will replace this immediately.
    const temporaryTokenHash = randomBytes(32).toString("hex");

    // 2. Create the database session.
    const session = await this.authRepository.createSession({
      userId: user.id,
      refreshTokenHash: temporaryTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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

}