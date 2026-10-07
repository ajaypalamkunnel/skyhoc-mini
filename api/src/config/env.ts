import "dotenv/config";
import process from "node:process";

const requiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  clientUrl: requiredEnv("CLIENT_URL"),
  databaseUrl: requiredEnv("DATABASE_URL"),

  jwt: {
    accessSecret: requiredEnv("JWT_ACCESS_SECRET"),
    refreshSecret: requiredEnv("JWT_REFRESH_SECRET"),
    accessExpiresIn: requiredEnv("JWT_ACCESS_EXPIRES_IN"),
    refreshExpiresIn: requiredEnv("JWT_REFRESH_EXPIRES_IN"),
  },
} as const;