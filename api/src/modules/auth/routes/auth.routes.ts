import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { AuthService } from "../service/auth.service";
import { AuthRepository } from "../repository/auth.repository";
import { authenticate } from "../../../middleware/auth.middleware";

const router = Router();

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.getCurrentUser);

export default router;