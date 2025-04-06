// Description: Middleware to decrypt an encrypted ID from the request parameters
import { decryptService } from "../services/index.js";

export const decryptIdParam = async (req, res, next) => {
  try {
    const { encryptedId } = req.params;

    if (!encryptedId) {
      return res.status(400).json({ error: 'Missing encryptedId param' });
    }

    const decryptedId = await decryptService(encryptedId);
    req.params.decryptedId = decryptedId;

    next();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid encrypted ID' });
  }
};
