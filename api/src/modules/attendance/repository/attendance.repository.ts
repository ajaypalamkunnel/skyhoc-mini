import { prisma } from "../../../config/database";
import type {
  AttendanceEvent,
  AttendanceRecord,
} from "../../../generated/prisma/client";
import type {
  CreateAttendanceEventData,
  CreateAttendanceRecordData,
  IAttendanceRepository,
  LiveClassWithScheduleAndCourseAccess,
} from "./attendance.repository.interface";

export class AttendanceRepository implements IAttendanceRepository {
  async findLiveClassWithCourseAccess(
    liveClassId: number,
    userId: number,
  ): Promise<LiveClassWithScheduleAndCourseAccess | null> {
    return prisma.liveClass.findUnique({
      where: { id: liveClassId },
      select: {
        id: true,
        startsAt: true,
        durationMinutes: true,
        course: {
          select: {
            id: true,
            isActive: true,
            enrollments: {
              where: { userId },
              select: { id: true },
            },
          },
        },
      },
    });
  }

  async findAttendanceRecordByUserAndLiveClass(
    userId: number,
    liveClassId: number,
  ): Promise<AttendanceRecord | null> {
    return prisma.attendanceRecord.findUnique({
      where: {
        userId_liveClassId: {
          userId,
          liveClassId,
        },
      },
    });
  }

  async findAttendanceEventsByUserAndLiveClass(
    userId: number,
    liveClassId: number,
  ): Promise<AttendanceEvent[]> {
    return prisma.attendanceEvent.findMany({
      where: {
        userId,
        liveClassId,
      },
      select: {
        id: true,
        liveClassId: true,
        userId: true,
        eventType: true,
        eventAt: true,
        externalEventId: true,
        createdAt: true,
      },
      orderBy: {
        eventAt: "asc",
      },
    });
  }

  async createAttendanceEvent(
    data: CreateAttendanceEventData,
  ): Promise<AttendanceEvent> {
    return prisma.attendanceEvent.create({
      data: {
        liveClassId: data.liveClassId,
        userId: data.userId,
        eventType: data.eventType,
        eventAt: data.eventAt,
        externalEventId: null,
      },
    });
  }

  async createAttendanceRecord(
    data: CreateAttendanceRecordData,
  ): Promise<AttendanceRecord> {
    return prisma.attendanceRecord.create({
      data: {
        userId: data.userId,
        liveClassId: data.liveClassId,
        totalMinutes: data.totalMinutes,
        attendancePercentage: data.attendancePercentage,
        status: data.status,
        calculatedAt: data.calculatedAt,
      },
    });
  }

  async deleteAttendanceForUserAndLiveClass(
    userId: number,
    liveClassId: number,
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.attendanceEvent.deleteMany({
        where: {
          userId,
          liveClassId,
        },
      });

      await tx.attendanceRecord.deleteMany({
        where: {
          userId,
          liveClassId,
        },
      });
    });
  }
}
