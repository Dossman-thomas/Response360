import { Router } from "express";
import { loginSuperAdminController } from "../controllers/index.js";
import { forgotPasswordController } from "../controllers/index.js";

export const authRouter = Router();

authRouter.post("/super-admin/login", loginSuperAdminController); // endpoint: /api/auth/super-admin/login

authRouter.post("/forgot-password", forgotPasswordController); // endpoint: /api/auth/forgot-password
