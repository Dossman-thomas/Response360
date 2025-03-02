import { Router } from "express";
import { encryptCryptoController, decryptCryptoController } from "../controllers/index.js";

export const cryptoRouter = Router();

cryptoRouter.post("/encrypt", encryptCryptoController); // endpoint: /api/crypto/encrypt

cryptoRouter.post("/decrypt", decryptCryptoController); // endpoint: /api/crypto/decrypt