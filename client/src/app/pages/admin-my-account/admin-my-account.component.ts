import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordsService } from '../../services/passwords.service';
import { CryptoService } from '../../services/crypto.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-my-account',
  templateUrl: './admin-my-account.component.html',
  styleUrls: ['./admin-my-account.component.css'],
})
export class AdminMyAccountComponent implements OnInit {
  showPasswordForm = false;
  passwordForm!: FormGroup;
  userEmail: string | null = '';
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private passwordsService: PasswordsService,
    private cryptoService: CryptoService,
    private cookieService: CookieService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const storedEmail = this.cookieService.get('email');

    // Decrypt userEmail from cookies
    if (storedEmail) {
      try {
        this.userEmail = this.cryptoService.Decrypt(storedEmail);
      } catch (err) {
        console.error('Failed to decrypt user email from cookie:', err);
      }
    }

    this.passwordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
    this.passwordForm.reset();
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordsMatchValidator(group: FormGroup) {
    return group.get('newPassword')!.value ===
      group.get('confirmPassword')!.value
      ? null
      : { mismatch: true };
  }

  updatePassword() {
    const storedUserId = localStorage.getItem('userId');

    if (!storedUserId) {
      console.error('User ID not found in local storage');
      return;
    }

    const userId = this.cryptoService.Decrypt(storedUserId);

    const newPassword = this.passwordForm.get('newPassword')!.value;

    this.passwordsService.updatePassword(userId, newPassword).subscribe(
      (res) => {
        if (res.success) {
          this.toastr.success('Password updated successfully');
          this.passwordForm.reset();
          this.togglePasswordForm();
        } else {
          // show error
          console.error('Error updating password:', res.message);
        }
      },
      (err) => {
        console.error(err);
        this.toastr.error('Error updating password');
        this.passwordForm.reset();
      }
    );
  }
}
