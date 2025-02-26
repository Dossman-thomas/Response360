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
    const { encryptedText } = req.body;

    if (!encryptedText) {
      return res.status(400).json({ error: "Encrypted text missing" });
    }

    // Call the decryption service with the full encryptedText
    const decrypted = decryptService(encryptedText);

    if (!decrypted) {
      return res.status(400).json({ error: "Decryption failed" });
    }

    return res.json({ decrypted });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Decryption error", details: error.message });
  }
};

