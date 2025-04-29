import { Router } from 'express';
import {
  getUserByEmailController,
  updateUserPasswordController,
} from '../controllers/index.js';
import { validatePayload } from '../middleware/index.js';

export const userRouter = Router();

// Get user by email
userRouter.post('/get-by-email', validatePayload, getUserByEmailController); // endpoint: /api/user/get-by-email

userRouter.post(
  '/update-password',
  validatePayload,
  updateUserPasswordController
); // endpoint: /api/user/update-password
