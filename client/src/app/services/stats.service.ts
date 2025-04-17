import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../shared/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  constructor(private http: HttpClient) { }

  // Function to get the dashboard stats
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${environment.backendUrl}/stats/count`);
  }
}
