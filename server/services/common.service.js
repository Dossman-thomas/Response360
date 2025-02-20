require('dotenv').config(); // Load environment variables from .env.dev
const crypto = require('crypto'); // Use native Node.js crypto module

// Read the public key from environment variables
const pubkey = process.env.pubkey;

// Generate a random IV (Initialization Vector)
const generateIV = () => {
  return crypto.randomBytes(16); // 16 bytes = 128 bits
};

// Function to encrypt data
const encrypt = (text) => {
  if (!text) return '';

  const uuid = crypto.randomUUID().replace(/-/g, ''); 
  const iv = generateIV();
  const key = Buffer.from(uuid, 'utf8');

  // First encryption with a random IV
  const firstCipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let firstEncrypt = firstCipher.update(JSON.stringify(text), 'utf8', 'base64');
  firstEncrypt += firstCipher.final('base64');

  const combined = `${uuid}###${firstEncrypt}`;

  // Second encryption with the public key
  const secondCipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(pubkey, 'utf8'), iv);
  let finalEncrypt = secondCipher.update(combined, 'utf8', 'base64');
  finalEncrypt += secondCipher.final('base64');

  return finalEncrypt;
};

// Function to decrypt data
const decrypt = (encryptedText) => {
  if (!encryptedText) return '';

  const iv = generateIV(); // Assuming the same IV usage as encryption
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(pubkey, 'utf8'), iv);

  // First decryption
  let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  const [uuid, encryptedPayload] = decrypted.split('###');
  const key = Buffer.from(uuid, 'utf8');

  // Second decryption
  const secondDecipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decryptedPayload = secondDecipher.update(encryptedPayload, 'base64', 'utf8');
  decryptedPayload += secondDecipher.final('utf8');

  return JSON.parse(decryptedPayload);
};

module.exports = { encrypt, decrypt };
