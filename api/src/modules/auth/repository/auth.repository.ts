import { prisma } from "../../../config/database";
import { Role, RoleType } from "../../../generated/prisma/client";
import type { IAuthRepository, UserWithRole } from "./auth.repository.interface";

export class AuthRepository implements IAuthRepository {

    async findUserByEmail(email: string): Promise<UserWithRole | null> {
        return prisma.user.findUnique({
            where: { email },
            include: {
                role: true,
            },
        });
    }

    async findUserById(userId: number): Promise<UserWithRole | null> {
        return prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                role: true,
            },
        });
    }

    async createUser(data: {
        name: string;
        email: string;
        passwordHash: string;
        roleId: number;
    }) {
        return prisma.user.create({
            data,
        });
    }

    async createSession(data: {
        userId: number;
        refreshTokenHash: string;
        expiresAt: Date;
        userAgent?: string;
        ipAddress?: string;
    }) {
        return prisma.session.create({
            data,
        });
    }

    findRoleByType(roleType: RoleType): Promise<Role | null> {
        return prisma.role.findUnique({
            where: { type: roleType },
        });
    }

    async findSessionById(sessionId: number) {
        return prisma.session.findUnique({
            where: {
                id: sessionId,
            },
        });
    }

    async updateSession(
        sessionId: number,
        data: {
            refreshTokenHash?: string;
            expiresAt?: Date;
            lastUsedAt?: Date;
            revokedAt?: Date | null;
        },
    ) {
        return prisma.session.update({
            where: {
                id: sessionId,
            },
            data,
        });
    }

    async revokeSession(sessionId: number) {
        return prisma.session.update({
            where: {
                id: sessionId,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    }
}