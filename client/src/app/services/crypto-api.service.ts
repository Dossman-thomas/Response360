import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CryptoService } from './crypto.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CryptoApiService {
  private apiUrl = 'http://localhost:5000/api/crypto/decrypt'; // Backend API URL

  constructor(private http: HttpClient, private cryptoService: CryptoService) {}

  sendEncryptedData(encryptedText: string): Observable<any> {
    if (!encryptedText) {
      console.error('❌ No data provided for encryption.');
      return throwError(() => new Error('No data provided for encryption.'));
    }

    // Send the encrypted data to the backend
    return this.http.post(this.apiUrl, { encryptedText }).pipe(
      catchError((error) => {
        console.error('❌ Error sending encrypted data:', error);
        return throwError(() => error);
      })
    );
  }
}
