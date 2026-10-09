import { Router } from "express";
import { RoleType } from "../../../generated/prisma/enums";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { AttendanceController } from "../controller/attendance.controller";
import { AttendanceRepository } from "../repository/attendance.repository";
import { AttendanceService } from "../services/attendance.service";

const router = Router();

const attendanceRepository = new AttendanceRepository();
const attendanceService = new AttendanceService(attendanceRepository);
const attendanceController = new AttendanceController(attendanceService);

router.get(
  "/live-classes/:liveClassId",
  authenticate,
  authorize(RoleType.STUDENT),
  attendanceController.getAttendanceByLiveClassId,
);

router.get(
  "/live-classes/:liveClassId/events",
  authenticate,
  authorize(RoleType.STUDENT),
  attendanceController.getAttendanceEvents,
);

router.post(
  "/live-classes/:liveClassId/calculate",
  authenticate,
  authorize(RoleType.STUDENT),
  attendanceController.calculateAttendance,
);

router.delete(
  "/live-classes/:liveClassId",
  authenticate,
  authorize(RoleType.STUDENT),
  attendanceController.deleteAttendance,
);

router.post(
  "/events",
  authenticate,
  authorize(RoleType.STUDENT),
  attendanceController.recordAttendanceEvent,
);

export default router;
