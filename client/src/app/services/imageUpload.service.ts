import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CryptoService } from './crypto.service';
import { environment } from '../shared/environments/environment';
import { getHeaders } from '../utils/utils/getHeaders.util';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {

  private baseUrl = `${environment.backendUrl}/image`;

  constructor(private http: HttpClient, private cryptoService: CryptoService) {}

  uploadLogo(
    formData: FormData
  ): Observable<{ message: string; path: string }> {
    return this.http
      .post<{ message: string; path: string }>(
        `${this.baseUrl}/upload-logo`,
        formData,
        {
          headers: getHeaders(false), // Set to false for FormData
        }
      )
      .pipe(
        map((response) => ({
          message: response.message,
          path: this.cryptoService.Decrypt(response.path),
        }))
      );
  }
}
