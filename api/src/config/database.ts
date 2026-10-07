import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { env } from "./env";

const adapter = new PrismaPg({
  connectionString: env.databaseUrl,
});

export const prisma = new PrismaClient({
  adapter,
});


export const connectDatabase = async (): Promise<void> => {
  await prisma.$connect();

  console.log("✓ Database connected successfully");
};