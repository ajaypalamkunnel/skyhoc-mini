-- CreateEnum
CREATE TYPE "LiveClassStatus" AS ENUM ('SCHEDULED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "live_classes" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "tutor_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "status" "LiveClassStatus" NOT NULL DEFAULT 'SCHEDULED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "live_classes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "live_classes_course_id_idx" ON "live_classes"("course_id");

-- CreateIndex
CREATE INDEX "live_classes_tutor_id_idx" ON "live_classes"("tutor_id");

-- CreateIndex
CREATE INDEX "live_classes_course_id_starts_at_idx" ON "live_classes"("course_id", "starts_at");

-- AddForeignKey
ALTER TABLE "live_classes" ADD CONSTRAINT "live_classes_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "live_classes" ADD CONSTRAINT "live_classes_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
