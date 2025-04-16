import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../shared/environments/environment';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root',
})
export class PasswordsService {
  constructor(private http: HttpClient, private cryptoService: CryptoService) {}

  forgotPassword(email: string) {
    const encryptedPayload = this.cryptoService.Encrypt({ user_email: email });

    return this.http.post<{ success: boolean; message?: string }>(
      `${environment.backendUrl}/auth/forgot-password`,
      { payload: encryptedPayload }
    );
  }

  resetPassword(token: string, newPassword: string) {
    const encryptedPayload = this.cryptoService.Encrypt({ token, newPassword });

    return this.http.post<{ success: boolean; message?: string }>(
      `${environment.backendUrl}/auth/reset-password`,
      { payload: encryptedPayload }
    );
  }
}
