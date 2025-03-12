import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CryptoService } from './crypto.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CryptoApiService {
  private apiBackendUrl = 'http://localhost:5000/api/crypto/decrypt'; // Backend API URL

  constructor(private http: HttpClient, private cryptoService: CryptoService) {}

  sendEncryptedData(encryptedText: string): Observable<any> {
    if (!encryptedText) {
      console.error('❌ No data provided for encryption.');
      return throwError(() => new Error('No data provided for encryption.'));
    }

    // Send the encrypted data to the backend
    return this.http.post(this.apiBackendUrl, { encryptedText }).pipe(
      catchError((error) => {
        console.error('❌ Error sending encrypted data:', error);
        return throwError(() => error);
      })
    );
  }

  receiveEncryptedData(encryptedText: string): string {
    if (!encryptedText) {
      console.error('⚠️ No encrypted text provided.');
      throw new Error('No encrypted text provided.');
    }
  
    console.log('🛜 Manually Provided Encrypted Data:', encryptedText);
  
    try {
      // Decrypt the received encrypted text
      const decryptedData = this.cryptoService.Decrypt(encryptedText);
      return decryptedData;
    } catch (decryptionError) {
      console.error('❌ Error decrypting provided data:', decryptionError);
      throw new Error('Decryption failed.');
    }
  }
  
}
