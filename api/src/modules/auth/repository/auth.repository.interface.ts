import type { User, Session, Role, RoleType } from "../../../generated/prisma/client";

export type UserWithRole = User & { role: Role };

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<UserWithRole | null>;

  findUserById(userId: number): Promise<UserWithRole | null>;

  createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    roleId: number;
  }): Promise<User>;

  createSession(data: {
    userId: number;
    refreshTokenHash: string;
    expiresAt: Date;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<Session>;

  findRoleByType(roleType: RoleType): Promise<Role | null>;

  findSessionById(sessionId: number): Promise<Session | null>;

  updateSession(
    sessionId: number,
    data: {
      refreshTokenHash?: string;
      expiresAt?: Date;
      lastUsedAt?: Date;
      revokedAt?: Date | null;
    },
  ): Promise<Session>;

  revokeSession(sessionId: number): Promise<Session>;
}