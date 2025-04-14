// client/src/app/services/imageUpload.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private uploadUrl = 'http://localhost:5000/api/image/upload-logo';

  constructor(private http: HttpClient) {}

  uploadLogo(formData: FormData): Observable<{ message: string; path: string }> {
    return this.http.post<{ message: string; path: string }>(this.uploadUrl, formData);
  }
  
}
