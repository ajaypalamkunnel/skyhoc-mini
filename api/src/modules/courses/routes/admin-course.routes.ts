import { Router } from "express";
import { AdminCourseController } from "../controller/admin-course.controller";
import { CourseService } from "../service/course.service";
import { CourseRepository } from "../repository/course.repository";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { RoleType } from "../../../generated/prisma/enums";

const router = Router();

const courseRepository = new CourseRepository();
const courseService = new CourseService(courseRepository);
const adminCourseController = new AdminCourseController(courseService);

router.get(
  "/courses",
  authenticate,
  authorize(RoleType.DEPARTMENT_HEAD, RoleType.SUPER_ADMIN),
  adminCourseController.getAllCourses,
);

export default router;
