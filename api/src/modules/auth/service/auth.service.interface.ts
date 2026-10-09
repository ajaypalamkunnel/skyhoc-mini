import type { LoginInput, SignupInput } from "../dto/auth.dto";
import { CurrentUserResponseDTO } from "../dto/auth.response.dto";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthService {
  signup(input: SignupInput): Promise<void>;

  login(
    input: LoginInput,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthTokens>;

  getCurrentUser(
    userId: number,
  ): Promise<CurrentUserResponseDTO>;

  refresh(refreshToken: string): Promise<AuthTokens>;

  logout(refreshToken?: string): Promise<void>;
}