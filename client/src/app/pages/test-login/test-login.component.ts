import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-test-login',
  templateUrl: './test-login.component.html',
  styleUrls: ['./test-login.component.css']
})
export class TestLoginComponent {

  constructor(private authService: AuthService, private toastr: ToastrService) { }

  testLogin(): void {
    const encryptedUsername = 'testuser'; // Replace with the encrypted username
    const encryptedPassword = 'testpassword'; // Replace with the encrypted password

    this.authService.login(encryptedUsername, encryptedPassword)
      .subscribe(
        (res: any) => {
          if (res?.Status === 1) {
            // this.toastr.success(res.Message, 'Success');
            console.log(res); 
          } else {
            // this.toastr.error(res.Message, 'Error');
            console.log('something went wrong.')
          }
        },
        (err) => {
          // this.toastr.error('Login failed', 'Error');
          console.log(err);
        }
      );
  }
}
