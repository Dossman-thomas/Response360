import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../shared/environments/environment';
import { CryptoService } from './crypto.service'; // Import our crypto service

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private cryptoService: CryptoService) {}

  login(user_email: string, user_password: string) {
    const encryptedPayload = this.cryptoService.Encrypt({
      user_email,
      user_password,
    });

    return this.http.post(`http://localhost:5000/api/auth/super-admin/login`, {
      encryptedData: encryptedPayload,
    });
  }
}

