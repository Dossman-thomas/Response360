import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    // Check if the user is already authenticated and redirect to the dashboard if true
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // check if email and password cookies are set
    // Check for stored credentials in cookies and populate the fields
    const storedEmail = this.cookieService.get('email');
    const storedPassword = this.cookieService.get('password');
    const storedRememberMe = this.cookieService.get('rememberMe');

    if (storedEmail) {
      this.email = storedEmail;
    }

    if (storedPassword) {
      this.password = storedPassword;
    }

    if (storedRememberMe) {
      this.rememberMe = true;
    }
  }

  onSubmit() {
    // Call login from the AuthService
    this.authService.login(this.email, this.password, this.rememberMe);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  passwordPattern = '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$'; // Regex for password
}
