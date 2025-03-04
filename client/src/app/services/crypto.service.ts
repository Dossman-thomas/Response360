import * as crypto from 'crypto-js';
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../shared/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private pkey: any = environment.Pub_key;
  private pubkey: any = crypto.enc.Utf8.parse(this.pkey);

  // Generate random IV (16 bytes)
  private generateIV() {
    return crypto.lib.WordArray.random(16);
  }

  // Encrypt function
  Encrypto(data: any) {
    if (!data) {
      console.warn('⚠️ Warning: No data provided for encryption.');
      return { encryptedText: '' };
    }

    const uuid = uuidv4().replace(/-/g, '');
    const uuidKey = crypto.enc.Hex.parse(crypto.SHA256(uuid).toString());
    const iv = this.generateIV();

    // First level encryption
    const firstEncrypt = crypto.AES.encrypt(JSON.stringify(data), uuidKey, {
      iv: iv,
    }).toString();

    const combined = `${uuid}###${firstEncrypt}`;

    // Second level encryption
    const finalEncrypt = crypto.AES.encrypt(combined, this.pubkey, {
      iv: iv,
    }).toString();

    // Concatenate final encryption with IV
    const encryptedString = `${finalEncrypt}:${crypto.enc.Base64.stringify(
      iv
    )}`;

    return { encryptedText: encryptedString };
  }

  // Decrypt function
  Decrypto(encryptedText: string) {
    if (!encryptedText) {
      console.error('❌ Error: No encrypted text provided for decryption.');
      return '';
    }

    const [encryptedPayload, ivBase64] = encryptedText.split(':');

    if (!ivBase64) {
      console.error('❌ Error: No IV found in encrypted text.');
      return '';
    }

    const iv = crypto.enc.Base64.parse(ivBase64);

    // First decryption
    const decrypted = crypto.AES.decrypt(encryptedPayload, this.pubkey, {
      iv: iv,
    }).toString(crypto.enc.Utf8);

    if (!decrypted.includes('###')) {
      console.error(
        '❌ Error: Decryption failed. Malformed first decryption output.'
      );
      return '';
    }

    const [uuid, firstEncryptedData] = decrypted.split('###');

    const uuidKey = crypto.enc.Hex.parse(crypto.SHA256(uuid).toString());

    // Second decryption
    const decryptedPayload = crypto.AES.decrypt(firstEncryptedData, uuidKey, {
      iv: iv,
    }).toString(crypto.enc.Utf8);

    return JSON.parse(decryptedPayload);
  }
}
