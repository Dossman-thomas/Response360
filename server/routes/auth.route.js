import { Router } from "express";
import {
  loginSuperAdminController,
  forgotPasswordController,
  passwordResetController,
} from "../controllers/index.js";


export const authRouter = Router();

authRouter.post("/super-admin/login", loginSuperAdminController); // endpoint: /api/auth/super-admin/login

authRouter.post("/forgot-password", forgotPasswordController); // endpoint: /api/auth/forgot-password

authRouter.post("/reset-password", passwordResetController); // endpoint: /api/auth/reset-password

