import * as crypto from 'crypto-js';
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../shared/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  pkey: any = environment.pubkey.split('v1s');
  pubkey: any = crypto.enc.Utf8.parse(this.pkey[0]);

  // Generate random IV (16 bytes)
  generateIV() {
    return crypto.lib.WordArray.random(16);
  }

  // Encrypt function
  Encrypt(text: any) {
    if (!text) {
      return '';
    }
  
    const uuid = uuidv4().replace(/-/g, '');
    const iv = this.generateIV(); // Generate IV only once
  
    // First level encryption (use the same IV)
    const firstEncrypt = crypto.AES.encrypt(
      JSON.stringify(text),
      crypto.enc.Utf8.parse(uuid),
      { iv: iv } // Ensure IV is passed
    ).toString();
  
    const combined = `${uuid}###${firstEncrypt}`;
  
    // Second level encryption (use the same IV)
    const finalEncrypt = crypto.AES.encrypt(combined, this.pubkey, {
      iv: iv, // SAME IV used here
    }).toString();
  
    return {
      encryptedData: finalEncrypt,
      iv: crypto.enc.Base64.stringify(iv), // Send IV separately
    };
  }
  

  // Decrypt function
  Decrypt(encryptedData: string, ivBase64: string) {
    if (!encryptedData) {
      return '';
    }

    const iv = crypto.enc.Base64.parse(ivBase64); // Parse Base64 IV

    // First decryption using public key
    const decrypted = crypto.AES.decrypt(encryptedData, this.pubkey, { iv: iv }).toString(crypto.enc.Utf8);
    const [uuid, encryptedPayload] = decrypted.split('###');

    const firstKey = crypto.enc.Utf8.parse(uuid);

    // Second decryption with extracted UUID key
    const decryptedPayload = crypto.AES.decrypt(encryptedPayload, firstKey, { iv: iv }).toString(crypto.enc.Utf8);

    return JSON.parse(decryptedPayload);
  }
}
