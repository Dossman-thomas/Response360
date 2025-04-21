import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { CryptoService } from '../../../services/crypto.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isDropdownOpen: boolean = false;
  userEmail: string = '';

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit(): void {
    const storedEmail = this.cookieService.get('email');

    // Decrypt userEmail from cookies
    if (storedEmail) {
      try {
        this.userEmail = this.cryptoService.Decrypt(storedEmail);
      } catch (err) {
        console.error('Failed to decrypt user email from cookie:', err);
      }
    }
  }

  logout(): void {
    this.authService.logout();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
