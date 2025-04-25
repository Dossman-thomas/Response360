import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { logServiceError } from '../utils/index.js';
import { env } from '../config/index.js'; 

const pubkey = env.encryption.pubkey; 

if(!pubkey) {
  console.error('❌ Error: Public key is not defined in the environment variables.');
  throw new Error('Public key is required for encryption/decryption.');
}

const parsedPubKey = CryptoJS.SHA256(pubkey); // Parse key to always produce a 256-bit (32-bytes) key

// Function to generate random IV
const generateIV = () => CryptoJS.lib.WordArray.random(16);

// Encrypt function
export const encryptService = (data) => {
  try {
    if (!data || typeof data !== 'object' && typeof data !== 'string') {
      console.warn('⚠️ Warning: Invalid data provided for encryption.');
      throw new Error('Data must be an object or string for encryption.');
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
    logServiceError('encryptService', error);
    throw new Error('Encryption failed');
  }
};

export const decryptService = (payload) => {
  try {
    if (!payload || typeof payload !== 'string') {
      console.error('❌ decryptService: Invalid encrypted payload.');
      throw new Error('Encrypted payload must be a non-empty string.');
    }

    const [encryptedPayload, ivBase64] = payload.split(':');

    if (!ivBase64) {
      console.error('❌ decryptService: Missing IV in encrypted payload.');
      throw new Error('Missing IV in encrypted payload.');
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
      throw new Error('First decryption failed');
    }

    if (!firstDecryption.includes('###')) {
      console.error(
        '❌ decryptService: Malformed decrypted data — delimiter not found.'
      );
      throw new Error('Malformed decrypted data — delimiter not found');
    }

    const [uuid, firstEncryptedData] = firstDecryption.split('###');
    const firstKey = CryptoJS.enc.Utf8.parse(uuid);

    // Second decryption
    const finalDecryption = CryptoJS.AES.decrypt(firstEncryptedData, firstKey, {
      iv,
    }).toString(CryptoJS.enc.Utf8);

    return JSON.parse(finalDecryption);
  } catch (error) {
    logServiceError('decryptService', error);
    throw new Error(`Decryption failed: ${error.message}`);
  }
};
