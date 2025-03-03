import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class CryptoApiService {
  private apiUrl = 'http://localhost:5000/api/crypto/decrypt'; // Backend API URL

  constructor(private http: HttpClient, private cryptoService: CryptoService) {}

  sendEncryptedData(data: any) {
    // Encrypt the data using CryptoService
    const { encryptedText } = this.cryptoService.Encrypto(data);

    if (!encryptedText) {
      console.error('❌ Encryption failed. No data sent.');
      return;
    }

    // Send the encrypted data to the backend
    return this.http.post(this.apiUrl, { encryptedText });
  }
}
