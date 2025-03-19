import { HttpHeaders } from '@angular/common/http';

export class GetHeadersUtil {
  // Create a public method so it can be used elsewhere
  static getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Use JWT token
    });
  }
}