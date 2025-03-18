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
    // Test user email and password
    const user_email = 'johndoe@example.com'; 
    const user_password = 'Admin@123!';

    this.authService.login(user_email, user_password)
      .subscribe(
        (res: any) => {
          if (res?.statusCode === 200) {
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
