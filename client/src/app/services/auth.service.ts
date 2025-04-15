import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../shared/environments/environment';
import { CryptoService } from './crypto.service';
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

  login(user_email: string, user_password: string, rememberMe: boolean) {
    // Encrypt the user's email, password, and rememberMe before sending it to the server
    const encryptedPayload = this.cryptoService.Encrypt({
      user_email,
      user_password,
      rememberMe,
    });

    // console.log('Payload:', encryptedPayload); // Log to check payload

    return this.http.post<any>(`http://localhost:5000/api/auth/super-admin/login`, {
      payload: encryptedPayload,
    }).subscribe({
      next: (response) => {
        const { token, userId } = response.data;
        
        // Store the token and user in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);

        // Handle "Remember Me" functionality
        if (rememberMe) {
          this.cookieService.set('email', user_email, 90); // Save email for 90 days
          this.cookieService.set('password', user_password, 90); // Save password for 90 days
          this.cookieService.set('rememberMe', 'true', 90); // Save rememberMe flag
        } else {
          // Clear cookies if "Remember Me" is not selected
          this.cookieService.delete('email');
          this.cookieService.delete('password');
          this.cookieService.delete('rememberMe');
        }

        // Update authentication state
        this.isLoggedInSubject.next(true);
        // this.userService.setCurrentUser(user);

        // Notify user and navigate
        this.toastr.success('Logged in successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login error:', err); // Log error for debugging
        this.toastr.error('Invalid credentials. Please try again.');
      },
      complete: () => {
        console.log('Login request completed.');
      }
    });
  }

  logout() {
    // Clear localStorage and cookies
    localStorage.removeItem('token');
    // localStorage.removeItem('currentUser');

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

