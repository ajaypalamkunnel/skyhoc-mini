/*
  Warnings:

  - You are about to drop the column `ends_at` on the `live_classes` table. All the data in the column will be lost.
  - Added the required column `duration_minutes` to the `live_classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "live_classes" DROP COLUMN "ends_at",
ADD COLUMN     "duration_minutes" INTEGER NOT NULL;
