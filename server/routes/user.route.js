import { Router } from "express";
import { getUserByEmailController } from "../controllers/index.js";

export const userRouter = Router();

// Get user by email
userRouter.post("/get-by-email", getUserByEmailController); // endpoint: /api/user/get-by-email