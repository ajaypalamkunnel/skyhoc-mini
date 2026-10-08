import { Router } from "express";
import { CourseController } from "../controller/course.controller";
import { CourseService } from "../service/course.service";
import { CourseRepository } from "../repository/course.repository";
import { LiveClassController } from "../../live-classes/controller/live-class.controller";
import { LiveClassService } from "../../live-classes/service/live-class.service";
import { LiveClassRepository } from "../../live-classes/repository/live-class.repository";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { RoleType } from "../../../generated/prisma/enums";

const router = Router();

const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository);
const courseController = new CourseController(courseService);

const liveClassRepository = new LiveClassRepository();
const liveClassService = new LiveClassService(liveClassRepository);
const liveClassController = new LiveClassController(liveClassService);

router.get(
  "/my-courses",
  authenticate,
  authorize(RoleType.STUDENT),
  courseController.getMyCourses,
);

router.get(
  "/:courseId/live-classes",
  authenticate,
  authorize(RoleType.STUDENT),
  liveClassController.getCourseLiveClasses,
);

router.get(
  "/:courseId",
  authenticate,
  authorize(RoleType.STUDENT),
  courseController.getCourseById,
);

export default router;
