import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();

const pubkey = process.env.pubkey; // Public key from .env file
const parsedPubKey = CryptoJS.enc.Utf8.parse(pubkey); // Parse key to WordArray

// Function to generate random IV
const generateIV = () => CryptoJS.lib.WordArray.random(16);

// Encrypt function
export const encryptService = (data) => {
  if (!data) {
    console.warn("⚠️ Warning: No data provided for encryption.");
    return "";
  }

  const uuid = CryptoJS.lib.WordArray.random(16)
    .toString(CryptoJS.enc.Hex)
    .replace(/-/g, "");

  const iv = generateIV(); // Generate IV only once

  // First level encryption
  const firstEncrypt = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    CryptoJS.enc.Utf8.parse(uuid),
    { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  ).toString();

  const combined = `${uuid}###${firstEncrypt}`;

  // Second level encryption
  const finalEncrypt = CryptoJS.AES.encrypt(combined, parsedPubKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();

  return {
    encryptedData: finalEncrypt,
    iv: CryptoJS.enc.Base64.stringify(iv), // Send IV separately
  };
};

// Decrypt function
export const decryptService = (encryptedText, ivBase64) => {
  if (!encryptedText) {
    console.error("❌ Error: No encrypted text provided for decryption.");
    return "";
  }

  if (!ivBase64) {
    console.error("❌ Error: No IV provided for decryption.");
    return "";
  }

  // Convert IV from Base64
  const iv = CryptoJS.enc.Base64.parse(ivBase64);

  if (iv.sigBytes !== 16) {
    console.error("❌ Error: IV length is invalid. Expected 16 bytes.");
    return "";
  }

  // First decryption attempt
  const decrypted = CryptoJS.AES.decrypt(encryptedText, parsedPubKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);

  const [uuid, encryptedPayload] = decrypted.split("###");

  // Convert UUID to key
  const firstKey = CryptoJS.enc.Utf8.parse(uuid);

  // Second decryption attempt
  const decryptedPayload = CryptoJS.AES.decrypt(encryptedPayload, firstKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);

  const parsedData = JSON.parse(decryptedPayload);

  return parsedData;
};
