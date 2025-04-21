import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordsService } from '../../services/passwords.service';
import { CryptoService } from '../../services/crypto.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-my-account',
  templateUrl: './admin-my-account.component.html',
  styleUrls: ['./admin-my-account.component.css'],
})
export class AdminMyAccountComponent implements OnInit {
  showPasswordForm = false;
  passwordForm!: FormGroup;
  userEmail: string | null = '';
  userData: any = {};
  showNewPassword = false;
  showConfirmPassword = false;
  showCurrentPassword = false;
  currentPasswordVerified = false; 
  verifyingPassword = false; 

  constructor(
    private fb: FormBuilder,
    private passwordsService: PasswordsService,
    private cryptoService: CryptoService,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private userService: UserService
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

    // Call getUserByEmailService to fetch user info
    if (this.userEmail) {
      this.userService.getUserByEmail(this.userEmail).subscribe(
        (user) => {
          this.userData = user;
        },
        (error) => {
          console.error('Error fetching user data:', error);
          this.toastr.error('Failed to fetch user data');
        }
      );
    }

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );
    
  }

  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
    this.passwordForm.reset();
  }
  
  toggleCurrentPasswordVisibility(){
    this.showCurrentPassword = !this.showCurrentPassword;
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

  verifyCurrentPassword() {
    const currentPassword = this.passwordForm.get('currentPassword')?.value;
  
    if (!this.userEmail || !currentPassword) return;
  
    this.verifyingPassword = true;
    this.passwordsService.verifyCurrentPassword(this.userEmail, currentPassword).subscribe(
      (res) => {
        this.verifyingPassword = false;
        if (res.success) {
          this.currentPasswordVerified = true;
          this.toastr.success('Current password confirmed');
        } else {
          this.currentPasswordVerified = false;
          this.toastr.error('Incorrect current password');
        }
      },
      (err) => {
        this.verifyingPassword = false;
        this.currentPasswordVerified = false;
        this.toastr.error('Password verification failed');
        console.error('Error verifying password:', err);
      }
    );
  }
  

  updatePassword() {
    const storedUserId = localStorage.getItem('userId');
  
    if (!storedUserId) {
      console.error('User ID not found in local storage');
      this.toastr.error('Something went wrong. Please try again.');
      return;
    }
  
    const userId = this.cryptoService.Decrypt(storedUserId);
    const currentPassword = this.passwordForm.get('currentPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;
  
    if (!this.userEmail || !currentPassword || !newPassword) {
      this.toastr.error('Please fill out all password fields');
      return;
    }
  
    // Step 1: Verify current password
    this.passwordsService.verifyCurrentPassword(this.userEmail, currentPassword).subscribe(
      (verifyRes) => {
        if (!verifyRes.success) {
          this.toastr.error('Current password is incorrect');
          return;
        }
  
        // Step 2: Update password
        this.passwordsService.updatePassword(userId, newPassword).subscribe(
          (updateRes) => {
            if (updateRes.success) {
              this.toastr.success('Password updated successfully');
              this.passwordForm.reset();
              this.togglePasswordForm();
            } else {
              console.error('Error updating password:', updateRes.message);
              this.toastr.error(updateRes.message || 'Failed to update password');
            }
          },
          (updateErr) => {
            console.error(updateErr);
            this.toastr.error('Error updating password');
            this.passwordForm.reset();
          }
        );
      },
      (verifyErr) => {
        console.error('Error verifying current password:', verifyErr);
        this.toastr.error('Failed to verify current password');
      }
    );
  }
  
}
