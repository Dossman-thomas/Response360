// client/src/app/services/imageUpload.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private uploadUrl = '/api/image/upload-logo';

  constructor(private http: HttpClient) {}

  uploadLogo(file: File): Observable<{ message: string; path: string }> {
    const formData = new FormData();
    formData.append('logo', file);

    return this.http.post<{ message: string; path: string }>(this.uploadUrl, formData);
  }
}
