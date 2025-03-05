import { Router } from "express";
import { createSuperAdminController } from "../controllers/index.js";

export const superAdminRouter = Router();

superAdminRouter.post("/create-super-admin", createSuperAdminController); // endpoint: /api/super-admin/create-super-admin