// Description: Middleware to decrypt an encrypted ID from the request parameters
import { decryptService } from "../services/index.js";

export const decryptOrgIdParam = async (req, res, next) => {
  try {
    const { encryptedOrgId } = req.params;

    if (!encryptedOrgId) {
      return res.status(400).json({ error: 'Missing encryptedId param' });
    }

    const decryptedOrgId = await decryptService(encryptedOrgId);
    req.params.decryptedOrgId = decryptedOrgId;

    next();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid encrypted ID' });
  }
};
