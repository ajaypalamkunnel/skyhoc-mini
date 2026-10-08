import { Router } from "express";
import { LiveClassController } from "../controller/live-class.controller";
import { LiveClassService } from "../service/live-class.service";
import { LiveClassRepository } from "../repository/live-class.repository";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { RoleType } from "../../../generated/prisma/enums";

const router = Router();

const liveClassRepository = new LiveClassRepository();
const liveClassService = new LiveClassService(liveClassRepository);
const liveClassController = new LiveClassController(liveClassService);

router.get(
  "/my-live-classes",
  authenticate,
  authorize(RoleType.STUDENT),
  liveClassController.getMyLiveClasses,
);

export default router;
