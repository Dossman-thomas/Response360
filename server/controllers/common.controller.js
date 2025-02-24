import { encryptService, decryptService } from "../services/index.js";

// Encrypt Data
export const encryptController = (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ error: "No data provided for encryption" });
    }
    const encrypted = encryptService(data);
    return res.json(encrypted);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Encryption failed", details: error.message });
  }
};

// Decrypt Data
export const decryptController = (req, res) => {
  try {
    const { encryptedData, iv } = req.body;
    if (!encryptedData || !iv) {
      return res.status(400).json({ error: "Encrypted data or IV missing" });
    }
    const decrypted = decryptService(encryptedData, iv);
    return res.json({ decrypted });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Decryption failed", details: error.message });
  }
};
