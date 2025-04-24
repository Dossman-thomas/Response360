import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../shared/environments/environment';
import { CryptoService } from './crypto.service';
import { getHeaders } from '../utils/utils/getHeaders.util';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private baseUrl = `${environment.backendUrl}/auth/super-admin`; // Base URL for the authentication API

  constructor(
    private http: HttpClient,
    private cryptoService: CryptoService,
    private router: Router,
    private cookieService: CookieService,
    private toastr: ToastrService
  ) {
    this.checkInitialAuthState();
    window.addEventListener('popstate', this.handlePopStateEvent.bind(this));
  }

  private checkInitialAuthState() {
    const token = localStorage.getItem('token');
    this.isLoggedInSubject.next(!!token);
  }

  private handlePopStateEvent() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.isLoggedInSubject.next(false); // Update the subject if the token is missing
      this.router.navigate(['/super-admin-login']);
    }
  }

  setLoggedInState(state: boolean) {
    this.isLoggedInSubject.next(state);
  }

  login(user_email: string, user_password: string, rememberMe: boolean) {
    const encryptedPayload = this.cryptoService.Encrypt({
      user_email,
      user_password,
      rememberMe,
    });

    return this.http.post<any>(
      `${this.baseUrl}/login`,
      { payload: encryptedPayload },
      { headers: getHeaders() }
    );
  }

  logout() {
    // Clear localStorage and cookies
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    // Update authentication state
    this.isLoggedInSubject.next(false);
    // this.toastr.info('Logged out successfully!');

    // Navigate to login page after logout
    this.router.navigate(['/super-admin-login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Check token presence
  }
}
