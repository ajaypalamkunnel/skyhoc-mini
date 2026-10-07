-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('STUDENT', 'TUTOR', 'DEPARTMENT_HEAD', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "RoleStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" "RoleType" NOT NULL,
    "status" "RoleStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_type_key" ON "roles"("type");
