import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();

const pubkey = process.env.pubkey; // Public key from .env file
console.log("🔹 Loaded pubkey from .env:", pubkey);
const parsedPubKey = CryptoJS.enc.Utf8.parse(pubkey);
console.log("✅ Parsed public key:", parsedPubKey.toString());

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
  console.log("✅ Generated UUID for encryption:", uuid);

  const iv = generateIV(); // Generate IV only once
  console.log("✅ Generated IV (raw):", iv.toString());
  console.log("✅ Generated IV (Base64):", CryptoJS.enc.Base64.stringify(iv));

  // First level encryption
  const firstEncrypt = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    CryptoJS.enc.Utf8.parse(uuid),
    { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  ).toString();
  console.log("🔹 First encryption result:", firstEncrypt);

  const combined = `${uuid}###${firstEncrypt}`;
  console.log("🔹 Combined string before second encryption:", combined);

  // Second level encryption
  console.log(
    "🔹 Using parsedPubKey for second encryption:",
    parsedPubKey.toString()
  );

  const finalEncrypt = CryptoJS.AES.encrypt(combined, parsedPubKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
  console.log("✅ Final encryption result:", finalEncrypt);

  return {
    encryptedData: finalEncrypt,
    iv: CryptoJS.enc.Base64.stringify(iv), // Send IV separately
  };
};

// Decrypt function
export const decryptService = (encryptedText, ivBase64) => {
  console.log("🔹 Received encryptedText:", encryptedText);
  console.log("🔹 Received ivBase64:", ivBase64);

  if (!encryptedText) {
    console.error("❌ Error: No encrypted text provided for decryption.");
    return "";
  }

  if (!ivBase64) {
    console.error("❌ Error: No IV provided for decryption.");
    return "";
  }

  try {
    // Convert IV from Base64
    const iv = CryptoJS.enc.Base64.parse(ivBase64);

    if (iv.sigBytes !== 16) {
      console.error("❌ Error: IV length is invalid. Expected 16 bytes.");
      return "";
    }

    console.log("✅ IV successfully parsed (Hex):", iv.toString());

    // Validate and adjust parsedPubKey
    if (!parsedPubKey || !parsedPubKey.sigBytes) {
      console.error("❌ Error: Encryption key is missing or improperly formatted.");
      return "";
    }

    console.log("🔹 Initial parsedPubKey (Hex):", parsedPubKey.toString(CryptoJS.enc.Hex));
    console.log("🔹 Initial Key length in bytes:", parsedPubKey.sigBytes);

    // Ensure the key is exactly 32 bytes
    if (parsedPubKey.sigBytes !== 32) {
      console.warn("⚠️ Warning: Adjusting encryption key length to 32 bytes.");
      parsedPubKey = CryptoJS.enc.Hex.parse(parsedPubKey.toString(CryptoJS.enc.Hex).substring(0, 64));
    }

    console.log("✅ Adjusted parsedPubKey (Hex):", parsedPubKey.toString(CryptoJS.enc.Hex));
    console.log("✅ Adjusted Key length in bytes:", parsedPubKey.sigBytes);

    // First decryption attempt
    const decrypted = CryptoJS.AES.decrypt(encryptedText, parsedPubKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      console.error("❌ Error: First decryption failed, result is empty.");
      return "";
    }

    console.log("🔹 First decryption result:", decrypted);

    // Validate format before splitting
    if (!decrypted.includes("###")) {
      console.error("❌ Error: Decryption failed, missing expected delimiter (###). ");
      return "";
    }

    const [uuid, encryptedPayload] = decrypted.split("###");

    if (!uuid || !encryptedPayload) {
      console.error("❌ Error: Decryption format incorrect, missing UUID or payload.");
      console.log("🔹 Split result:", { uuid, encryptedPayload });
      return "";
    }

    console.log("✅ Extracted UUID:", uuid);
    console.log("✅ Extracted encryptedPayload:", encryptedPayload);

    // Convert UUID to key
    const firstKey = CryptoJS.enc.Utf8.parse(uuid);
    console.log("✅ Parsed firstKey (from UUID):", firstKey.toString(CryptoJS.enc.Hex));

    // Second decryption attempt
    const decryptedPayload = CryptoJS.AES.decrypt(encryptedPayload, firstKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);

    if (!decryptedPayload) {
      console.error("❌ Error: Final decryption failed, result is empty.");
      return "";
    }

    console.log("🔹 Final decryption result:", decryptedPayload);

    // Try parsing JSON, return string if not JSON
    try {
      const parsedData = JSON.parse(decryptedPayload);
      console.log("✅ Successfully parsed decrypted JSON:", parsedData);
      return parsedData;
    } catch (jsonError) {
      console.warn("⚠️ Warning: Decrypted data is not JSON. Returning raw string.");
      return decryptedPayload;
    }
  } catch (error) {
    console.error("❌ Unexpected error during decryption:", error);
    return "";
  }
};
