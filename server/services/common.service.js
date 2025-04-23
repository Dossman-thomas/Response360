import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const pubkey = process.env.pubkey; // Public key from .env file
const parsedPubKey = CryptoJS.SHA256(pubkey); // Parse key to always produce a 256-bit (32-bytes) key

// Function to generate random IV
const generateIV = () => CryptoJS.lib.WordArray.random(16);

// Encrypt function
export const encryptService = (data) => {
  try {
    if (!data) {
      console.warn('⚠️ Warning: No data provided for encryption.');
      return '';
    }

    const uuid = uuidv4().replace(/-/g, ''); // Generate UUID and remove dashes

    const iv = generateIV(); // Generate IV only once

    // First level encryption
    const firstEncrypt = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      CryptoJS.enc.Utf8.parse(uuid),
      { iv: iv }
    ).toString();

    const combined = `${uuid}###${firstEncrypt}`;

    // Second level encryption
    const finalEncrypt = CryptoJS.AES.encrypt(combined, parsedPubKey, {
      iv: iv,
    }).toString();

    // Combine final encryption with IV
    const encryptedString = `${finalEncrypt}:${CryptoJS.enc.Base64.stringify(
      iv
    )}`;

    // Return encrypted text
    return encryptedString;
  } catch (error) {
    console.error('❌ encryptService: Error generating IV.', error);
    return null;
  }
};

// Decrypt function
// export const decryptService = (payload) => {
//   if (!payload) {
//     console.error('❌ Error: No encrypted text provided for decryption.');
//     return null;
//   }

//   const [encryptedPayload, ivBase64] = payload.split(':');

//   if (!ivBase64) {
//     console.error('❌ Error: No IV found in encrypted text.');
//     return null;
//   }

//   const iv = CryptoJS.enc.Base64.parse(ivBase64);

//   // First decryption attempt
//   let decrypted;
//   try {
//     decrypted = CryptoJS.AES.decrypt(encryptedPayload, parsedPubKey, {
//       iv,
//     }).toString(CryptoJS.enc.Utf8);
//   } catch (error) {
//     console.error('❌ decryptService: First decryption failed.', error);
//     return null;
//   }

//   if (!decrypted.includes('###')) {
//     console.error('❌ decryptService: Malformed decrypted data.');
//     return null;
//   }

//   const [uuid, firstEncryptedData] = decrypted.split('###');

//   const firstKey = CryptoJS.enc.Utf8.parse(uuid);

//   // Second decryption attempt
//   try {
//     const decryptedPayload = CryptoJS.AES.decrypt(
//       firstEncryptedData,
//       firstKey,
//       { iv }
//     ).toString(CryptoJS.enc.Utf8);
//     return JSON.parse(decryptedPayload);
//   } catch (error) {
//     console.error('❌ decryptService: Failed second decryption.', error);
//     return null;
//   }
// };
export const decryptService = (payload) => {
  try {
    if (!payload) {
      console.error('❌ decryptService: No encrypted text provided.');
      return null;
    }

    const [encryptedPayload, ivBase64] = payload.split(':');

    if (!ivBase64) {
      console.error('❌ decryptService: Missing IV in encrypted payload.');
      return null;
    }

    const iv = CryptoJS.enc.Base64.parse(ivBase64);

    // First decryption
    const firstDecryption = CryptoJS.AES.decrypt(
      encryptedPayload,
      parsedPubKey,
      {
        iv,
      }
    ).toString(CryptoJS.enc.Utf8);

    if (!firstDecryption) {
      console.error('❌ decryptService: First decryption failed and produced an empty result.');
      return null;
    }

    if (!firstDecryption.includes('###')) {
      console.error(
        '❌ decryptService: Malformed decrypted data — delimiter not found.'
      );
      return null;
    }

    const [uuid, firstEncryptedData] = firstDecryption.split('###');
    const firstKey = CryptoJS.enc.Utf8.parse(uuid);

    // Second decryption
    const finalDecryption = CryptoJS.AES.decrypt(firstEncryptedData, firstKey, {
      iv,
    }).toString(CryptoJS.enc.Utf8);

    return JSON.parse(finalDecryption);
  } catch (error) {
    console.error('❌ decryptService: Decryption failed.', error.message);
    return null;
  }
};
