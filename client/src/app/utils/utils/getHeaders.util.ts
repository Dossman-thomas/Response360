// src/app/utils/get-headers.util.ts
import { HttpHeaders } from '@angular/common/http';
// import { CryptoService } from '../../services/crypto.service';

export function getHeaders(): HttpHeaders {
  const encryptedToken = localStorage.getItem('token');

  // When auth is wired, I'll decrypt here
  // const token = CryptoService.Decrypt(encryptedToken);

  return new HttpHeaders({
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${token}`,
  });
}
