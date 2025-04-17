import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../shared/environments/environment';
import { map } from 'rxjs/operators';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  constructor(private http: HttpClient, private cryptoService: CryptoService) {}

  // Function to get the dashboard stats
  getDashboardStats(): Observable<any> {
    return this.http.get(`${environment.backendUrl}/stats/count`).pipe(
      map((response: any) => {
        const decrypted = this.cryptoService.Decrypt(response.data);

        return decrypted;
      })
    );
  }
}
