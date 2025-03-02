import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

// Get public key from environment variables (Ensure it's 32 bytes)
const PUBKEY = process.env.Pub_key;
const IV_LENGTH = 16; // AES block size

// Generate a random IV
const generateIV = () => crypto.randomBytes(IV_LENGTH);

// Encrypt function
export const encryptCryptoService = (data) => {
  if (!data) {
    console.warn("⚠️ Warning: No data provided for encryption.");
    return "";
  }

  // Generate a random 16-byte key (UUID equivalent)
  const uuid = crypto.randomBytes(16).toString('hex'); // Generates 16 bytes in hex format

  // Ensure the UUID key is 32 bytes
  const uuidKey = crypto.createHash('sha256').update(uuid).digest();

  const iv = generateIV(); // Generate IV only once

  // First level encryption
  const cipher1 = crypto.createCipheriv('aes-256-cbc', uuidKey, iv);
  let firstEncrypt = cipher1.update(JSON.stringify(data), 'utf8', 'base64');
  firstEncrypt += cipher1.final('base64');

  const combined = `${uuid}###${firstEncrypt}`;

  // Second level encryption
  const cipher2 = crypto.createCipheriv('aes-256-cbc', PUBKEY, iv);
  let finalEncrypt = cipher2.update(combined, 'utf8', 'base64');
  finalEncrypt += cipher2.final('base64');

  // Combine final encryption with IV
  const encryptedString = `${finalEncrypt}:${iv.toString('base64')}`;

  return { encryptedText: encryptedString };
};

// Decrypt function
export const decryptCryptoService = (encryptedText) => {
  if (!encryptedText) {
    console.error("❌ Error: No encrypted text provided for decryption.");
    return "";
  }

  // Extract IV from the concatenated string
  const [encryptedPayload, ivBase64] = encryptedText.split(":");

  if (!ivBase64) {
    console.error("❌ Error: No IV found in encrypted text.");
    return "";
  }

  // Convert IV from Base64
  const iv = Buffer.from(ivBase64, 'base64');

  // First decryption attempt
  const decipher1 = crypto.createDecipheriv('aes-256-cbc', PUBKEY, iv);
  let decrypted = decipher1.update(encryptedPayload, 'base64', 'utf8');
  decrypted += decipher1.final('utf8');

  const [uuid, firstEncryptedData] = decrypted.split("###");

  // Convert UUID to 32-byte key
  const uuidKey = crypto.createHash('sha256').update(uuid).digest();

  // Second decryption attempt
  const decipher2 = crypto.createDecipheriv('aes-256-cbc', uuidKey, iv);
  let decryptedPayload = decipher2.update(firstEncryptedData, 'base64', 'utf8');
  decryptedPayload += decipher2.final('utf8');

  return JSON.parse(decryptedPayload);
};
