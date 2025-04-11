import { Router } from "express";
import { uploadImageController } from "../controllers/index.js";

export const imageUploadRouter = Router();

imageUploadRouter.post("/upload-logo", uploadImageController); // endpoint: /api/image/upload-logo