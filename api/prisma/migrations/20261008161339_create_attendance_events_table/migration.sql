-- CreateEnum
CREATE TYPE "AttendanceEventType" AS ENUM ('JOIN', 'LEAVE');

-- CreateTable
CREATE TABLE "attendance_events" (
    "id" SERIAL NOT NULL,
    "live_class_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_type" "AttendanceEventType" NOT NULL,
    "event_at" TIMESTAMP(3) NOT NULL,
    "external_event_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attendance_events_external_event_id_key" ON "attendance_events"("external_event_id");

-- CreateIndex
CREATE INDEX "attendance_events_user_id_live_class_id_idx" ON "attendance_events"("user_id", "live_class_id");

-- CreateIndex
CREATE INDEX "attendance_events_live_class_id_event_at_idx" ON "attendance_events"("live_class_id", "event_at");

-- AddForeignKey
ALTER TABLE "attendance_events" ADD CONSTRAINT "attendance_events_live_class_id_fkey" FOREIGN KEY ("live_class_id") REFERENCES "live_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_events" ADD CONSTRAINT "attendance_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
