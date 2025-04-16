// Description: Middleware to decrypt an encrypted ID from the request parameters
import { decryptService } from "../services/index.js";

export const decryptOrgIdParam = async (req, res, next) => {
  try {
    let { encryptedOrgId } = req.params;

    if (!encryptedOrgId) {
      return res.status(400).json({ error: 'Missing encryptedId param' });
    }

    // Decode any URL-encoded characters like "%2F, %3D, %2B", etc.
    encryptedOrgId = decodeURIComponent(encryptedOrgId);

    const decryptedOrgId = await decryptService(encryptedOrgId);

    req.params.orgId = decryptedOrgId;

    next();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid encrypted ID' });
  }
};
