import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AccessTokenPayload {
  userId: number;
  role: string;
}

export interface RefreshTokenPayload {
  userId: number;
  sessionId: number;
}

export const generateAccessToken = (
  payload: AccessTokenPayload,
): string => {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn as jwt.SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (
  payload: RefreshTokenPayload,
): string => {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn as jwt.SignOptions["expiresIn"],
    jwtid: randomUUID(),
  });
};

export const verifyAccessToken = (
  token: string,
): AccessTokenPayload => {
  return jwt.verify(token, env.jwt.accessSecret) as AccessTokenPayload;
};

export const verifyRefreshToken = (
  token: string,
): RefreshTokenPayload => {
  return jwt.verify(token, env.jwt.refreshSecret) as RefreshTokenPayload;
};

export const getRefreshTokenExpiresAt = (): Date => {
  const duration = env.jwt.refreshExpiresIn;
  const match = /^(\d+)([smhdwy])$/.exec(duration.trim());
  if (match) {
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const unitToMs: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
      w: 7 * 24 * 60 * 60 * 1000,
      y: 365 * 24 * 60 * 60 * 1000,
    };
    return new Date(Date.now() + value * (unitToMs[unit] ?? 1000));
  }
  const numeric = Number(duration);
  if (!isNaN(numeric)) {
    return new Date(Date.now() + numeric * 1000);
  }
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
};