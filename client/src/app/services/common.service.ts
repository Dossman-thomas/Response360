import * as crypto from 'crypto-js';
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../shared/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  // getting pubkey from environment.ts file
  pkey: any = environment.pubkey.split('v1s');
  // convert in utf8 format for encryption and decryption
  pubkey: any = crypto.enc.Utf8.parse(this.pkey[0]);
  // ivarray:any = crypto.enc.Utf8.parse(environment.ivarray);

  // Function to generate random ivarray (Initialization Vector)
  generateIV() {
    return crypto.lib.WordArray.random(16); // Generates random 16 bytes
  }

  // Function is used for encrypt json
  Encrypt(text: any) {
    if (!text) {
      return '';
    }

    // Generate unique id and remove hyphens
    const uuid = uuidv4().replace(/-/g, '');
    // dynamically generate a new IV for each encryption
    const iv = this.generateIV();

    // first level of encryption using a random IV
    let firstEncrypt = crypto.AES.encrypt(
      JSON.stringify(text),
      crypto.enc.Utf8.parse(uuid),
      { iv: iv }
    ).toString();

    let connect = uuid + '###' + firstEncrypt;

    return crypto.AES.encrypt(connect, this.pubkey, {
      iv: iv,
    }).toString();
  }

  // Function is used for decrypt json
  Decrypt(text: any) {
    if (!text) {
      return '';
    }

    // We need to first decrypt using the public key (same IV is used)
    let data = crypto.AES.decrypt(text, this.pubkey).toString(crypto.enc.Utf8);
    let finalstr = data.split('###');

    // Decrypt again with the first IV used during encryption
    const uuid = finalstr[0]; // Extract UUID used during encryption
    const iv = crypto.enc.Utf8.parse(uuid); // Use the same UUID as the IV for decryption

    return JSON.parse(
      crypto.AES.decrypt(finalstr[1], crypto.enc.Utf8.parse(uuid), {
        iv: iv,
      }).toString(crypto.enc.Utf8)
    );
  }
}
