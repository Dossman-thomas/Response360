// client/src/app/services/imageUpload.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CryptoService } from './crypto.service'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private uploadUrl = 'http://localhost:5000/api/image/upload-logo';

  constructor(private http: HttpClient, private cryptoService: CryptoService) {}

  uploadLogo(formData: FormData): Observable<{ message: string; path: string }> {
    return this.http.post<{ message: string; path: string }>(this.uploadUrl, formData).pipe(
      map(response => ({
        message: response.message,
        path: this.cryptoService.Decrypt(response.path) 
      }))
    );
  }  
}
