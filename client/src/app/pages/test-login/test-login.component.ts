import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-test-login',
  templateUrl: './test-login.component.html',
  styleUrls: ['./test-login.component.scss']
})
export class TestLoginComponent implements OnInit {

  constructor(private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.testLogin();
  }

  testLogin(): void {
    const encryptedUsername = 'testuser'; // Replace with the encrypted username
    const encryptedPassword = 'testpassword'; // Replace with the encrypted password

    this.authService.login(encryptedUsername, encryptedPassword)
      .subscribe(
        (res: any) => {
          if (res?.Status === 1) {
            this.toastr.success(res.Message, 'Success');
          } else {
            this.toastr.error(res.Message, 'Error');
          }
        },
        (err) => {
          this.toastr.error('Login failed', 'Error');
        }
      );
  }
}
